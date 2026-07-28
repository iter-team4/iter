import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import { getMe } from "../userController.js";
import User from "../../models/User.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

const mockResponse = () => {
  const res: any = {};

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res as Response;
};

describe("userController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMe", () => {
    it("returns 401 when user is missing", async () => {
      const req = {
        user: undefined,
      } as Request;

      const res = mockResponse();

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(401);

      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized",
      });
    });

    it("returns 404 when user profile does not exist", async () => {
      vi.mocked(User.findById).mockResolvedValue(null);

      const req = {
        user: {
          id: "123",
        },
      } as any;

      const res = mockResponse();

      await getMe(req, res);

      expect(User.findById).toHaveBeenCalledWith("123");

      expect(res.status).toHaveBeenCalledWith(404);

      expect(res.json).toHaveBeenCalledWith({
        message: "User profile not found",
      });
    });

    it("returns user profile successfully", async () => {
      const mockUser = {
        _id: "123",
        username: "peter",
        email: "test@test.com",
      };

      vi.mocked(User.findById).mockResolvedValue(mockUser as any);

      const req = {
        user: {
          id: "123",
        },
      } as any;

      const res = mockResponse();

      await getMe(req, res);

      expect(User.findById).toHaveBeenCalledWith("123");

      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("returns 500 when database fails", async () => {
      vi.mocked(User.findById).mockRejectedValue(new Error("Database error"));

      const req = {
        user: {
          id: "123",
        },
      } as any;

      const res = mockResponse();

      await getMe(req, res);

      expect(res.status).toHaveBeenCalledWith(500);

      expect(res.json).toHaveBeenCalledWith({
        message: "Server error",
      });
    });
  });
});
