import { currentCycle, cycleLabel } from "./budget";
import { startOfWeekMonday } from "./date";

export type RangeType = "cycle" | "month" | "week";

export interface Range {
  start: number; // epoch ms, inclusive
  end: number;   // epoch ms, exclusive
  label: string;
}

const DAY_MS = 86_400_000;

export function computeRange(
  type: RangeType,
  cycleStartDay: number,
  ref: number,
): Range {
  if (type === "month") {
    const d = new Date(ref);
    const start = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
    const label = new Date(start).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
    return { start, end, label };
  }
  if (type === "week") {
    const start = startOfWeekMonday(ref);
    const end = start + 7 * DAY_MS;
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    const label = `${new Date(start).toLocaleDateString("en-GB", opts)} – ${new Date(
      end - DAY_MS,
    ).toLocaleDateString("en-GB", opts)}`;
    return { start, end, label };
  }
  // cycle (default) — your payday-anchored period
  const { start, end } = currentCycle(cycleStartDay, ref);
  return { start, end, label: cycleLabel(start, end) };
}