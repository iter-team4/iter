import type React from "react";
import { Moon, Sun, Route, CalendarDays, User } from "lucide-react";
import type { Panel } from "../../types/homepage";

interface IconRailProps {
  activePanel: Panel | null;
  setActivePanel: React.Dispatch<React.SetStateAction<Panel | null>>;
  setSelectedRoute: React.Dispatch<
    React.SetStateAction<[number, number][]>
  >;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function IconRail({
  activePanel,
  setActivePanel,
  setSelectedRoute,
  isDark,
  toggleTheme,
}: IconRailProps) {
  return (
    <div
      className="flex w-20 flex-col items-center justify-between py-5"
      style={{ backgroundColor: "#3C2A1E" }}
    >
      {/* Brand */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex flex-col items-center gap-1 pb-3 border-b border-white/10 w-full">
          <img
            src="/iter-logo.png"
            alt="iter mascot"
            className="w-10 h-10 object-contain"
          />
          <span className="text-white font-bold text-base tracking-widest">
            iter
          </span>
        </div>

        {/* Navigation icons */}
        {(
          [
            {
              id: "paths",
              icon: <Route size={20} />,
              label: "Paths",
            },
            {
              id: "calendar",
              icon: <CalendarDays size={20} />,
              label: "Calendar",
            },
            {
              id: "profile",
              icon: <User size={20} />,
              label: "Profile",
            },
          ] as {
            id: Panel;
            icon: React.ReactNode;
            label: string;
          }[]
        ).map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setActivePanel((prev) => (prev === id ? null : id));

              if (id !== "paths") {
                setSelectedRoute([]);
              }
            }}
            aria-label={label}
            title={label}
            className={`flex w-14 flex-col items-center gap-1 rounded-xl px-2 py-3 transition ${
              activePanel === id
                ? "bg-white/20 text-white"
                : "text-white/50 hover:bg-white/10 hover:text-white/80"
            }`}
          >
            {icon}
            <span className="text-[10px] font-medium leading-none">
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="rounded-xl p-2.5 text-white/50 transition hover:bg-white/10 hover:text-white/80"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  );
}