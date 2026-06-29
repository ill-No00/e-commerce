import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockPaymentMethod } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("GET /api/payment-methods", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns array of payment methods", async () => {
    const methods = [
      createMockPaymentMethod(),
      createMockPaymentMethod({ id: "pm-0002", brand: "Mastercard", last4: "1234", is_default: false }),
    ];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        order: () => Promise.resolve({ data: methods, error: null }),
      }),
    }));

    const res = await request(app)
      .get("/api/payment-methods")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(methods);
  });

  test("no auth — returns 401", async () => {
    const res = await request(app).get("/api/payment-methods");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/payment-methods", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — creates payment method and returns 201", async () => {
    const created = createMockPaymentMethod();
    mockSupabase.from.mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: created, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .post("/api/payment-methods")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        provider: "stripe",
        provider_token: "tok_abc123",
        brand: "Visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2028,
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(created);
  });

  test("validation error — last4 must be exactly 4 characters", async () => {
    const res = await request(app)
      .post("/api/payment-methods")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        provider: "stripe",
        provider_token: "tok_abc123",
        brand: "Visa",
        last4: "42",
        expiry_month: 12,
        expiry_year: 2028,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("validation error — expiry_month out of range (1–12)", async () => {
    const res = await request(app)
      .post("/api/payment-methods")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        provider: "stripe",
        provider_token: "tok_abc123",
        brand: "Visa",
        last4: "4242",
        expiry_month: 13,
        expiry_year: 2028,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .post("/api/payment-methods")
      .send({
        provider: "stripe",
        provider_token: "tok_abc123",
        brand: "Visa",
        last4: "4242",
        expiry_month: 12,
        expiry_year: 2028,
      });

    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/payment-methods/:id", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — deletes payment method and returns 204", async () => {
    mockSupabase.from.mockImplementation(() => ({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .delete("/api/payment-methods/pm-0001-0000-0000-000000000001")
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
      .delete("/api/payment-methods/nonexistent")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Payment method not found");
  });
});
