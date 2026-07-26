import { describe, it, expect, vi, beforeEach } from "vitest";
import { authMiddleware } from "../authMiddleware.js";

import jwt from "jsonwebtoken";
import { isExpired } from "../../utils/createJWT.js";

vi.mock("../../utils/createJWT.js", () => ({
  isExpired: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    decode: vi.fn(),
  },
}));

const mockResponse = () => {
  const res: any = {};

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
};

describe("authMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when token is missing", async () => {
    const req: any = {
      headers: {},
      body: {},
    };

    const res = mockResponse();

    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "Missing token",
      jwtToken: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("accepts token from Authorization header", async () => {
    vi.mocked(isExpired).mockReturnValue(false);

    vi.mocked(jwt.decode).mockReturnValue({
      id: "user123",
      name: "Peter",
      username: "peter",
      email: "test@test.com",
    } as any);

    const req: any = {
      headers: {
        authorization: "Bearer faketoken",
      },
      body: {},
    };

    const res = mockResponse();

    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(jwt.decode).toHaveBeenCalledWith("faketoken");

    expect(req.user).toEqual({
      id: "user123",
      name: "Peter",
      username: "peter",
      email: "test@test.com",
    });

    expect(next).toHaveBeenCalled();
  });

  it("accepts token from body jwtToken", async () => {
    vi.mocked(isExpired).mockReturnValue(false);

    vi.mocked(jwt.decode).mockReturnValue({
      id: "abc",
    } as any);

    const req: any = {
      headers: {},
      body: {
        jwtToken: "token123",
      },
    };

    const res = mockResponse();

    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(jwt.decode).toHaveBeenCalledWith("token123");

    expect(next).toHaveBeenCalled();
  });

  it("returns 401 when token is expired", async () => {
    vi.mocked(isExpired).mockReturnValue(true);

    const req: any = {
      headers: {
        authorization: "Bearer expiredtoken",
      },
      body: {},
    };

    const res = mockResponse();

    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "The JWT is no longer valid",
      jwtToken: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("handles invalid jwt decode", async () => {
    vi.mocked(isExpired).mockReturnValue(false);

    vi.mocked(jwt.decode).mockImplementation(() => {
      throw new Error("bad token");
    });

    const req: any = {
      headers: {
        authorization: "Bearer badtoken",
      },
      body: {},
    };

    const res = mockResponse();

    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid or expired token",
      jwtToken: "",
    });
  });

  it("uses userId fallback when id is missing", async () => {
    vi.mocked(isExpired).mockReturnValue(false);

    vi.mocked(jwt.decode).mockReturnValue({
      userId: "userid123",
    } as any);

    const req: any = {
      headers: {
        authorization: "Bearer token",
      },
      body: {},
    };

    const res = mockResponse();

    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(req.user.id).toBe("userid123");

    expect(next).toHaveBeenCalled();
  });
});
