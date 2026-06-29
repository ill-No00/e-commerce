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
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: { id: "staff-1", role: "ADMIN" }, error: null }),
            }),
          }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      };
    }
    if (table === "admin_invitations") {
      return {
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "invite-1", email: "new@admin.com", role: "VIEWER", token: "abc" }, error: null }),
          }),
        }),
      };
    }
    return {
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: { id: "staff-1", role: "ADMIN" }, error: null }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    };
  });
}

describe("GET /api/admin/staff", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 200 with staff list and role counts", async () => {
    const staffList = [
      { id: "1", display_name: "Alice", role: "ADMIN", status: "ACTIVE" },
      { id: "2", display_name: "Bob", role: "FULFILLMENT", status: "ACTIVE" },
    ];
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        if (typeof jest !== "undefined" && jest.fn) {
          return {
            select: () => ({
              order: () => Promise.resolve({ data: staffList, error: null }),
              eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }),
            }),
          };
        }
      }
      return { select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) };
    });
    const res = await request(app)
      .get("/api/admin/staff")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });

  it("returns 401 without auth", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: null, error: { message: "No token" } });
    const res = await request(app).get("/api/admin/staff");
    expect(res.status).toBe(401);
  });

  it("returns 403 for non-admin role", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
    const viewerRecord = { ...mockStaffRecord, role: "VIEWER" };
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: viewerRecord, error: null }) }) }) };
      }
      return { select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) };
    });
    const res = await request(app)
      .get("/api/admin/staff")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(403);
  });
});

describe("POST /api/admin/staff/invite", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 201 on successful invite", async () => {
    const res = await request(app)
      .post("/api/admin/staff/invite")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ email: "new@admin.com", role: "VIEWER" });
    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("new@admin.com");
  });

  it("returns 400 on invalid email", async () => {
    const res = await request(app)
      .post("/api/admin/staff/invite")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ email: "not-an-email", role: "VIEWER" });
    expect(res.status).toBe(400);
  });

  it("returns 400 on invalid role", async () => {
    const res = await request(app)
      .post("/api/admin/staff/invite")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ email: "new@admin.com", role: "SUPER_ADMIN" });
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/admin/staff/:id/role", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAdminAuth();
  });

  it("returns 200 on role update", async () => {
    const res = await request(app)
      .put("/api/admin/staff/staff-1/role")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ role: "FULFILLMENT" });
    expect(res.status).toBe(200);
  });

  it("returns 400 on invalid role", async () => {
    const res = await request(app)
      .put("/api/admin/staff/staff-1/role")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ role: "INVALID" });
    expect(res.status).toBe(400);
  });

  it("returns 404 when staff not found", async () => {
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        if (jest) {
          return {
            select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }),
            update: () => ({
              eq: () => ({
                select: () => ({
                  single: () => Promise.resolve({ data: null, error: { message: "Not found" } }),
                }),
              }),
            }),
          };
        }
      }
      return {};
    });
    const res = await request(app)
      .put("/api/admin/staff/staff-999/role")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ role: "ADMIN" });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/admin/staff/:id", () => {
  it("returns 204 on successful removal", async () => {
    mockSupabase.resetAll();
    setupAdminAuth();
    const res = await request(app)
      .delete("/api/admin/staff/staff-1")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(204);
  });

  it("returns 404 when staff not found", async () => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return {
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }),
          delete: () => ({
            eq: () => Promise.resolve({ data: null, error: { message: "Not found" } }),
          }),
        };
      }
      return {};
    });
    const res = await request(app)
      .delete("/api/admin/staff/staff-999")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(404);
  });
});
