import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";

import {
  register,
  verifyEmail,
  resendCode,
  login,
  forgotPassword,
  resetPassword,
} from "../authController.js";

import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import { createToken } from "../../utils/createJWT.js";
import { sendEmail } from "../../utils/sendEmail.js";

vi.mock("../../models/User.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    genSalt: vi.fn(),
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../../utils/createJWT.js", () => ({
  createToken: vi.fn(),
}));

vi.mock("../../utils/sendEmail.js", () => ({
  sendEmail: vi.fn(),
}));

const mockResponse = () => {
  const res: any = {};

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res as Response;
};

describe("authController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("handles missing fields", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.genSalt).mockResolvedValue("salt" as never);
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);
      vi.mocked(User.create).mockResolvedValue({} as any);
      vi.mocked(sendEmail).mockResolvedValue(undefined);

      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns 400 if email already exists", async () => {
      vi.mocked(User.findOne).mockResolvedValue({} as any);

      const req = {
        body: {
          email: "test@test.com",
          password: "password",
          name: "Peter",
          username: "peter",
        },
      } as Request;

      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("creates user and sends email", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);
      vi.mocked(bcrypt.genSalt).mockResolvedValue("salt" as never);
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);

      vi.mocked(User.create).mockResolvedValue({
        email: "test@test.com",
      } as any);

      vi.mocked(sendEmail).mockResolvedValue(undefined);

      const req = {
        body: {
          email: "test@test.com",
          password: "password",
          name: "Peter",
          username: "peter",
        },
      } as Request;

      const res = mockResponse();

      await register(req, res);

      expect(User.create).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns 500 when database fails", async () => {
      vi.mocked(User.findOne).mockRejectedValue(new Error("Database error"));

      const req = {
        body: {
          email: "test@test.com",
          password: "password",
        },
      } as Request;

      const res = mockResponse();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("verifyEmail", () => {
    it("returns 400 when fields missing", async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when user does not exist", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const req = {
        body: {
          email: "test@test.com",
          code: "123456",
        },
      } as Request;

      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("verifies user successfully", async () => {
      const user: any = {
        verificationCode: "123456",
        isVerified: false,
        save: vi.fn(),
      };

      vi.mocked(User.findOne).mockResolvedValue(user);

      const req = {
        body: {
          email: "test@test.com",
          code: "123456",
        },
      } as Request;

      const res = mockResponse();

      await verifyEmail(req, res);

      expect(user.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("rejects invalid code", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        verificationCode: "111111",
      } as any);

      const req = {
        body: {
          email: "test@test.com",
          code: "222222",
        },
      } as Request;

      const res = mockResponse();

      await verifyEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("resendCode", () => {
    it("returns 400 without email", async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await resendCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 if user missing", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const req = {
        body: {
          email: "test@test.com",
        },
      } as Request;

      const res = mockResponse();

      await resendCode(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("resends verification code", async () => {
      const user: any = {
        isVerified: false,
        save: vi.fn(),
      };

      vi.mocked(User.findOne).mockResolvedValue(user);

      vi.mocked(sendEmail).mockResolvedValue(undefined);

      const req = {
        body: {
          email: "test@test.com",
        },
      } as Request;

      const res = mockResponse();

      await resendCode(req, res);

      expect(sendEmail).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("login", () => {
    it("returns 400 without fields", async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("rejects invalid user", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const req = {
        body: {
          email: "bad@test.com",
          password: "123",
        },
      } as Request;

      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("rejects incorrect password", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        password: "hash",
        isVerified: true,
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const req = {
        body: {
          email: "test@test.com",
          password: "wrong",
        },
      } as Request;

      const res = mockResponse();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("rejects unverified users", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        _id: "123",
        password: "hash",
        isVerified: false,
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const req = {
        body: {
          email: "test@test.com",
          password: "password",
        },
      } as Request;

      const res = mockResponse();

      await login(req, res);

      expect(createToken).not.toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("logs in successfully", async () => {
      vi.mocked(User.findOne).mockResolvedValue({
        _id: "123",
        password: "hash",
        name: "Peter",
        username: "peter",
        email: "test@test.com",
        isVerified: true,
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      vi.mocked(createToken).mockReturnValue({
        accessToken: "jwt",
        error: "",
      });

      const req = {
        body: {
          email: "test@test.com",
          password: "password",
        },
      } as Request;

      const res = mockResponse();

      await login(req, res);

      expect(createToken).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("forgotPassword", () => {
    it("returns 400 without email", async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 200 even if user does not exist", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const req = {
        body: {
          email: "none@test.com",
        },
      } as Request;

      const res = mockResponse();

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("resetPassword", () => {
    it("returns 400 when fields missing", async () => {
      const req = {
        body: {},
      } as Request;

      const res = mockResponse();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when user missing", async () => {
      vi.mocked(User.findOne).mockResolvedValue(null);

      const req = {
        body: {
          email: "test@test.com",
          code: "123456",
          newPassword: "password",
        },
      } as Request;

      const res = mockResponse();

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("resets password successfully", async () => {
      const user: any = {
        verificationCode: "123456",
        save: vi.fn(),
      };

      vi.mocked(User.findOne).mockResolvedValue(user);

      vi.mocked(bcrypt.genSalt).mockResolvedValue("salt" as never);

      vi.mocked(bcrypt.hash).mockResolvedValue("hash" as never);

      const req = {
        body: {
          email: "test@test.com",
          code: "123456",
          newPassword: "password",
        },
      } as Request;

      const res = mockResponse();

      await resetPassword(req, res);

      expect(user.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
