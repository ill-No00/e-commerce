import { jest } from "@jest/globals";
import { createMockSupabase } from "../setup/mockSupabase.js";
import { createMockProduct, createMockVariant } from "../setup/factories.js";

const mockSupabase = createMockSupabase();
const mockGetSupabase = jest.fn(() => mockSupabase);

jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: mockGetSupabase,
  getServiceSupabase: mockGetSupabase,
}));

const { app } = await import("../../src/app.js");
const request = (await import("supertest")).default;

const makeProductRow = (overrides = {}) => ({
  id: "prod-" + (overrides.slug || "default"),
  name: "Test Deck",
  slug: "test-deck",
  badge: null,
  base_price_cents: 8900,
  rating_avg: 4.5,
  rating_count: 10,
  is_active: true,
  category: { name: "Decks", slug: "decks" },
  product_images: [{ url: "https://example.com/img.jpg", alt_text: "Deck image" }],
  product_variants: [createMockVariant()],
  ...overrides,
});

describe("GET /api/products", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  test("success — returns paginated products", async () => {
    const products = [
      makeProductRow({ slug: "deck-a", name: "Deck A" }),
      makeProductRow({ slug: "deck-b", name: "Deck B" }),
    ];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => Promise.resolve({ data: products, error: null, count: 2 }),
          }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 2,
      totalPages: 1,
    });
  });

  test("category filter — passes query param to eq filter", async () => {
    const filtered = [makeProductRow({ slug: "deck-a", category: { name: "Decks", slug: "decks" } })];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => ({
              eq: () => Promise.resolve({ data: filtered, error: null, count: 1 }),
            }),
          }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products?category=decks");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.pagination.page).toBe(1);
  });

  test("search filter — passes query param to ilike filter", async () => {
    const searched = [makeProductRow({ slug: "chrome-deck", name: "Chrome Deck" })];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => ({
              ilike: () => Promise.resolve({ data: searched, error: null, count: 1 }),
            }),
          }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products?search=chrome");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  test("invalid page param — defaults to page 1 gracefully", async () => {
    const products = [makeProductRow()];
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => Promise.resolve({ data: products, error: null, count: 1 }),
          }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products?page=-1");

    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(1);
  });

  test("supabase error — returns 400", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            range: () => Promise.resolve({ data: null, error: { message: "DB error" }, count: 0 }),
          }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("DB error");
  });
});

describe("GET /api/products/:slug", () => {
  beforeEach(() => {
    mockSupabase.resetAll();
  });

  test("success — returns single product by slug", async () => {
    const product = {
      id: "prod-0001",
      name: "Chrome Hearts Deck",
      slug: "chrome-hearts-deck",
      series: "OBSIDIAN",
      badge: "BEST_SELLER",
      description: "Premium maple deck.",
      base_price_cents: 8900,
      construction: "7-PLY MAPLE",
      concave: "MEDIUM",
      trucks_spec: '5.25"',
      bearings_spec: "ABEC-7",
      category: { name: "Decks", slug: "decks" },
      product_images: [{ url: "https://example.com/img.jpg", alt_text: "Deck", sort_order: 1 }],
      product_variants: [createMockVariant()],
    };
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: product, error: null }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products/chrome-hearts-deck");

    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("chrome-hearts-deck");
  });

  test("not found — slug does not match any product", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "not found" } }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products/nonexistent");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");
  });

  test("supabase error — returns 404 (handler treats db error as not-found)", async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "DB error" } }),
        }),
      }),
    }));

    const res = await request(app).get("/api/products/some-slug");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Product not found");
  });
});
