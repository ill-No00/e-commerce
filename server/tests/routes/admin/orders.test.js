import { jest } from "@jest/globals";
import { createMockSupabase } from "../../setup/mockSupabase.js";
import { adminUserId, validToken, mockAdminUser, mockStaffRecord, createMockOrder } from "../../setup/factories.js";

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
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: mockStaffRecord, error: null }),
          }),
        }),
      };
    }
    const defaultResult = { data: [], error: null, count: 0 };
    function rangeWithFilters() {
      const p = Promise.resolve(defaultResult);
      p.eq = jest.fn(() => p);
      p.or = jest.fn(() => p);
      return p;
    }
    return {
      select: () => ({
        eq: () => Promise.resolve(defaultResult),
        order: () => ({
          range: rangeWithFilters,
        }),
        or: () => Promise.resolve(defaultResult),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "ord-1", status: "SHIPPED" }, error: null }),
          }),
        }),
      }),
    };
  });
}

describe("GET /api/admin/orders", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 200 with orders", async () => {
    const order = createMockOrder();
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      return {
        select: () => ({
          order: () => ({
            range: () => Promise.resolve({ data: [order], error: null, count: 1 }),
          }),
        }),
      };
    });
    const res = await request(app)
      .get("/api/admin/orders")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination).toBeDefined();
  });

  it("returns 200 with status filter", async () => {
    const res = await request(app)
      .get("/api/admin/orders?status=PROCESSING")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });

  it("returns 200 with search filter", async () => {
    const res = await request(app)
      .get("/api/admin/orders?search=4W-")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });
});

describe("PUT /api/admin/orders/:id/status", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 200 on status update", async () => {
    const res = await request(app)
      .put("/api/admin/orders/ord-1/status")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ status: "SHIPPED" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("SHIPPED");
  });

  it("returns 400 on invalid status", async () => {
    const res = await request(app)
      .put("/api/admin/orders/ord-1/status")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ status: "INVALID" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when order not found", async () => {
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
      .put("/api/admin/orders/ord-999/status")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ status: "CANCELLED" });
    expect(res.status).toBe(404);
  });
});
