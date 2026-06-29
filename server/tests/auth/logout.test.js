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

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  describe("Success", () => {
    it("returns 200 with logout message when authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.auth.admin.signOut.mockResolvedValue({ error: null });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Logged out successfully");
      expect(mockSupabase.auth.admin.signOut).toHaveBeenCalledWith(validToken);
    });
  });

  describe("Missing or invalid Authorization header", () => {
    it("returns 401 when no Authorization header is provided", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Missing or invalid Authorization header");
      expect(mockSupabase.auth.admin.signOut).not.toHaveBeenCalled();
    });

    it("returns 401 when Authorization header does not start with Bearer", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Token ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Missing or invalid Authorization header");
      expect(mockSupabase.auth.admin.signOut).not.toHaveBeenCalled();
    });

    it("returns 401 when Authorization header is empty", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Missing or invalid Authorization header");
    });

    it("returns 401 when Bearer token is empty string", async () => {
      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", "Bearer ")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(mockSupabase.auth.admin.signOut).not.toHaveBeenCalled();
    });
  });

  describe("Invalid or expired token", () => {
    it("returns 401 when token is invalid", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: "Invalid token" },
      });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token");
      expect(mockSupabase.auth.admin.signOut).not.toHaveBeenCalled();
    });

    it("returns 401 when token is expired", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: null,
        error: { message: "JWT expired" },
      });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token");
      expect(mockSupabase.auth.admin.signOut).not.toHaveBeenCalled();
    });

    it("returns 401 when getUser returns null user without error", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid or expired token");
    });
  });

  describe("Supabase signOut errors", () => {
    it("returns 400 when admin.signOut fails", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.auth.admin.signOut.mockResolvedValue({
        error: { message: "Session not found" },
      });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Session not found");
    });

    it("returns 400 when admin.signOut throws unexpected error", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.auth.admin.signOut.mockResolvedValue({
        error: { message: "Internal error" },
      });

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Internal error");
    });
  });

  describe("Supabase getUser is called with correct token", () => {
    it("calls getUser with the bearer token from header", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.auth.admin.signOut.mockResolvedValue({ error: null });

      await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`);

      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith(validToken);
    });

    it("passes the same token to admin.signOut that was used for getUser", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });
      mockSupabase.auth.admin.signOut.mockResolvedValue({ error: null });

      await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${validToken}`);

      expect(mockSupabase.auth.admin.signOut).toHaveBeenCalledWith(validToken);
    });
  });
});
