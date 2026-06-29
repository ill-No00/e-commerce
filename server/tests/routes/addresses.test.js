import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockAddress } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("GET /api/addresses", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns array of addresses", async () => {
    const addresses = [
      createMockAddress(),
      createMockAddress({ id: "addr-0002", is_default: false }),
    ];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        order: () => Promise.resolve({ data: addresses, error: null }),
      }),
    }));

    const res = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(addresses);
  });

  test("supabase error — returns 400", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        order: () => Promise.resolve({ data: null, error: { message: "DB error" } }),
      }),
    }));

    const res = await request(app)
      .get("/api/addresses")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("DB error");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app).get("/api/addresses");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/addresses", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — creates address and returns 201", async () => {
    const created = createMockAddress();
    mockSupabase.from.mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: created, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        first_name: "Alex",
        last_name: "Rider",
        street: "1234 Venice Blvd",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90210",
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(created);
  });

  test("validation error — missing required fields", async () => {
    const res = await request(app)
      .post("/api/addresses")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ first_name: "Alex" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .post("/api/addresses")
      .send({
        first_name: "Alex",
        last_name: "Rider",
        street: "1234 Venice Blvd",
        city: "Los Angeles",
        state: "CA",
        zip_code: "90210",
      });

    expect(res.status).toBe(401);
  });
});

describe("PUT /api/addresses/:id", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — updates and returns address", async () => {
    const updated = createMockAddress({ city: "San Francisco" });
    mockSupabase.from.mockImplementation(() => ({
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: updated, error: null }),
            }),
          }),
        }),
      }),
    }));

    const res = await request(app)
      .put("/api/addresses/addr-0001-0000-0000-000000000001")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ city: "San Francisco" });

    expect(res.status).toBe(200);
    expect(res.body.data.city).toBe("San Francisco");
  });

  test("not found — supabase returns error", async () => {
    mockSupabase.from.mockImplementation(() => ({
      update: () => ({
        eq: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: { message: "not found" } }),
            }),
          }),
        }),
      }),
    }));

    const res = await request(app)
      .put("/api/addresses/nonexistent")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ city: "Nowhere" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Address not found");
  });

  test("validation error — empty string for min(1) field", async () => {
    const res = await request(app)
      .put("/api/addresses/addr-0001")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ first_name: "" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });
});

describe("DELETE /api/addresses/:id", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — deletes address and returns 204", async () => {
    mockSupabase.from.mockImplementation(() => ({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .delete("/api/addresses/addr-0001-0000-0000-000000000001")
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
      .delete("/api/addresses/nonexistent")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Address not found");
  });
});
