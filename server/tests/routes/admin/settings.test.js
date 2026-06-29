import { jest } from "@jest/globals";
import { createMockSupabase } from "../../setup/mockSupabase.js";
import { adminUserId, validToken, mockAdminUser, mockStaffRecord, createMockStoreSetting } from "../../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../../src/app.js");
const request = (await import("supertest")).default;

function baseChain(overrides = {}) {
  return {
    select: () => ({
      limit: () => ({
        maybeSingle: () => Promise.resolve(overrides.singleResult || { data: null, error: null }),
      }),
      order: () => Promise.resolve(overrides.orderResult || { data: [], error: null }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve(overrides.insertResult || { data: { id: "new-id" }, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: () => Promise.resolve(overrides.updateResult || { data: { id: "updated" }, error: null }),
        }),
      }),
    }),
    delete: () => ({
      neq: () => Promise.resolve({ data: null, error: null }),
    }),
  };
}

function setupAdmin(tableChain = baseChain()) {
  mockSupabase.resetAll();
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
  mockSupabase.from.mockImplementation((table) => {
    if (table === "admin_users") {
      return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
    }
    return tableChain;
  });
}

describe("GET /api/admin/settings/store", () => {
  it("returns 200 with store settings", async () => {
    setupAdmin(baseChain({ singleResult: { data: createMockStoreSetting(), error: null } }));
    const res = await request(app)
      .get("/api/admin/settings/store")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.store_name).toBe("4WHEELS");
  });

  it("returns 200 with null when no settings exist", async () => {
    setupAdmin();
    const res = await request(app)
      .get("/api/admin/settings/store")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });
});

describe("PUT /api/admin/settings/store", () => {
  it("returns 200 on update", async () => {
    setupAdmin(baseChain({ singleResult: { data: { id: "ss-1" }, error: null }, updateResult: { data: { id: "ss-1", store_name: "4WHEELS" }, error: null } }));
    const res = await request(app)
      .put("/api/admin/settings/store")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ store_name: "4WHEELS" });
    expect(res.status).toBe(200);
  });

  it("returns 201 when creating new settings", async () => {
    setupAdmin(baseChain({ insertResult: { data: { id: "ss-new", store_name: "4WHEELS" }, error: null } }));
    const res = await request(app)
      .put("/api/admin/settings/store")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ store_name: "4WHEELS" });
    expect(res.status).toBe(201);
  });
});

describe("GET /api/admin/settings/notifications", () => {
  it("returns 200", async () => {
    setupAdmin();
    const res = await request(app)
      .get("/api/admin/settings/notifications")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });
});

describe("PUT /api/admin/settings/notifications", () => {
  it("returns 200 on update", async () => {
    setupAdmin(baseChain({ singleResult: { data: { id: "np-1" }, error: null }, updateResult: { data: { id: "np-1" }, error: null } }));
    const res = await request(app)
      .put("/api/admin/settings/notifications")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ low_stock_warning: true });
    expect(res.status).toBe(200);
  });
});

describe("GET /api/admin/settings/integrations", () => {
  it("returns 200", async () => {
    setupAdmin(baseChain({ orderResult: { data: [], error: null } }));
    const res = await request(app)
      .get("/api/admin/settings/integrations")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });
});

describe("PUT /api/admin/settings/integrations/:id/connect", () => {
  it("returns 200 on connect", async () => {
    setupAdmin(baseChain({ updateResult: { data: { id: "int-1", is_connected: true }, error: null } }));
    const res = await request(app)
      .put("/api/admin/settings/integrations/int-1/connect")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.is_connected).toBe(true);
  });

  it("returns 404 on unknown integration", async () => {
    setupAdmin(baseChain({ updateResult: { data: null, error: { message: "Not found" } } }));
    const res = await request(app)
      .put("/api/admin/settings/integrations/int-999/connect")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(404);
  });
});

describe("GET /api/admin/settings/builder", () => {
  it("returns 200 with steps and settings", async () => {
    const promiseResult = { data: [{ id: "bs-1", step_key: "deck", is_enabled: true, sort_order: 1 }], error: null };
    const maybeSingleResult = { data: { id: "bset-1", show_prices_during_build: true }, error: null };
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      if (table === "builder_config") {
        return { select: () => ({ order: () => Promise.resolve(promiseResult) }) };
      }
      if (table === "builder_settings") {
        return { select: () => ({ limit: () => ({ maybeSingle: () => Promise.resolve(maybeSingleResult) }) }) };
      }
      return { select: () => ({ limit: () => Promise.resolve({ data: null, error: null }) }) };
    });
    const res = await request(app)
      .get("/api/admin/settings/builder")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.steps).toBeDefined();
    expect(res.body.data.settings).toBeDefined();
  });
});

describe("PUT /api/admin/settings/builder/steps/:id", () => {
  it("returns 200 on toggle", async () => {
    setupAdmin(baseChain({ updateResult: { data: { id: "bs-1", is_enabled: false }, error: null } }));
    const res = await request(app)
      .put("/api/admin/settings/builder/steps/bs-1")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ is_enabled: false });
    expect(res.status).toBe(200);
  });

  it("returns 400 on non-boolean value", async () => {
    setupAdmin();
    const res = await request(app)
      .put("/api/admin/settings/builder/steps/bs-1")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ is_enabled: "yes" });
    expect(res.status).toBe(400);
  });

  it("returns 404 on unknown step", async () => {
    setupAdmin(baseChain({ updateResult: { data: null, error: { message: "Not found" } } }));
    const res = await request(app)
      .put("/api/admin/settings/builder/steps/bs-999")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ is_enabled: true });
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/admin/settings/builder/settings", () => {
  it("returns 200 on update", async () => {
    setupAdmin(baseChain({ singleResult: { data: { id: "bset-1" }, error: null }, updateResult: { data: { id: "bset-1" }, error: null } }));
    const res = await request(app)
      .put("/api/admin/settings/builder/settings")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ show_prices_during_build: false });
    expect(res.status).toBe(200);
  });

  it("returns 201 when creating", async () => {
    setupAdmin(baseChain({ insertResult: { data: { id: "bset-new" }, error: null } }));
    const res = await request(app)
      .put("/api/admin/settings/builder/settings")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ show_prices_during_build: true });
    expect(res.status).toBe(201);
  });
});

describe("POST /api/admin/settings/danger-zone/reset-builder-data", () => {
  it("returns 200", async () => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockAdminUser }, error: null });
    let callCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === "admin_users") {
        return { select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: mockStaffRecord, error: null }) }) }) };
      }
      const tableHandler = {
        delete: () => ({ neq: () => Promise.resolve({ data: null, error: null }) }),
        update: () => ({ neq: () => Promise.resolve({ data: null, error: null }) }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: {}, error: null }),
          }),
        }),
      };
      return tableHandler;
    });
    const res = await request(app)
      .post("/api/admin/settings/danger-zone/reset-builder-data")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Builder data reset successfully");
  });
});

describe("POST /api/admin/settings/activity-log", () => {
  it("returns 201", async () => {
    setupAdmin(baseChain({ insertResult: { data: { id: "log-1", event_type: "test" }, error: null } }));
    const res = await request(app)
      .post("/api/admin/settings/activity-log")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ event_type: "TEST_ACTION", severity: "INFO" });
    expect(res.status).toBe(201);
  });
});
