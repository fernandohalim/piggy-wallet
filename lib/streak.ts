import { dayKey } from "./date";
import type { Expense } from "./types";

const MILESTONES = [3, 7, 14, 30, 60, 100, 365];

const noon = (ms: number) => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0).getTime();
};
const prevDay = (ms: number) => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1, 12, 0, 0, 0).getTime();
};

export interface StreakInfo {
  current: number;
  loggedToday: boolean;
  milestone: number | null;
}

export function computeStreak(expenses: Expense[], nowMs: number): StreakInfo {
  const set = new Set<string>();
  for (const e of expenses) set.add(dayKey(e.occurredAt));

  const loggedToday = set.has(dayKey(nowMs));

  let cursor = noon(nowMs);
  if (!set.has(dayKey(cursor))) {
    cursor = prevDay(cursor); // today empty → keep streak alive from yesterday
    if (!set.has(dayKey(cursor))) return { current: 0, loggedToday, milestone: null };
  }

  let current = 0;
  while (set.has(dayKey(cursor))) {
    current++;
    cursor = prevDay(cursor);
  }

  let milestone: number | null = null;
  for (const m of MILESTONES) if (current >= m) milestone = m;

  return { current, loggedToday, milestone };
}