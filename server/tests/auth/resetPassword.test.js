process.env.SUPABASE_URL = "http://localhost:54321";
process.env.SUPABASE_PASS = "test-pass";

import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("POST /api/auth/reset-password", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  const validPayload = {
    email: "skater@4wheels.com",
  };

  describe("Success", () => {
    it("returns 200 with confirmation message", async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password reset email sent");
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        validPayload.email,
        expect.objectContaining({
          redirectTo: expect.stringContaining("/reset-password"),
        }),
      );
    });

    it("calls resetPasswordForEmail with the provided email and default redirectTo", async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      await request(app)
        .post("/api/auth/reset-password")
        .send(validPayload);

      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        validPayload.email,
        expect.objectContaining({
          redirectTo: expect.stringMatching(/^http:\/\/.*\/reset-password$/),
        }),
      );
    });

    it("uses custom redirectTo when provided", async () => {
      const customPayload = {
        email: "skater@4wheels.com",
        redirectTo: "https://4wheels.com/custom-reset",
      };

      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send(customPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password reset email sent");
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        customPayload.email,
        expect.objectContaining({
          redirectTo: "https://4wheels.com/custom-reset",
        }),
      );
    });

    it("accepts email with subdomain format", async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ email: "test+tag@sub.example.co.uk" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password reset email sent");
    });
  });

  describe("Validation errors", () => {
    it("returns 400 when email is missing", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({})
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("email");
    });

    it("returns 400 when email has invalid format", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ email: "not-an-email" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details).toBeInstanceOf(Array);
      expect(res.body.details[0].path).toContain("email");
    });

    it("returns 400 when email is empty string", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ email: "" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 when redirectTo is not a valid URL", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ email: "skater@4wheels.com", redirectTo: "not-a-url" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details[0].path).toContain("redirectTo");
    });

    it("returns 400 for empty request body", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 when email is a number", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ email: 12345 })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
    });

    it("returns 400 for both missing email and invalid redirectTo", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .send({ redirectTo: "bad-url" })
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Validation failed");
      expect(res.body.details.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Supabase errors", () => {
    it("returns 400 when Supabase cannot find the user", async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: { message: "User not found" },
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("User not found");
    });

    it("returns 400 when Supabase rate limit is hit", async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: { message: "Too many requests" },
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Too many requests");
    });

    it("returns 400 on unexpected Supabase error", async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: { message: "Internal server error" },
      });

      const res = await request(app)
        .post("/api/auth/reset-password")
        .send(validPayload)
        .expect("Content-Type", /json/);

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Internal server error");
    });
  });

  describe("Supabase not called on validation failure", () => {
    it("does not call resetPasswordForEmail when email is missing", async () => {
      await request(app)
        .post("/api/auth/reset-password")
        .send({})
        .expect("Content-Type", /json/);

      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });

    it("does not call resetPasswordForEmail when email is invalid", async () => {
      await request(app)
        .post("/api/auth/reset-password")
        .send({ email: "bad" })
        .expect("Content-Type", /json/);

      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });

    it("does not call resetPasswordForEmail when redirectTo is invalid", async () => {
      await request(app)
        .post("/api/auth/reset-password")
        .send({ email: "skater@4wheels.com", redirectTo: "bad" })
        .expect("Content-Type", /json/);

      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });
  });

  describe("Malformed requests", () => {
    it("returns 400 for malformed JSON body", async () => {
      const res = await request(app)
        .post("/api/auth/reset-password")
        .set("Content-Type", "application/json")
        .send("not valid json");

      expect(res.status).toBe(400);
    });
  });
});
