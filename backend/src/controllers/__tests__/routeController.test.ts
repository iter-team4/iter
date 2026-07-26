import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveRoute,
  loadRoutes,
  searchRoutes,
  deleteRoute,
} from "../routeController.js";

import Route from "../../models/Route.js";
import User from "../../models/User.js";

vi.mock("../../models/Route.js", () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
    findOneAndDelete: vi.fn(),
  },
}));

vi.mock("../../models/User.js", () => ({
  default: {
    findById: vi.fn(),
  },
}));

const mockResponse = () => {
  const res: any = {};

  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);

  return res;
};

describe("routeController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("saveRoute", () => {
    it("returns 400 for invalid route data", async () => {
      const req: any = {
        body: {},
        user: {
          id: "123",
        },
      };

      const res = mockResponse();

      await saveRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid route data",
      });
    });

    it("returns 401 when user is missing", async () => {
      const req: any = {
        body: {
          routeName: "Test Route",
          distanceMiles: 5,
          waypoints: [
            { lat: 1, lng: 1 },
            { lat: 2, lng: 2 },
          ],
        },
        user: {},
      };

      const res = mockResponse();

      await saveRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("returns 404 when database user does not exist", async () => {
      vi.mocked(User.findById).mockResolvedValue(null);

      const req: any = {
        body: {
          routeName: "Morning Run",
          distanceMiles: 3,
          waypoints: [{}, {}],
        },
        user: {
          id: "abc",
        },
      };

      const res = mockResponse();

      await saveRoute(req, res);

      expect(User.findById).toHaveBeenCalledWith("abc");

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("creates route successfully", async () => {
      const fakeUser = {
        _id: "user123",
      };

      vi.mocked(User.findById).mockResolvedValue(fakeUser as any);

      vi.mocked(Route.create).mockResolvedValue({
        _id: "route123",
        routeName: "Morning Run",
      } as any);

      const req: any = {
        body: {
          routeName: "Morning Run",
          distanceMiles: 5,
          waypoints: [{}, {}],
        },
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      await saveRoute(req, res);

      expect(Route.create).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("returns 500 when route creation fails", async () => {
      vi.mocked(User.findById).mockResolvedValue({
        _id: "user123",
      } as any);

      vi.mocked(Route.create).mockRejectedValue(new Error("database failure"));

      const req: any = {
        body: {
          routeName: "Test",
          distanceMiles: 5,
          waypoints: [{}, {}],
        },
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      await saveRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("loadRoutes", () => {
    it("returns 401 without user", async () => {
      const req: any = {
        user: {},
      };

      const res = mockResponse();

      await loadRoutes(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("loads routes successfully", async () => {
      vi.mocked(User.findById).mockResolvedValue({
        _id: "user123",
      } as any);

      const sortMock = vi.fn().mockResolvedValue([
        {
          routeName: "Run",
        },
      ]);

      vi.mocked(Route.find).mockReturnValue({
        sort: sortMock,
      } as any);

      const req: any = {
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      await loadRoutes(req, res);

      expect(Route.find).toHaveBeenCalledWith({
        user: "user123",
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("returns 500 when loading routes fails", async () => {
      vi.mocked(User.findById).mockRejectedValue(new Error("database error"));

      const req: any = {
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      await loadRoutes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("searchRoutes", () => {
    it("searches routes successfully", async () => {
      vi.mocked(User.findById).mockResolvedValue({
        _id: "user123",
      } as any);

      const sortMock = vi.fn().mockResolvedValue([]);

      vi.mocked(Route.find).mockReturnValue({
        sort: sortMock,
      } as any);

      const req: any = {
        user: {
          id: "user123",
        },
        query: {
          q: "morning",
        },
      };

      const res = mockResponse();

      await searchRoutes(req, res);

      expect(Route.find).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteRoute", () => {
    it("returns 400 for invalid id", async () => {
      vi.mocked(User.findById).mockResolvedValue({
        _id: "user123",
      } as any);

      const req: any = {
        params: {
          id: "bad-id",
        },
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      await deleteRoute(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("deletes route successfully", async () => {
      vi.mocked(User.findById).mockResolvedValue({
        _id: "user123",
      } as any);

      vi.mocked(Route.findOneAndDelete).mockResolvedValue({
        _id: "route123",
      } as any);

      const req: any = {
        params: {
          id: "507f1f77bcf86cd799439011",
        },
        user: {
          id: "user123",
        },
      };

      const res = mockResponse();

      await deleteRoute(req, res);

      expect(Route.findOneAndDelete).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
