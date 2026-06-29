process.env.SUPABASE_URL = "http://localhost:54321";
process.env.SUPABASE_PASS = "test-pass";

import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, expiredToken, invalidToken, mockUser } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("GET /api/auth/session", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  describe("Authenticated", () => {
    it("returns 200 with user object when token is valid", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual(mockUser);
      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith(validToken);
    });

    it("sets req.user and req.userId from the verified user", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.body.user.id).toBe(testUserId);
    });

    it("includes all user metadata in the response", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.body.user.user_metadata).toEqual({
        username: "sk8r99",
        display_name: "Alex Rider",
      });
      expect(res.body.user.email).toBe("skater@4wheels.com");
    });
  });

  describe("Missing Authorization header", () => {
    it("returns 401 when no Authorization header is provided", async () => {
      const res = await request(app)
        .get("/api/auth/session")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Missing or invalid Authorization header");
      expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
    });

    it("returns 401 when Authorization header is empty", async () => {
      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", "")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Missing or invalid Authorization header");
    });

    it("returns 401 when header does not start with Bearer", async () => {
      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Basic ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Missing or invalid Authorization header");
    });

    it("returns 401 when Bearer token is empty", async () => {
      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", "Bearer ")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
    });
  });

  describe("Invalid or expired token", () => {
    it("returns 401 when token is invalid", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: "Invalid token" },
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token");
    });

    it("returns 401 when token is expired", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: "JWT expired" },
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token");
    });

    it("returns 401 when getUser returns null user with no error", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token");
    });

    it("returns 401 when user data is missing from response", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: {},
        error: null,
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token");
    });
  });

  describe("Token verification", () => {
    it("calls supabase.auth.getUser with the exact token from header", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${validToken}`);

      expect(mockSupabase.auth.getUser).toHaveBeenCalledTimes(1);
      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith(validToken);
    });

    it("does not call getUser when auth header is missing", async () => {
      await request(app).get("/api/auth/session");

      expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
    });
  });

  describe("Response structure", () => {
    it("returns only user object in response body", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const res = await request(app)
        .get("/api/auth/session")
        .set("Authorization", `Bearer ${validToken}`);

      expect(Object.keys(res.body)).toEqual(["user"]);
      expect(res.body).not.toHaveProperty("session");
      expect(res.body).not.toHaveProperty("message");
    });
  });
});
