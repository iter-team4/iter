import type { Run } from "../types/run";
import { formatDuration } from "../utils/formatDuration";

export function formatPace(run: Run): string {
  if (!run.distanceMiles) return "—";
  return `${formatDuration(run.durationSeconds / run.distanceMiles)} /mi`;
}