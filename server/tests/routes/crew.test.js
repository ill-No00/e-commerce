import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { testUserId, validToken, mockUser, createMockCrew, createMockCrewPost } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

const crewId = "00000001-0000-0000-0000-000000000001";
const postId = "00000002-0000-0000-0000-000000000002";

function setupAuth() {
  mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser }, error: null });
}

function makeFromChain(result) {
  return jest.fn(() => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve(result),
        order: () => Promise.resolve(result),
        maybeSingle: () => Promise.resolve(result),
      }),
      order: () => Promise.resolve(result),
      limit: () => Promise.resolve(result),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve(result),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve(result),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: () => Promise.resolve(result),
      }),
    }),
    delete: () => ({
      eq: () => Promise.resolve(result),
    }),
  }));
}

describe("GET /api/crew", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAuth();
  });

  it("returns 200 with crew memberships", async () => {
    const crew = createMockCrew();
    const result = { data: [{ crew_id: crewId, crews: crew }], error: null };
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve(result),
      }),
    });
    const res = await request(app).get("/api/crew").set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0].crew_id).toBe(crewId);
  });

  it("returns 400 on supabase error", async () => {
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve({ data: null, error: { message: "DB error" } }),
      }),
    });
    const res = await request(app).get("/api/crew").set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(400);
  });

  it("returns 401 without auth", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: null, error: { message: "No token" } });
    const res = await request(app).get("/api/crew");
    expect(res.status).toBe(401);
  });
});

describe("POST /api/crew/join", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAuth();
  });

  it("returns 201 on successful join", async () => {
    mockSupabase.from.mockImplementation(makeFromChain({ data: { crew_id: crewId, user_id: testUserId }, error: null }));
    const res = await request(app)
      .post("/api/crew/join")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId });
    expect(res.status).toBe(201);
  });

  it("returns 400 on invalid UUID", async () => {
    const res = await request(app)
      .post("/api/crew/join")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: "not-a-uuid" });
    expect(res.status).toBe(400);
  });

  it("returns 400 on duplicate join", async () => {
    mockSupabase.from.mockImplementation(makeFromChain({ data: null, error: { message: "duplicate key value violates unique constraint" } }));
    const res = await request(app)
      .post("/api/crew/join")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId });
    expect(res.status).toBe(400);
  });

  it("returns 401 without auth", async () => {
    mockSupabase.auth.getUser.mockResolvedValue({ data: null, error: { message: "No token" } });
    const res = await request(app).post("/api/crew/join").send({ crew_id: crewId });
    expect(res.status).toBe(401);
  });
});

describe("GET /api/crew/:crewId/members", () => {
  it("returns 200 with members", async () => {
    mockSupabase.resetAll();
    setupAuth();
    const result = { data: [{ user_id: testUserId, is_online: true }], error: null };
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve(result),
      }),
    });
    const res = await request(app).get(`/api/crew/${crewId}/members`).set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });
});

describe("GET /api/crew/:crewId/posts", () => {
  it("returns 200 with posts", async () => {
    mockSupabase.resetAll();
    setupAuth();
    const post = createMockCrewPost();
    const result = { data: [post], error: null };
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve(result),
          }),
        }),
      }),
    });
    const res = await request(app).get(`/api/crew/${crewId}/posts`).set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0].id).toBe(post.id);
  });

  it("respects first query param", async () => {
    mockSupabase.resetAll();
    setupAuth();
    const result = { data: [], error: null };
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve(result),
          }),
        }),
      }),
    });
    const res = await request(app)
      .get(`/api/crew/${crewId}/posts?first=5`)
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
  });
});

