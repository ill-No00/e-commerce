import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockVariant } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

const makeWishlistRow = (overrides = {}) => ({
  id: "wi-0001-0000-0000-000000000001",
  added_at: "2026-06-28T12:00:00Z",
  product_variants: {
    id: "var-0001-0000-0000-000000000001",
    finish_name: "Classic",
    finish_hex: "#FF2D78",
    price_cents: 8900,
    stock_status: "IN_STOCK",
    width: "8.0",
    size_label: '8.0"',
    products: { id: "prod-0001", name: "Chrome Hearts Deck", slug: "chrome-hearts-deck" },
  },
  ...overrides,
});

describe("GET /api/wishlist", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns wishlist items", async () => {
    const items = [makeWishlistRow(), makeWishlistRow({ id: "wi-0002" })];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: items, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(items);
  });

  test("no auth — returns 401", async () => {
    const res = await request(app).get("/api/wishlist");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/wishlist", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — adds item to wishlist and returns 201", async () => {
    const created = makeWishlistRow();
    mockSupabase.from.mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: created, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ variant_id: "00000000-0000-0000-0000-000000000001" });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(created);
  });

  test("validation error — non-uuid variant_id", async () => {
    const res = await request(app)
      .post("/api/wishlist")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ variant_id: "not-a-uuid" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .post("/api/wishlist")
      .send({ variant_id: "00000000-0000-0000-0000-000000000001" });

    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/wishlist/:id", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — deletes wishlist item and returns 204", async () => {
    mockSupabase.from.mockImplementation(() => ({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .delete("/api/wishlist/wi-0001-0000-0000-000000000001")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(204);
  });

  test("not found — supabase returns error", async () => {
    mockSupabase.from.mockImplementation(() => ({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: { message: "not found" } }),
        }),
      }),
    }));

    const res = await request(app)
      .delete("/api/wishlist/nonexistent")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Wishlist item not found");
  });
});
