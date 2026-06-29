import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { mockUser, validToken, invalidToken } from "../setup/factories.js";

const mockSupabase = createMockSupabase();

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: () => mockSupabase,
}));

const { requireAuth, optionalAuth } = await import("../../src/middleware/auth.js");

describe("requireAuth", () => {
  let app;

  beforeEach(() => {
    mockSupabase.resetAll();
    app = express();
    app.get("/protected", requireAuth, (req, res) => {
      res.json({ userId: req.userId, user: req.user });
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  it("returns 401 when Authorization header is missing", async () => {
    const res = await request(app).get("/protected");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Missing or invalid Authorization header" });
  });

  it("returns 401 when token is not Bearer", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Basic token123");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Missing or invalid Authorization header" });
  });

  it("returns 401 when supabase returns an error", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("token expired"),
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid or expired token" });
  });

  it("returns 401 when user is not found", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Invalid or expired token" });
  });

  it("sets req.user and req.userId and calls next on valid token", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: mockUser.id, user: mockUser });
  });
});

describe("optionalAuth", () => {
  let app;

  beforeEach(() => {
    mockSupabase.resetAll();
    app = express();
    app.get("/optional", optionalAuth, (req, res) => {
      res.json({ userId: req.userId, user: req.user });
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  it("sets user to null and calls next when no header is present", async () => {
    const res = await request(app).get("/optional");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: null, user: null });
  });

  it("sets req.user and req.userId on valid token", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    const res = await request(app)
      .get("/optional")
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: mockUser.id, user: mockUser });
  });

  it("sets user to null and silently ignores invalid token", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error("bad token"),
    });

    const res = await request(app)
      .get("/optional")
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ userId: null, user: null });
  });
});
