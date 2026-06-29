process.env.SUPABASE_URL = "http://localhost:54321";
process.env.SUPABASE_PASS = "test-pass";

import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, invalidToken, mockUser } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  const validPayload = {
    email: "skater@4wheels.com",
    password: "password123",
  };

  describe("Success", () => {
    it("returns 200 with user and session for valid credentials", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: { access_token: validToken } },
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual(mockUser);
      expect(res.body.session.access_token).toBe(validToken);
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: validPayload.email,
        password: validPayload.password,
      });
    });
  });

  describe("Invalid credentials", () => {
    it("returns 401 when Supabase returns error", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid login credentials" },
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid login credentials");
    });

    it("returns 401 for non-existent email", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid login credentials" },
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nonexistent@test.com", password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid login credentials");
    });

    it("returns 401 for wrong password", async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: "Invalid login credentials" },
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "skater@4wheels.com", password: "wrongpassword" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid login credentials");
    });
  });

  describe("Validation errors", () => {
    it("returns 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("email");
    });

    it("returns 400 when password is missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "skater@4wheels.com" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("password");
    });

    it("returns 400 when email has invalid format", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "not-an-email", password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("email");
    });

    it("returns 400 when both fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details.length).toBeGreaterThanOrEqual(2);
    });

    it("returns 400 for empty request body", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 for empty strings", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "", password: "" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });
  });

  describe("Malformed requests", () => {
    it("returns 400 for malformed JSON body", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        .send("not valid json");

      expect(res.status).toBe(400);
    });

    it("returns 400 when email is not a string", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: 12345, password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("does not call Supabase when validation fails", async () => {
      await request(app)
        .post("/api/auth/login")
        .send({ email: "bad-email", password: "password123" });

      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });
  });
});
