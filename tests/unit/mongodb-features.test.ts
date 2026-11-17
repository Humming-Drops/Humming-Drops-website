import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import Lead from "../../src/lib/models/Lead";
import { POST } from "../../src/app/api/register/route";

describe("MongoDB Integration & Lead Model Features", () => {
  it("initializes Lead schema with status 'pending_confirmation' and createdAt timestamp", () => {
    const testDoc = new Lead({
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "9876543210",
      planId: "standard",
    });

    expect(testDoc.status).toBe("pending_confirmation");
    expect(testDoc.createdAt).toBeInstanceOf(Date);
    expect(testDoc.fullName).toBe("Jane Doe");
    expect(testDoc.email).toBe("jane@example.com");
    expect(testDoc.phone).toBe("9876543210");
    expect(testDoc.planId).toBe("standard");
  });

  it("enforces required fields on Lead model schema", async () => {
    const invalidDoc = new Lead({});
    let validationError: any;
    try {
      await invalidDoc.validate();
    } catch (err) {
      validationError = err;
    }
    expect(validationError).toBeDefined();
    expect(validationError?.errors.fullName).toBeDefined();
    expect(validationError?.errors.email).toBeDefined();
    expect(validationError?.errors.phone).toBeDefined();
    expect(validationError?.errors.planId).toBeDefined();
  });
});

describe("POST /api/register Endpoint Validation & Resilience", () => {
  it("rejects non-JSON payload with HTTP 400", async () => {
    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json-data",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Invalid JSON");
  });

  it("rejects missing or short fullName with HTTP 400", async () => {
    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "A",
        email: "test@example.com",
        phone: "9876543210",
        planId: "standard",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("Full name");
  });

  it("rejects invalid email address with HTTP 400", async () => {
    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "invalid-email-address",
        phone: "9876543210",
        planId: "standard",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("valid email");
  });

  it("rejects non-Indian or malformed phone numbers with HTTP 400", async () => {
    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "test@example.com",
        phone: "12345", // too short
        planId: "standard",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("valid 10-digit Indian mobile number");
  });

  it("rejects unknown plan tier with HTTP 400", async () => {
    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "test@example.com",
        phone: "9876543210",
        planId: "ultra-diamond-plan",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain("plan tier");
  });

  it("successfully creates a valid lead and returns HTTP 201", async () => {
    vi.mock("../../src/lib/db/mongodb", () => ({
      connectToDatabase: vi.fn().mockResolvedValue(true),
    }));

    const createSpy = vi.spyOn(Lead, "create").mockResolvedValueOnce({
      _id: "mock_lead_123",
      fullName: "Test User",
      email: "test@example.com",
      phone: "9876543210",
      planId: "standard",
      status: "pending_confirmation",
    } as any);

    const req = new Request("http://localhost:3000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Test User",
        email: "test@example.com",
        phone: "9876543210",
        planId: "standard",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe("Registration successful");
    expect(body.data._id).toBe("mock_lead_123");
    expect(createSpy).toHaveBeenCalledWith({
      fullName: "Test User",
      email: "test@example.com",
      phone: "9876543210",
      planId: "standard",
      status: "pending_confirmation",
    });

    createSpy.mockRestore();
  });
});
