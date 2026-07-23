import type React from "react";
import { Calendar } from "../ui/calendar";
import { dateKey } from "../../utils/date";
import { formatPace } from "../../utils/run";
import { formatDuration } from "../../utils/formatDuration";
import type { Run } from "../../types/run";

interface CalendarPanelProps {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<Date | undefined>
  >;

  myRuns: Run[];
  selectedDayRuns: Run[];
  runsLoading: boolean;

  runsByDay: Record<string, Run[]>;

  setSelectedRoute: React.Dispatch<
    React.SetStateAction<[number, number][]>
  >;
}

export default function CalendarPanel({
  selectedDate,
  setSelectedDate,
  myRuns,
  selectedDayRuns,
  runsLoading,
  runsByDay,
  setSelectedRoute,
}: CalendarPanelProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">My Runs</h3>
        <p className="text-sm text-muted-foreground">
          Activity history
        </p>
      </div>

      {runsLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-64 w-full rounded-xl bg-muted/40" />
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="h-4 w-1/3 rounded bg-muted" />
        </div>
      ) : (
        <>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              hasRun: (date) => Boolean(runsByDay[dateKey(date)]),
            }}
            modifiersClassNames={{
              hasRun:
                "border border-green-500 bg-green-500/20 text-green-400",
            }}
            className="rounded-xl border border-border bg-muted/20"
          />

          {myRuns.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No runs yet. Complete a run in the iter mobile app and it'll
              show up here.
            </div>
          )}

          {selectedDate && (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <h4 className="font-semibold">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h4>

              {selectedDayRuns.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  No activity recorded.
                </p>
              ) : (
                <div className="mt-3 space-y-2">
                  {selectedDayRuns.map((run) => (
                    <button
                      key={run._id}
                      onClick={() => {
                        const points = run.waypoints.map(
                          ([lng, lat]) =>
                            [lat, lng] as [number, number]
                        );

                        setSelectedRoute(points);
                      }}
                      className="w-full rounded-lg border border-border bg-background/40 p-3 text-left transition hover:bg-accent"
                    >
                      <p className="font-semibold">
                        {run.pathName}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {run.distanceMiles.toFixed(2)} mi ·{" "}
                        {formatDuration(run.durationSeconds)} ·{" "}
                        {formatPace(run)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}