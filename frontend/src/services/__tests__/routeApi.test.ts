import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  getMyRoutes,
  searchRoutes,
  saveRoute,
  deleteRoute,
} from "../routeApi";

describe("routeApi", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("idToken", "test-token");

    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("gets user's routes", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            routeName: "Park Run",
          },
        ]),
    } as Response);

    const result = await getMyRoutes();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/routes/my-routes"),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer test-token",
        },
      })
    );

    expect(result[0].routeName).toBe("Park Run");
  });


  it("handles object response when getting routes", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          routes: [
            {
              _id: "1",
              routeName: "Lake Trail",
            },
          ],
        }),
    } as Response);

    const result = await getMyRoutes();

    expect(result[0].routeName).toBe("Lake Trail");
  });


  it("returns empty array when getting routes fails", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    } as Response);

    const result = await getMyRoutes();

    expect(result).toEqual([]);
  });


  it("searches routes", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            routeName: "Trail Run",
          },
        ]),
    } as Response);

    const result = await searchRoutes("trail");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/routes/search?q=trail"),
      expect.objectContaining({
        headers: {
          Authorization: "Bearer test-token",
        },
      })
    );

    expect(result[0].routeName).toBe("Trail Run");
  });


  it("handles object response when searching routes", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          routes: [
            {
              _id: "2",
              routeName: "Forest Trail",
            },
          ],
        }),
    } as Response);

    const result = await searchRoutes("forest");

    expect(result[0].routeName).toBe("Forest Trail");
  });


  it("loads all routes when search query is empty", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            routeName: "Morning Run",
          },
        ]),
    } as Response);

    const result = await searchRoutes("");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/routes/my-routes"),
      expect.anything()
    );

    expect(result[0].routeName).toBe("Morning Run");
  });


  it("saves a route", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const response = await saveRoute({
      routeName: "Morning Run",
      distanceMiles: 2,
      waypoints: [[1, 2]],
    });

    expect(response.ok).toBe(true);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/routes/save"),
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
          "Content-Type": "application/json",
        }),
      })
    );
  });


  it("deletes a route", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
    } as Response);

    const response = await deleteRoute("abc");

    expect(response.ok).toBe(true);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/routes/abc"),
      expect.objectContaining({
        method: "DELETE",
        headers: {
          Authorization: "Bearer test-token",
        },
      })
    );
  });
});