import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockProfile } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("GET /api/profile", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — returns profile data", async () => {
    const profile = createMockProfile();
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: profile, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(profile);
  });

  test("not found — profile does not exist", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "Profile not found" } }),
        }),
      }),
    }));

    const res = await request(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Profile not found");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app).get("/api/profile");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing or invalid Authorization header");
  });
});

describe("PUT /api/profile", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — updates and returns profile", async () => {
    const updated = createMockProfile({ display_name: "New Name" });
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
      .put("/api/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ display_name: "New Name" });

    expect(res.status).toBe(200);
    expect(res.body.data.display_name).toBe("New Name");
  });

  test("validation error — invalid stance enum", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ stance: "INVALID" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("validation error — display_name exceeds 100 characters", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ display_name: "a".repeat(101) });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .put("/api/profile")
      .send({ display_name: "Name" });

    expect(res.status).toBe(401);
  });

  test("supabase error — returns 400", async () => {
    mockSupabase.from.mockImplementation(() => ({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: "DB constraint violation" } }),
          }),
        }),
      }),
    }));

    const res = await request(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ display_name: "Valid Name" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("DB constraint violation");
  });
});