describe("POST /api/crew/posts", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAuth();
  });

  it("returns 201 on successful post creation", async () => {
    mockSupabase.from.mockImplementation(makeFromChain({ data: createMockCrewPost(), error: null }));
    const res = await request(app)
      .post("/api/crew/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId, body: "Session was rad!" });
    expect(res.status).toBe(201);
  });

  it("returns 400 on empty body", async () => {
    const res = await request(app)
      .post("/api/crew/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId, body: "" });
    expect(res.status).toBe(400);
  });

  it("returns 400 on body exceeding 5000 chars", async () => {
    const res = await request(app)
      .post("/api/crew/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId, body: "x".repeat(5001) });
    expect(res.status).toBe(400);
  });

  it("returns 400 on invalid media_type", async () => {
    const res = await request(app)
      .post("/api/crew/posts")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId, body: "Hello", media_type: "GIF" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/crew/posts/:id/like", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAuth();
  });

  it("returns 201 on like", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { post_id: postId, user_id: testUserId }, error: null }),
        }),
      }),
    }));
    const res = await request(app)
      .post(`/api/crew/posts/${postId}/like`)
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(201);
  });

  it("returns 409 when already liked", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { id: "like-1" }, error: null }),
          }),
        }),
      }),
    }));
    const res = await request(app)
      .post(`/api/crew/posts/${postId}/like`)
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(409);
  });
});

describe("DELETE /api/crew/posts/:id/like", () => {
  it("returns 204 on unlike", async () => {
    mockSupabase.resetAll();
    setupAuth();
    mockSupabase.from.mockReturnValue({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    });
    const res = await request(app)
      .delete(`/api/crew/posts/${postId}/like`)
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(204);
  });

  it("returns 404 when like not found", async () => {
    mockSupabase.resetAll();
    setupAuth();
    mockSupabase.from.mockReturnValue({
      delete: () => ({
        eq: () => ({
          eq: () => Promise.resolve({ data: null, error: { message: "Not found" } }),
        }),
      }),
    });
    const res = await request(app)
      .delete(`/api/crew/posts/${postId}/like`)
      .set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(404);
  });
});

describe("POST /api/crew/posts/:id/comments", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAuth();
  });

  it("returns 201 on comment", async () => {
    mockSupabase.from.mockImplementation(makeFromChain({ data: { id: "comment-1", post_id: postId, body: "Great shot!" }, error: null }));
    const res = await request(app)
      .post(`/api/crew/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ body: "Great shot!" });
    expect(res.status).toBe(201);
  });

  it("returns 400 on empty comment body", async () => {
    const res = await request(app)
      .post(`/api/crew/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ body: "" });
    expect(res.status).toBe(400);
  });

  it("returns 400 on body exceeding 1000 chars", async () => {
    const res = await request(app)
      .post(`/api/crew/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${validToken}`)
      .send({ body: "x".repeat(1001) });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/crew/:crewId/chat", () => {
  it("returns 200 with messages", async () => {
    mockSupabase.resetAll();
    setupAuth();
    const result = { data: [{ id: "msg-1", body: "Yo!", created_at: "2026-01-01T00:00:00Z" }], error: null };
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: () => Promise.resolve(result),
          }),
        }),
      }),
    });
    const res = await request(app).get(`/api/crew/${crewId}/chat`).set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0].body).toBe("Yo!");
  });
});

describe("POST /api/crew/chat", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
    setupAuth();
  });

  it("returns 201 on message sent", async () => {
    mockSupabase.from.mockImplementation(makeFromChain({ data: { id: "msg-1", body: "Yo!", crew_id: crewId }, error: null }));
    const res = await request(app)
      .post("/api/crew/chat")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId, body: "Yo!" });
    expect(res.status).toBe(201);
  });

  it("returns 400 when body is missing", async () => {
    const res = await request(app)
      .post("/api/crew/chat")
      .set("Authorization", `Bearer ${validToken}`)
      .send({ crew_id: crewId });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/crew/:crewId/missions", () => {
  it("returns 200 with missions", async () => {
    mockSupabase.resetAll();
    setupAuth();
    const result = { data: [{ id: "mission-1", title: "Land 10 kickflips", target_value: 10, current_value: 3 }], error: null };
    mockSupabase.from.mockReturnValue({
      select: () => ({
        eq: () => Promise.resolve(result),
      }),
    });
    const res = await request(app).get(`/api/crew/${crewId}/missions`).set("Authorization", `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data[0].title).toBe("Land 10 kickflips");
  });
});
