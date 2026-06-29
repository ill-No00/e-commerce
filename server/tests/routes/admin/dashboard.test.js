import { jest } from "@jest/globals";
import { createMockSupabase } from "../../setup/mockSupabase.js";
import { adminUserId, validToken, mockAdminUser, mockStaffRecord } from "../../setup/factories.js";

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
    return {
      select: () => ({
        neq: () => Promise.resolve({ data: [], error: null }),
        in: () => ({ select: () => ({ eq: () => Promise.resolve({ data: null, error: null, count: 0 }) }) }),
        eq: () => Promise.resolve({ data: null, error: null, count: 0 }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    };
  });
}

describe("GET /api/admin/dashboard", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 200 with dashboard stats", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.activityLog).toBeDefined();
  });

  it("returns 401 without auth", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: null, error: { message: "No token" } });
    const res = await request(app).get("/api/admin/dashboard");
    expect(res.status).toBe(401);
  });

  it("returns 403 when not admin", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: "user-123" } }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return {
          select: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null, error: { message: "Not found" } }),
            }),
          }),
        };
      }
      return { select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) };
    });
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(403);
  });
});

describe("GET /api/admin/dashboard/activity-log", () => {
  it("returns 200 with activity log", async () => {
    mockSupabase.resetAll();
    setupAdminAuth();
    const res = await request(app)
      .get("/api/admin/dashboard/activity-log")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });
});
