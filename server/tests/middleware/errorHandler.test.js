import { jest } from "@jest/globals";

const { errorHandler } = await import("../../src/middleware/errorHandler.js");

describe("errorHandler", () => {
  let req, res, json, status, next;

  beforeEach(() => {
    req = {};
    json = jest.fn();
    status = jest.fn(() => ({ json }));
    res = { status };
    next = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 400 with validation details for ZodError", () => {
    const err = new Error("Validation failed");
    err.name = "ZodError";
    err.errors = [
      { path: ["email"], message: "Invalid email" },
      { path: ["age"], message: "Required" },
    ];

    errorHandler(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith("[Error]", err.message || err);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: "Validation failed",
      details: err.errors,
    });
  });

  it("responds with the error status code when err.status is set", () => {
    const err = new Error("Not Found");
    err.status = 404;

    errorHandler(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith("[Error]", err.message || err);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Not Found" });
  });

  it("returns 500 with generic message for regular errors", () => {
    const err = new Error("Something broke");

    errorHandler(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith("[Error]", err.message || err);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("handles error with non-string message gracefully", () => {
    const err = { message: 42 };

    errorHandler(err, req, res, next);

    expect(console.error).toHaveBeenCalledWith("[Error]", err.message || err);
    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
