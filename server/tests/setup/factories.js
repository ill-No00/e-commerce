export const testUserId = "00000000-0000-0000-0000-000000000001";
export const otherUserId = "00000000-0000-0000-0000-000000000002";
export const adminUserId = "00000000-0000-0000-0000-000000000003";

export const validToken = "valid-jwt-token";
export const expiredToken = "expired-jwt-token";
export const invalidToken = "invalid-jwt-token";

export const mockUser = {
  id: testUserId,
  email: "skater@4wheels.com",
  user_metadata: { username: "sk8r99", display_name: "Alex Rider" },
  aud: "authenticated",
  role: "authenticated",
};

export const mockOtherUser = {
  id: otherUserId,
  email: "other@4wheels.com",
  user_metadata: { username: "other", display_name: "Other User" },
};

export const mockAdminUser = {
  id: adminUserId,
  email: "admin@4wheels.com",
  user_metadata: { username: "admin", display_name: "Admin User" },
};

export const mockStaffRecord = {
  id: adminUserId,
  role: "ADMIN",
  status: "ACTIVE",
  display_name: "Admin User",
  handle: "admin",
  email: "admin@4wheels.com",
  joined_at: "2025-01-01T00:00:00Z",
  last_active_at: "2026-06-28T00:00:00Z",
};

export function createMockProfile(overrides = {}) {
  return {
    id: testUserId,
    display_name: "Alex Rider",
    username: "sk8r99",
    email: "skater@4wheels.com",
    avatar_url: null,
    stance: "REGULAR",
    home_spot: "Venice Beach Skatepark",
    tier: "STREET",
    gallery_points: 420,
    badges: ["EARLY_ADOPTER"],
    joined_at: "2025-06-01T00:00:00Z",
    ...overrides,
  };
}

export function createMockAddress(overrides = {}) {
  return {
    id: "addr-0001-0000-0000-000000000001",
    user_id: testUserId,
    first_name: "Alex",
    last_name: "Rider",
    street: "1234 Venice Blvd",
    city: "Los Angeles",
    state: "CA",
    zip_code: "90210",
    is_default: true,
    ...overrides,
  };
}

export function createMockPaymentMethod(overrides = {}) {
  return {
    id: "pm-0001-0000-0000-000000000001",
    user_id: testUserId,
    provider: "stripe",
    brand: "Visa",
    last4: "4242",
    expiry_month: 12,
    expiry_year: 2028,
    is_default: true,
    ...overrides,
  };
}

export function createMockProduct(overrides = {}) {
  return {
    id: "prod-0001-0000-0000-000000000001",
    name: "Chrome Hearts Deck",
    slug: "chrome-hearts-deck",
    series: "OBSIDIAN",
    badge: "BEST_SELLER",
    description: "Premium maple deck with graphic top ply.",
    base_price_cents: 8900,
    construction: "7-PLY MAPLE",
    concave: "MEDIUM",
    trucks_spec: "5.25\"",
    bearings_spec: "ABEC-7",
    is_active: true,
    rating_avg: 4.5,
    rating_count: 42,
    ...overrides,
  };
}

export function createMockVariant(overrides = {}) {
  return {
    id: "var-0001-0000-0000-000000000001",
    product_id: "prod-0001-0000-0000-000000000001",
    sku: "CHD-8.0",
    width: "8.0",
    size_label: "8.0\"",
    durometer: null,
    finish_name: "Classic",
    finish_hex: "#FF2D78",
    price_cents: 8900,
    stock_status: "IN_STOCK",
    stock_quantity: 42,
    is_default: true,
    ...overrides,
  };
}

export function createMockCartItem(overrides = {}) {
  return {
    id: "ci-0001-0000-0000-000000000001",
    cart_id: "cart-0001-0000-0000-000000000001",
    variant_id: "var-0001-0000-0000-000000000001",
    quantity: 1,
    unit_price_cents: 8900,
    reserved_until: null,
    ...overrides,
  };
}

export function createMockOrder(overrides = {}) {
  return {
    id: "ord-0001-0000-0000-000000000001",
    order_number: "4W-A1B2C3",
    user_id: testUserId,
    status: "PROCESSING",
    subtotal_cents: 11000,
    shipping_cents: 0,
    tax_cents: 935,
    total_cents: 11935,
    placed_at: "2026-06-28T12:00:00Z",
    ...overrides,
  };
}

export function createMockReview(overrides = {}) {
  return {
    id: "rev-0001-0000-0000-000000000001",
    product_id: "prod-0001-0000-0000-000000000001",
    user_id: testUserId,
    rating: 5,
    body: "Best deck I've ever ridden.",
    author_label: "sk8r99",
    created_at: "2026-06-28T12:00:00Z",
    ...overrides,
  };
}

export function createMockCrew(overrides = {}) {
  return {
    id: "crew-0001-0000-0000-000000000001",
    name: "VENICE REBELS",
    cred_points: 4200,
    rank: "GOLD",
    ...overrides,
  };
}

export function createMockCrewPost(overrides = {}) {
  return {
    id: "cp-0001-0000-0000-000000000001",
    crew_id: "crew-0001-0000-0000-000000000001",
    user_id: testUserId,
    body: "Session at the park was insane!",
    media_url: null,
    media_type: null,
    hashtags: ["skate", "venice"],
    created_at: "2026-06-28T12:00:00Z",
    ...overrides,
  };
}

export function createMockShippingMethod(overrides = {}) {
  return {
    id: "sm-0001-0000-0000-000000000001",
    name: "Standard",
    price_cents: 0,
    min_business_days: 5,
    max_business_days: 7,
    is_active: true,
    ...overrides,
  };
}

export function createMockStoreSetting(overrides = {}) {
  return {
    id: "ss-0001-0000-0000-000000000001",
    store_name: "4WHEELS",
    store_handle: "4wheels",
    contact_email: "hello@4wheels.com",
    ...overrides,
  };
}

export function integrationRecord(overrides = {}) {
  return {
    id: "int-0001-0000-0000-000000000001",
    provider_key: "stripe",
    display_name: "Stripe",
    category: "payments",
    is_connected: false,
    connected_at: null,
    ...overrides,
  };
}
