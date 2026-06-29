import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, adminUserId, mockStaffRecord } from "../setup/factories.js";

const mockSupabase = createMockSupabase();

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: () => mockSupabase,
}));

const { requireAdmin, requireRole } = await import("../../src/middleware/admin.js");

describe("requireAdmin", () => {
  let app;

  beforeEach(() => {
    mockSupabase.resetAll();
    app = express();
    app.use((req, res, next) => {
      req.userId = adminUserId;
      next();
    });
    app.get("/admin", requireAdmin, (req, res) => {
      res.json({ staff: req.staff, role: req.staffRole });
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  it("returns 401 when req.userId is not set", async () => {
    app = express();
    app.get("/admin", requireAdmin, (req, res) => {
      res.json({ staff: req.staff, role: req.staffRole });
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });

    const res = await request(app).get("/admin");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Authentication required" });
  });

  it("returns 403 when admin_users query returns no data", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        })),
      })),
    }));

    const res = await request(app).get("/admin");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "Access denied. Staff privileges required.",
    });
  });

  it("returns 403 when admin_users query returns error", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error("db error"),
          }),
        })),
      })),
    }));

    const res = await request(app).get("/admin");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "Access denied. Staff privileges required.",
    });
  });

  it("returns 403 when staff status is not ACTIVE", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: { ...mockStaffRecord, status: "SUSPENDED" },
            error: null,
          }),
        })),
      })),
    }));

    const res = await request(app).get("/admin");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "Account deactivated. Contact an administrator.",
    });
  });

  it("sets req.staff and req.staffRole and calls next when staff is active", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({
            data: mockStaffRecord,
            error: null,
          }),
        })),
      })),
    }));

    const res = await request(app).get("/admin");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      staff: mockStaffRecord,
      role: mockStaffRecord.role,
    });
  });
});

describe("requireRole", () => {
  let app;

  beforeEach(() => {
    mockSupabase.resetAll();
    app = express();
    app.use((req, res, next) => {
      req.userId = adminUserId;
      req.staff = mockStaffRecord;
      req.staffRole = mockStaffRecord.role;
      next();
    });
    app.get("/superadmin", requireRole("SUPER_ADMIN"), (req, res) => {
      res.json({ ok: true });
    });
    app.get("/admin-route", requireRole("ADMIN"), (req, res) => {
      res.json({ ok: true });
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  it("returns 403 when staff role does not match required role", async () => {
    const res = await request(app).get("/superadmin");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "Access denied. Requires one of: SUPER_ADMIN",
    });
  });

  it("calls next when staff role matches required role", async () => {
    const res = await request(app).get("/admin-route");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("returns 403 when req.staff is not set", async () => {
    app = express();
    app.get("/admin-route", requireRole("ADMIN"), (req, res) => {
      res.json({ ok: true });
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });

    const res = await request(app).get("/admin-route");
    expect(res.status).toBe(403);
    expect(res.body).toEqual({
      error: "Access denied. Requires one of: ADMIN",
    });
  });
});
