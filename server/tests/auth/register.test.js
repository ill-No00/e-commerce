process.env.SUPABASE_URL = "http://localhost:54321";
process.env.SUPABASE_PASS = "test-pass";

import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  const validPayload = {
    email: "skater@4wheels.com",
    password: "password123",
  };

  describe("Success", () => {
    it("returns 201 with user and session for valid registration", async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: validToken } },
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/signup")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual(mockUser);
      expect(res.body.session.access_token).toBe(validToken);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: validPayload.email,
        password: validPayload.password,
        options: undefined,
      });
    });

    it("returns 201 with optional profile data", async () => {
      const payloadWithOptions = {
        email: "skater@4wheels.com",
        password: "password123",
        options: {
          data: {
            username: "sk8r99",
            display_name: "Alex Rider",
          },
        },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: validToken } },
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/signup")
        .send(payloadWithOptions)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(201);
      expect(res.body.user).toEqual(mockUser);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: payloadWithOptions.email,
        password: payloadWithOptions.password,
        options: payloadWithOptions.options,
      });
    });

    it("returns 201 with only username in options", async () => {
      const payloadWithUsername = {
        email: "skater@4wheels.com",
        password: "password123",
        options: {
          data: {
            username: "sk8r99",
          },
        },
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: { access_token: validToken } },
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/signup")
        .send(payloadWithUsername)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(201);
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: payloadWithUsername.email,
        password: payloadWithUsername.password,
        options: payloadWithUsername.options,
      });
    });
  });

  describe("Supabase errors", () => {
    it("returns 400 when user already exists", async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: "User already registered" },
      });

      const res = await request(app)
        .post("/api/auth/signup")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("User already registered");
    });

    it("returns 400 when Supabase returns rate limit error", async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: "Email rate limit exceeded" },
      });

      const res = await request(app)
        .post("/api/auth/signup")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Email rate limit exceeded");
    });

    it("returns 400 when Supabase returns weak password error", async () => {
      mockSupabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: "Password should be at least 6 characters" },
      });

      const res = await request(app)
        .post("/api/auth/signup")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Password should be at least 6 characters");
    });
  });

  describe("Validation errors", () => {
    it("returns 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("email");
    });

    it("returns 400 when password is missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "skater@4wheels.com" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("password");
    });

    it("returns 400 when email has invalid format", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "not-an-email", password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("email");
    });

    it("returns 400 when password is shorter than 8 characters", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "skater@4wheels.com", password: "short" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("password");
    });

    it("returns 400 when password is exactly 7 characters", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "skater@4wheels.com", password: "1234567" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 when both fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({})
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details.length).toBeGreaterThanOrEqual(2);
    });

    it("returns 400 for empty request body", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 when email is an empty string", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "", password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 when password is an empty string", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "skater@4wheels.com", password: "" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 when email is not a string", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: 42, password: "password123" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });
  });

  describe("Malformed requests", () => {
    it("returns 400 for malformed JSON body", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .set("Content-Type", "application/json")
        .send("not valid json");

      expect(res.status).toBe(400);
    });
  });

  describe("Supabase not called on validation failure", () => {
    it("does not call supabase.auth.signUp when email is invalid", async () => {
      await request(app)
        .post("/api/auth/signup")
        .send({ email: "bad-email", password: "password123" });

      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });

    it("does not call supabase.auth.signUp when password is too short", async () => {
      await request(app)
        .post("/api/auth/signup")
        .send({ email: "skater@4wheels.com", password: "short" });

      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });

    it("does not call supabase.auth.signUp when body is empty", async () => {
      await request(app).post("/api/auth/signup").send({});

      expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
    });
  });
});
