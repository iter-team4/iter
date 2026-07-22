import { useEffect, useMemo, useState } from "react";
import HomeSidebar from "../components/home/HomeSidebar";
import { getWalkingRoute } from "../services/routing";
import { useTheme } from "../hooks/use-theme";
import { useAuthGuard } from "../hooks/use-auth-guard";
import { dateKey } from "../utils/date";
import type { Run } from "../types/run";
import type { Panel } from "../types/homepage";
import type { SavedRoute } from "../types/route";
import "leaflet/dist/leaflet.css";
import "../lib/leaflet";
import HomeMap from "../components/home/HomeMap";
import IconRail from "../components/home/IconRail";
import PathsPanel from "../components/home/PathsPanel";
import CalendarPanel from "../components/home/CalendarPanel";
import ProfilePanel from "../components/home/ProfilePanel";

export function HomePage() {
  const [activePanel, setActivePanel] = useState<Panel | null>(null);
  const [pathsTab, setPathsTab] = useState<"create" | "saved">("create");

  const [username, setUsername] = useState("");
  const [memberSince, setMemberSince] = useState("");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [myRuns, setMyRuns] = useState<Run[]>([]);

  const [pathPoints, setPathPoints] = useState<[number, number][]>([]);

  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);

  const [distance, setDistance] = useState(0);

  const [selectedRoute, setSelectedRoute] = useState<[number, number][]>([]);

  const [routeName, setRouteName] = useState("");

  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [runsLoading, setRunsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SavedRoute[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [routeMsg, setRouteMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deleteMsg, setDeleteMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [selectedSavedRoute, setSelectedSavedRoute] =
    useState<SavedRoute | null>(null);

  const { isDark, toggleTheme } = useTheme();
  useAuthGuard();

  const DEFAULT_LOCATION: [number, number] = [28.6024, -81.2001];

  const [userLocation, setUserLocation] =
    useState<[number, number]>(DEFAULT_LOCATION);

  const calculateRoute = async () => {
    try {
      const result = await getWalkingRoute(pathPoints as [number, number][]);

      setRouteGeometry(result.geometry);
      setDistance(result.distanceMiles);

      return result;
    } catch (error) {
      console.error(error);
      setRouteMsg({
        type: "error",
        text: "Could not calculate walking route.",
      });
    }
  };

  /*
   * Load saved routes from backend
   */
  const loadRoutes = async () => {
    setRoutesLoading(true);
    try {
      const token = localStorage.getItem("idToken");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/routes/my-routes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Loaded routes:", data);

      setSavedRoutes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed loading routes:", error);
      setSavedRoutes([]);
    } finally {
      setRoutesLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      () => {
        console.log("Location permission denied.");
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  useEffect(() => {
    loadRoutes();
  }, []);

  const searchRoutes = async (q: string) => {
    setSearchLoading(true);
    try {
      const token = localStorage.getItem("idToken");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/routes/search?q=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /*
   * Load the logged-in user's completed runs (read-only, logged via the mobile app)
   */
  const loadRuns = async () => {
    const token = localStorage.getItem("idToken");
    if (!token) return;

    setRunsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/runs/my-runs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setMyRuns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed loading runs:", error);
      setMyRuns([]);
    } finally {
      setRunsLoading(false);
    }
  };

  useEffect(() => {
    loadRuns();
  }, []);

  // ── Read user info from the JWT already in localStorage ────────
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (!token) return;
    try {
      // JWT payload is the second base64url segment
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      // preferred_username is the human-readable username set at registration
      setUsername(payload["preferred_username"] ?? payload["email"] ?? "User");
      // "iat" (issued-at) is seconds since epoch — use as a proxy for account context
      // If your backend stores a real createdAt, prefer that instead
      if (payload["iat"]) {
        const d = new Date(payload["iat"] * 1000);
        setMemberSince(
          d.toLocaleDateString("en-US", { month: "long", year: "numeric" })
        );
      }
    } catch {
      console.error("Could not decode idToken");
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const deleteRoute = async () => {
    if (!selectedSavedRoute) return;

    const token = localStorage.getItem("idToken");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/routes/${selectedSavedRoute._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setDeleteMsg({ type: "success", text: "Route deleted successfully." });
      setSelectedSavedRoute(null);
      setSelectedRoute([]);
      setConfirmDelete(false);
      loadRoutes();
    } else {
      setDeleteMsg({ type: "error", text: "Failed to delete route." });
      setConfirmDelete(false);
    }
  };

  useEffect(() => {
    if (pathPoints.length < 2) {
      setRouteGeometry([]);
      setDistance(0);
      return;
    }

    calculateRoute();
  }, [pathPoints]);

  /*
   * Save route to backend
   */
  const saveRoute = async (routeData: {
    geometry: [number, number][];
    distanceMiles: number;
  }) => {
    if (routeName.trim() === "" || pathPoints.length < 2) {
      setRouteMsg({
        type: "error",
        text: "Add at least 2 points and a route name.",
      });
      return;
    }

    const token = localStorage.getItem("idToken");

    const waypoints = routeData.geometry.map(([lat, lng]) => [lng, lat]);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/routes/save`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          routeName,
          distanceMiles: routeData.distanceMiles,
          waypoints,
        }),
      }
    );

    if (response.ok) {
      setRouteMsg({ type: "success", text: "Route saved successfully!" });
      setRouteName("");
      setPathPoints([]);
      await loadRoutes();
    } else {
      setRouteMsg({ type: "error", text: "Failed to save route." });
    }
  };

  /*
   * Bucket runs by the calendar day they happened on
   */
  const runsByDay = useMemo(() => {
    const map: Record<string, Run[]> = {};

    for (const run of myRuns) {
      const key = dateKey(new Date(run.createdAt));
      (map[key] ??= []).push(run);
    }

    return map;
  }, [myRuns]);

  const selectedDayRuns = selectedDate
    ? (runsByDay[dateKey(selectedDate)] ?? [])
    : [];

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        <main className="flex-1">
          <HomeMap
            userLocation={userLocation}
            isDark={isDark}
            activePanel={activePanel}
            pathsTab={pathsTab}
            pathPoints={pathPoints}
            setPathPoints={setPathPoints}
            routeGeometry={routeGeometry}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
          />
        </main>

        <HomeSidebar activePanel={activePanel} setActivePanel={setActivePanel}>
          {activePanel === "paths" && (
            <PathsPanel
              pathsTab={pathsTab}
              setPathsTab={setPathsTab}

              routeName={routeName}
              setRouteName={setRouteName}

              pathPoints={pathPoints}
              setPathPoints={setPathPoints}

              routeGeometry={routeGeometry}
              distance={distance}

              saveRoute={saveRoute}

              savedRoutes={savedRoutes}
              routesLoading={routesLoading}

              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchRoutes={searchRoutes}

              searchResults={searchResults}
              searchLoading={searchLoading}

              selectedSavedRoute={selectedSavedRoute}
              setSelectedSavedRoute={setSelectedSavedRoute}

              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}

              confirmDelete={confirmDelete}
              setConfirmDelete={setConfirmDelete}

              deleteRoute={deleteRoute}

              routeMsg={routeMsg}
              deleteMsg={deleteMsg}
            />
          )}

          {activePanel === "calendar" && (
            <CalendarPanel
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              myRuns={myRuns}
              selectedDayRuns={selectedDayRuns}
              runsLoading={runsLoading}
              runsByDay={runsByDay}
              setSelectedRoute={setSelectedRoute}
            />
          )}

          {activePanel === "profile" && (
            <ProfilePanel
              username={username}
              memberSince={memberSince}
              myRuns={myRuns}
              runsLoading={runsLoading}
              handleSignOut={handleSignOut}
            />
          )}
        </HomeSidebar>

        <IconRail
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          setSelectedRoute={setSelectedRoute}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </div>
    </div>
  );
}