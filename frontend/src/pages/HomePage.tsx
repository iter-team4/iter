import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import {
  Plus,
  Route,
  CalendarDays,
} from "lucide-react";

type Panel = "create" | "saved" | "calendar";

export function HomePage() {
  const [activePanel, setActivePanel] =
    useState<Panel>("create");

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        {/* MAP */}
        <main className="relative flex-1">
          <MapContainer
            center={[28.6024, -81.2001]} // UCF
            zoom={13}
            scrollWheelZoom
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[28.6024, -81.2001]}>
              <Popup>Welcome to Running App 🏃</Popup>
            </Marker>
          </MapContainer>

          {/* Floating card */}
          <div className="absolute left-6 top-6 z-[1000] rounded-2xl border border-border bg-card/90 p-5 shadow-2xl backdrop-blur-md">
            <h1 className="text-2xl font-bold">
              Running App 🏃
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Plan and save your running routes.
            </p>
          </div>
        </main>

        {/* SIDEBAR */}
        <aside className="flex w-80 flex-col border-l border-sidebar-border bg-card">
          {/* Header */}
          <div className="border-b border-sidebar-border p-6">
            <h2 className="text-xl font-semibold">
              Dashboard
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Route planning tools
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-3 p-5">
            <button
              onClick={() =>
                setActivePanel("create")
              }
              className={`flex w-full items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                activePanel === "create"
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-muted/40 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Plus size={20} />
              <span>Create Path</span>
            </button>

            <button
              onClick={() =>
                setActivePanel("saved")
              }
              className={`flex w-full items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                activePanel === "saved"
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-muted/40 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Route size={20} />
              <span>Saved Paths</span>
            </button>

            <button
              onClick={() =>
                setActivePanel("calendar")
              }
              className={`flex w-full items-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                activePanel === "calendar"
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-border bg-muted/40 hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <CalendarDays size={20} />
              <span>Calendar</span>
            </button>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 border-t border-sidebar-border overflow-y-auto p-5">
            {activePanel === "create" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Create Path
                </h3>

                <p className="text-sm text-muted-foreground">
                  Click points on the map to build a
                  custom running route.
                </p>

                <div className="rounded-xl border border-dashed border-border p-4">
                  Path creation tools coming soon.
                </div>
              </div>
            )}

            {activePanel === "saved" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Saved Paths
                </h3>

                <p className="text-sm text-muted-foreground">
                  View and manage your saved
                  running routes.
                </p>

                <div className="rounded-xl border border-dashed border-border p-4">
                  No saved routes yet.
                </div>
              </div>
            )}

            {activePanel === "calendar" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Calendar
                </h3>

                <p className="text-sm text-muted-foreground">
                  Review your runs and scheduled
                  activities.
                </p>

                <div className="rounded-xl border border-dashed border-border p-4">
                  Calendar integration coming
                  soon.
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}