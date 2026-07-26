import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { saveRun, loadRuns } from "../runController.js";
import Run from "../../models/Run.js";
import Route from "../../models/Route.js";
import User from "../../models/User.js";

describe("runController", () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockPathId = new mongoose.Types.ObjectId().toString();

  const mockRunBody = {
    pathId: mockPathId,
    pathName: "Morning Run",
    distanceMiles: 3,
    durationSeconds: 1800,
    targetPaceSeconds: 600,
    waypoints: [
      {
        lat: 28.5,
        lng: -81.3,
      },
      {
        lat: 28.6,
        lng: -81.4,
      },
    ],
  };

  const mockReq = (overrides = {}) =>
    ({
      user: {
        id: mockUserId,
      },
      body: mockRunBody,
      ...overrides,
    }) as any;

  const mockRes = () => {
    const res: any = {};

    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);

    return res;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveRun", () => {
    it("returns 401 without user", async () => {
      const req = mockReq({
        user: undefined,
      });

      const res = mockRes();

      await saveRun(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("creates run successfully", async () => {
      const req = mockReq();
      const res = mockRes();

      vi.spyOn(User, "findById").mockResolvedValue({
        _id: mockUserId,
      } as any);

      vi.spyOn(Route, "findOne").mockResolvedValue({
        _id: mockPathId,
        user: mockUserId,
      } as any);

      vi.spyOn(Run, "create").mockResolvedValue({
        _id: "run123",
      } as any);

      await saveRun(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);

      expect(Route.findOne).toHaveBeenCalledWith({
        _id: mockPathId,
        user: mockUserId,
      });

      expect(Run.create).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Run saved successfully",
        }),
      );
    });

    it("returns 500 when database throws error", async () => {
      const req = mockReq();
      const res = mockRes();

      vi.spyOn(User, "findById").mockRejectedValue(new Error("Database error"));

      await saveRun(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("loadRuns", () => {
    it("returns 401 without user", async () => {
      const req = mockReq({
        user: undefined,
      });

      const res = mockRes();

      await loadRuns(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("loads runs successfully", async () => {
      const req = mockReq();
      const res = mockRes();

      vi.spyOn(User, "findById").mockResolvedValue({
        _id: mockUserId,
      } as any);

      const sortMock = vi.fn().mockResolvedValue([
        {
          _id: "run123",
        },
      ]);

      vi.spyOn(Run, "find").mockReturnValue({
        sort: sortMock,
      } as any);

      await loadRuns(req, res);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);

      expect(Run.find).toHaveBeenCalledWith({
        user: mockUserId,
      });

      expect(sortMock).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(res.status).toHaveBeenCalledWith(200);

      expect(res.json).toHaveBeenCalled();
    });

    it("returns 500 when database fails", async () => {
      const req = mockReq();
      const res = mockRes();

      vi.spyOn(User, "findById").mockRejectedValue(new Error("Database error"));

      await loadRuns(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
