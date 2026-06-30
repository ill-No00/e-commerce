import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockOrder, createMockShippingMethod } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("GET /api/orders", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns list of orders", async () => {
    const orders = [createMockOrder(), createMockOrder({ id: "ord-0002", order_number: "4W-XYZ789" })];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: orders, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(orders);
  });

  test("no auth — returns 401", async () => {
    const res = await request(app).get("/api/orders");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders/:id", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns single order by id", async () => {
    const order = createMockOrder();
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: order, error: null }),
          }),
        }),
      }),
    }));

    const res = await request(app)
      .get("/api/orders/ord-0001-0000-0000-000000000001")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(order);
  });

  test("not found — order does not exist", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    }));

    const res = await request(app)
      .get("/api/orders/nonexistent")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Order not found");
  });
});

describe("POST /api/orders", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  const validOrderBody = {
    shipping_address_id: "00000000-0000-0000-0000-000000000010",
    payment_method_id: "00000000-0000-0000-0000-000000000011",
    shipping_method_id: "00000000-0000-0000-0000-000000000012",
    subtotal_cents: 8900,
    shipping_cents: 0,
    tax_cents: 756,
    total_cents: 9656,
    items: [
      { product_name: "Chrome Hearts Deck", variant_label: '8.0"', quantity: 1, unit_price_cents: 8900 },
    ],
  };

  test("success — places order and returns 201", async () => {
    const order = createMockOrder();
    mockSupabase.from.mockImplementation((table) => {
      if (table === "products") {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { product_variants: [{ price_cents: 8900 }] }, error: null }),
            }),
          }),
        };
      }
      if (table === "shipping_methods") {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: { price_cents: 0 }, error: null }),
            }),
          }),
        };
      }
      if (table === "orders") {
        return {
          insert: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: order, error: null }),
            }),
          }),
        };
      }
      if (table === "order_items") {
        return {
          insert: () => Promise.resolve({ error: null }),
        };
      }
      if (table === "carts") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        };
      }
      return {};
    });

    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${validToken}`)
      .send(validOrderBody);

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(order);
  });

  test("validation error — missing required fields", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${validToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("validation error — empty items array", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ ...validOrderBody, items: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("validation error — invalid UUID for shipping_address_id", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ ...validOrderBody, shipping_address_id: "not-a-uuid" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(validOrderBody);

    expect(res.status).toBe(401);
  });
});

describe("GET /api/orders/shipping-methods", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns active shipping methods", async () => {
    const methods = [
      createMockShippingMethod(),
      createMockShippingMethod({ id: "sm-0002", name: "Express", price_cents: 1499, min_business_days: 2, max_business_days: 3 }),
    ];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => Promise.resolve({ data: methods, error: null }),
      }),
    }));

    const res = await request(app)
      .get("/api/orders/shipping-methods")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(methods);
  });
});
