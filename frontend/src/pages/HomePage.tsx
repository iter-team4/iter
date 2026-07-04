import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Plus, Route, CalendarDays } from "lucide-react";

type Panel = "create" | "saved" | "calendar";

type Run = {
  route: string;
  distance: number;
};

export function HomePage() {
  const [activePanel, setActivePanel] = useState<Panel>("create");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock data for now
  const runs: Record<string, Run> = {
    "2026-07-03": {
      route: "UCF Loop",
      distance: 3.1,
    },
    "2026-07-05": {
      route: "Lake Eola",
      distance: 5.2,
    },
    "2026-07-08": {
      route: "Neighborhood Run",
      distance: 2.4,
    },
  };

  const today = new Date();

  const year = today.getFullYear();
  const month = today.getMonth();

  const { monthName, calendarCells } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const firstDay = new Date(year, month, 1).getDay();

    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }

    const monthName = new Date(year, month).toLocaleString("default", {
      month: "long",
    });

    return {
      monthName,
      calendarCells: cells,
    };
  }, [month, year]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground">
      <div className="flex h-full">
        {/* MAP */}
        <main className="flex-1">
          <MapContainer
            center={[28.6024, -81.2001]}
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
        </main>

        {/* SIDEBAR */}
        <aside className="flex w-80 flex-col border-l border-sidebar-border bg-card">
          {/* Header */}
          <div className="border-b border-sidebar-border p-6">
            <h2 className="text-xl font-semibold">Dashboard</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Route planning tools
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3 p-5">
            <button
              onClick={() => setActivePanel("create")}
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
              onClick={() => setActivePanel("saved")}
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
              onClick={() => setActivePanel("calendar")}
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

          {/* Content */}
          <div className="flex-1 overflow-y-auto border-t border-sidebar-border p-5">
            {activePanel === "create" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Create Path</h3>

                <p className="text-sm text-muted-foreground">
                  Click points on the map to create custom running routes.
                </p>

                <div className="rounded-xl border border-dashed border-border p-4">
                  Path creation tools coming soon.
                </div>
              </div>
            )}

            {activePanel === "saved" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Saved Paths</h3>

                <p className="text-sm text-muted-foreground">
                  View your saved routes.
                </p>

                <div className="rounded-xl border border-dashed border-border p-4">
                  No saved routes yet.
                </div>
              </div>
            )}

            {activePanel === "calendar" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold">
                    {monthName} {year}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Your running history
                  </p>
                </div>

                {/* Days of week */}
                <div className="grid grid-cols-7 gap-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Calendar cells */}
                  {calendarCells.map((day, index) => {
                    if (!day) {
                      return <div key={index} className="aspect-square" />;
                    }

                    const dateKey = `${year}-${String(month + 1).padStart(
                      2,
                      "0"
                    )}-${String(day).padStart(2, "0")}`;

                    const run = runs[dateKey];

                    return (
                      <button
                        key={dateKey}
                        onClick={() => setSelectedDate(dateKey)}
                        className={`aspect-square rounded-lg border text-sm transition ${
                          run
                            ? "border-green-500 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "border-border bg-muted/30 hover:bg-muted"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Selected day */}
                {selectedDate && (
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <h4 className="font-medium">{selectedDate}</h4>

                    {runs[selectedDate] ? (
                      <div className="mt-3 space-y-2 text-sm">
                        <p>
                          <span className="text-muted-foreground">Route:</span>{" "}
                          {runs[selectedDate].route}
                        </p>

                        <p>
                          <span className="text-muted-foreground">
                            Distance:
                          </span>{" "}
                          {runs[selectedDate].distance} mi
                        </p>
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        No run recorded.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
