import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockReview } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

describe("GET /api/reviews/:productId", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  test("success — returns reviews for a product (no auth)", async () => {
    const reviews = [
      createMockReview({ id: "rev-1", rating: 5 }),
      createMockReview({ id: "rev-2", rating: 4, body: "Great board" }),
    ];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: reviews, error: null }),
        }),
      }),
    }));

    const res = await request(app).get(
      "/api/reviews/prod-0001-0000-0000-000000000001"
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data).toEqual(reviews);
  });

  test("success — returns reviews with optional auth token", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
    const reviews = [createMockReview()];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: reviews, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .get("/api/reviews/prod-0001-0000-0000-000000000001")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  test("supabase error — returns 400", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: null, error: { message: "DB error" } }),
        }),
      }),
    }));

    const res = await request(app).get(
      "/api/reviews/prod-0001-0000-0000-000000000001"
    );

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("DB error");
  });
});

describe("POST /api/reviews", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  test("success — creates review and returns 201", async () => {
    const created = createMockReview({ product_id: "00000000-0000-0000-0000-000000000001" });
    mockSupabase.from.mockImplementation(() => ({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: created, error: null }),
        }),
      }),
    }));

    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        product_id: "00000000-0000-0000-0000-000000000001",
        rating: 5,
        body: "Best deck ever!",
      });

    expect(res.status).toBe(201);
    expect(res.body.data).toEqual(created);
  });

  test("validation error — rating out of range (min 1, max 5)", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${validToken}`)
      .send({
        product_id: "prod-0001-0000-0000-000000000001",
        rating: 6,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("validation error — missing product_id", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ rating: 4, body: "Nice" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  test("no auth — returns 401", async () => {
    const res = await request(app)
      .post("/api/reviews")
      .send({
        product_id: "prod-0001-0000-0000-000000000001",
        rating: 4,
      });

    expect(res.status).toBe(401);
  });
});
