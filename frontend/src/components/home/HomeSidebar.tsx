import { ChevronLeft } from "lucide-react";
import type { Panel } from "../../types/homepage";

type Props = {
  activePanel: Panel | null;
  setActivePanel: React.Dispatch<React.SetStateAction<Panel | null>>;
  children: React.ReactNode;
};

export default function HomeSidebar({
  activePanel,
  setActivePanel,
  children,
}: Props) {
  return (
    <div
      className={`flex flex-col overflow-hidden border-l border-sidebar-border bg-card transition-all duration-300 ease-in-out ${
        activePanel ? "w-80" : "w-0"
      }`}
    >
      {activePanel && (
        <div className="flex h-full w-80 flex-col">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
            <h2 className="text-base font-semibold tracking-wide">
              {activePanel === "paths" && "Paths"}
              {activePanel === "calendar" && "Calendar"}
              {activePanel === "profile" && "Profile"}
            </h2>

            <button
              onClick={() => setActivePanel(null)}
              className="rounded-lg p-1.5 transition hover:bg-muted"
              aria-label="Close panel"
            >
              <ChevronLeft size={18} />
            </button>
          </div>


          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {children}
          </div>

        </div>
      )}
    </div>
  );
}