import { jest } from "@jest/globals";
import { createMockSupabase } from "../../setup/mockSupabase.js";
import { adminUserId, validToken, mockAdminUser, mockStaffRecord, createMockProduct, createMockVariant } from "../../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../../src/app.js");
const request = (await import("supertest")).default;

function setupAdminAuth() {
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
  mockSupabase.from.mockImplementation((table) => {
    if (table === "admin_users") {
      return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
    }
    const defaultResult = { data: [], error: null, count: 0 };
    function rangeWithFilters() {
      const p = Promise.resolve(defaultResult);
      p.eq = jest.fn(() => p);
      p.ilike = jest.fn(() => p);
      return p;
    }
    return {
      select: () => ({
        eq: () => Promise.resolve(defaultResult),
        order: () => ({
          range: rangeWithFilters,
        }),
        ilike: () => Promise.resolve(defaultResult),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: "new-prod", name: "Test Product" }, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "prod-1", name: "Updated" }, error: null }),
          }),
        }),
      }),
    };
  });
}

describe("GET /api/admin/inventory", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 200 with products and stats", async () => {
    const product = { ...createMockProduct(), product_variants: [createMockVariant()], categories: { name: "Decks" } };
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      return {
        select: () => ({
          order: () => ({
            range: () => Promise.resolve({ data: [product], error: null, count: 1 }),
          }),
          eq: () => Promise.resolve({ data: [product], error: null, count: 1 }),
          ilike: () => Promise.resolve({ data: [product], error: null, count: 1 }),
        }),
      };
    });
    const res = await request(app)
      .get("/api/admin/inventory")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });

  it("returns 200 with category filter", async () => {
    const res = await request(app)
      .get("/api/admin/inventory?category=decks")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });

  it("returns 200 with search filter", async () => {
    const res = await request(app)
      .get("/api/admin/inventory?search=chrome")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });

  it("returns 401 without auth", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: null, error: { message: "No token" } });
    const res = await request(app).get("/api/admin/inventory");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/admin/inventory/products", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 201 on product creation", async () => {
    const res = await request(app)
      .post("/api/admin/inventory/products")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "Test Deck", slug: "test-deck", base_price_cents: 7999 });
    expect(res.status).toBe(201);
  });

  it("returns 400 when name is missing", async () => {
    const res = await request(app)
      .post("/api/admin/inventory/products")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ slug: "test-deck", base_price_cents: 7999 });
    expect(res.status).toBe(400);
  });

  it("returns 400 when slug is missing", async () => {
    const res = await request(app)
      .post("/api/admin/inventory/products")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "Test Deck", base_price_cents: 7999 });
    expect(res.status).toBe(400);
  });

  it("returns 400 on negative price", async () => {
    const res = await request(app)
      .post("/api/admin/inventory/products")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "Test", slug: "test", base_price_cents: -1 });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/admin/inventory/products/:id", () => {
  it("returns 200 on update", async () => {
    mockSupabase.resetAll();
    setupAdminAuth();
    const res = await request(app)
      .put("/api/admin/inventory/products/prod-1")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "Updated Deck" });
    expect(res.status).toBe(200);
  });

  it("returns 404 when product not found", async () => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      return {
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: "Not found" } }),
            }),
          }),
        }),
      };
    });
    const res = await request(app)
      .put("/api/admin/inventory/products/prod-999")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ name: "Nope" });
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/admin/inventory/products/:id/variants/:variantId/stock", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 200 on stock update", async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      return {
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: "var-1", stock_quantity: 10, stock_status: "IN_STOCK" }, error: null }),
            }),
          }),
        }),
      };
    });
    const res = await request(app)
      .put("/api/admin/inventory/products/prod-1/variants/var-1/stock")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ stock_quantity: 10 });
    expect(res.status).toBe(200);
    expect(res.body.data.stock_status).toBe("IN_STOCK");
  });

  it("sets OUT_OF_STOCK when quantity is 0", async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      return {
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { stock_quantity: 0, stock_status: "OUT_OF_STOCK" }, error: null }),
            }),
          }),
        }),
      };
    });
    const res = await request(app)
      .put("/api/admin/inventory/products/prod-1/variants/var-1/stock")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ stock_quantity: 0 });
    expect(res.status).toBe(200);
    expect(res.body.data.stock_status).toBe("OUT_OF_STOCK");
  });

  it("sets LOW_STOCK when quantity <= 5", async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      return {
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { stock_quantity: 3, stock_status: "LOW_STOCK" }, error: null }),
            }),
          }),
        }),
      };
    });
    const res = await request(app)
      .put("/api/admin/inventory/products/prod-1/variants/var-1/stock")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ stock_quantity: 3 });
    expect(res.status).toBe(200);
    expect(res.body.data.stock_status).toBe("LOW_STOCK");
  });

  it("returns 400 on negative quantity", async () => {
    const res = await request(app)
      .put("/api/admin/inventory/products/prod-1/variants/var-1/stock")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ stock_quantity: -1 });
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/admin/inventory/products/:id", () => {
  it("returns 204 on soft delete", async () => {
    mockSupabase.resetAll();
    setupAdminAuth();
    const res = await request(app)
      .delete("/api/admin/inventory/products/prod-1")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(204);
  });

  it("returns 404 when product not found", async () => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      return {
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: { message: "Not found" } }),
        }),
      };
    });
    const res = await request(app)
      .delete("/api/admin/inventory/products/prod-999")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(404);
  });
});
