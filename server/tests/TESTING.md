# Testing — 4WHEELS Server

## Overview

The server uses **Jest 30** for middleware/unit tests and **Vitest** for integration and E2E tests. Middleware tests follow a "mini-app" pattern: each test creates an isolated Express app with the middleware under test, exercises it via supertest, and asserts on the response.

## Running Tests

```bash
# Run all Jest middleware/unit tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run Vitest integration tests
npm run test:integration

# Run Vitest unit tests
npm run test:unit
```

## Project Structure

```
tests/
├── middleware/          # Jest tests for Express middleware
│   ├── auth.test.js     # requireAuth / optionalAuth
│   ├── admin.test.js    # requireAdmin / requireRole
│   └── errorHandler.test.js
├── routes/              # Jest tests for route handlers
├── setup/               # Test helpers and mocks
│   ├── mockSupabase.js  # Mock Supabase client factory
│   └── factories.js     # Test data factories
├── unit/                # Vitest unit tests
├── integration/         # Vitest integration tests
├── e2e/                 # End-to-end tests
└── TESTING.md           # This file
```

## Mocking Strategy

**Supabase is mocked in every test.** The `createMockSupabase()` factory returns a fully chainable mock with:

- `auth.getUser` — control what `supabase.auth.getUser()` returns per test
- `from().select().eq().single()` — chainable query builder mocks for admin/staff queries
- `resetAll()` — resets all mock state between test cases

Never import the real `supabase.js` module in tests. Use `jest.unstable_mockModule` (see below).

## How to Add New Tests

Follow this pattern when adding a middleware test:

```js
import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock Supabase before importing the module under test
const mockSupabase = createMockSupabase();
jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: () => mockSupabase,
}));

const { yourMiddleware } = await import("../../src/middleware/yourMiddleware.js");

describe("yourMiddleware", () => {
  let app;

  beforeEach(() => {
    mockSupabase.resetAll();
    app = express();
    // Set up preconditions (e.g. req.userId)
    app.use((req, res, next) => { req.userId = testUserId; next(); });
    // Mount the middleware under test
    app.get("/test", yourMiddleware, (req, res) => {
      res.json({ result: req.someValue });
    });
    // Error handler to catch thrown errors
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });
  });

  it("does something", async () => {
    const res = await request(app).get("/test");
    expect(res.status).toBe(200);
  });
});
```

## The `jest.unstable_mockModule` Pattern

Because the server uses ESM (`"type": "module"`), Jest requires `jest.unstable_mockModule` for module mocking:

1. Call `jest.unstable_mockModule` at the top level with the module path and a factory.
2. Use `await import(...)` to load the module-under-test **after** the mock is registered.
3. The mock factory must return the same shape as the real module's exports.

```js
jest.unstable_mockModule("../../src/config/supabase.js", () => ({
  getSupabase: () => mockSupabase,
}));

const { requireAuth } = await import("../../src/middleware/auth.js");
```

## Coverage Report

Run `npm run test:coverage` to generate a coverage report. The Jest config requires:

- **90%** statement, branch, function, and line coverage
- Coverage is collected from all `src/**/*.js` files except `src/server.js`

## Best Practices

- **Reset mock state** in `beforeEach` with `mockSupabase.resetAll()`.
- **Test one behavior per test** — each `it()` should cover one scenario.
- **Use factories** from `tests/setup/factories.js` instead of hardcoding test data.
- **Don't test the framework** — test that your middleware sends the right status code and body, not that Express routes correctly.
- **Mock at the module boundary** — never mock `express` or `supertest`.
- **Use `jest.spyOn` for side effects** like `console.error` and restore with `jest.restoreAllMocks()` in `afterEach`.
