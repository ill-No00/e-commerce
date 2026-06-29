import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockCartItem } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

const mockCartId = "cart-0001-0000-0000-000000000001";
const mockFullCart = {
  id: mockCartId,
  user_id: testUserId,
  created_at: "2026-06-28T00:00:00Z",
  updated_at: "2026-06-28T00:00:00Z",
  cart_items: [createMockCartItem()],
};

describe("GET /api/cart", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns cart with items when cart exists", async () => {
    mockSupabase.from
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { id: mockCartId }, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockFullCart, error: null }),
          }),
        }),
      });

    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(mockCartId);
    expect(res.body.data.cart_items).toHaveLength(1);
  });

  test("success — auto-creates cart when none exists", async () => {
    mockSupabase.from
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: mockCartId }, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockFullCart, error: null }),
          }),
        }),
      });

    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(mockCartId);
  });

  test("no auth — returns 401", async () => {
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/cart/items", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — adds new item and returns 201", async () => {
    const newItem = createMockCartItem({ id: "ci-new" });
    mockSupabase.from
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { id: mockCartId }, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: newItem, error: null }),
          }),
        }),
      });

    const res = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        variant_id: "00000000-0000-0000-0000-000000000001",
        quantity: 1,
        unit_price_cents: 8900,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("ci-new");
  });

  test("success — merges quantity when variant already in cart", async () => {
    const existingItem = { id: "ci-existing", quantity: 2 };
    const mergedItem = { id: "ci-existing", quantity: 3, variant_id: "var-0001", cart_id: mockCartId, unit_price_cents: 8900, reserved_until: null };
    mockSupabase.from
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { id: mockCartId }, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve({ data: existingItem, error: null }),
            }),
          }),
        }),
      })
      .mockReturnValueOnce({
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: mergedItem, error: null }),
            }),
          }),
        }),
      });

    const res = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        variant_id: "00000000-0000-0000-0000-000000000001",
        quantity: 1,
        unit_price_cents: 8900,
      });

    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(3);
  });

  test("validation error — missing required fields", async () => {
    const res = await request(app)
      .post("/api/cart/items")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ quantity: 1 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .post("/api/cart/items")
      .send({ variant_id: "00000000-0000-0000-0000-000000000001", quantity: 1, unit_price_cents: 8900 });

    expect(res.status).toBe(401);
  });
});

describe("PUT /api/cart/items/:id", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — updates item quantity and returns 200", async () => {
    const updated = createMockCartItem({ quantity: 3 });
    mockSupabase.from.mockImplementation(() => ({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: updated, error: null }),
          }),
        }),
      }),
    }));

    const res = await request(app)
      .put("/api/cart/items/ci-0001-0000-0000-000000000001")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ quantity: 3 });

    expect(res.status).toBe(200);
    expect(res.body.data.quantity).toBe(3);
  });

  test("validation error — quantity exceeds 99", async () => {
    const res = await request(app)
      .put("/api/cart/items/ci-0001")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ quantity: 100 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("not found — supabase returns error", async () => {
    mockSupabase.from.mockImplementation(() => ({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    }));

    const res = await request(app)
      .put("/api/cart/items/nonexistent")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ quantity: 2 });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Cart item not found");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .put("/api/cart/items/ci-0001")
      .send({ quantity: 2 });

    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/cart/items/:id", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — deletes cart item and returns 204", async () => {
    mockSupabase.from.mockImplementation(() => ({
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }));

    const res = await request(app)
      .delete("/api/cart/items/ci-0001-0000-0000-000000000001")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(204);
  });

  test("not found — supabase returns error", async () => {
    mockSupabase.from.mockImplementation(() => ({
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: "not found" } }),
      }),
    }));

    const res = await request(app)
      .delete("/api/cart/items/nonexistent")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Cart item not found");
  });
});

describe("DELETE /api/cart", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — clears cart and returns 204", async () => {
    mockSupabase.from
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { id: mockCartId }, error: null }),
          }),
        }),
      })
      .mockReturnValueOnce({
        delete: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      })
      .mockReturnValueOnce({
        delete: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      });

    const res = await request(app)
      .delete("/api/cart")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(204);
  });
});
