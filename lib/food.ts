import { currentCycle } from "./budget";
import { dayKey, startOfWeekMonday } from "./date";
import type { Expense, FoodBudget, FoodReset } from "./types";

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export interface FoodMeter {
  splitMode: FoodBudget["splitMode"];
  weekdayAmount: number;
  weekendAmount: number;
  reset: FoodReset;
  cycleStart: number;
  cycleEnd: number;
  totalDays: number;
  weeklyProjection: number;
  monthlyProjection: number;
  todayBase: number;
  carryIn: number;
  todayAvailable: number;
  spentToday: number;
  remainingToday: number;
  weekSpent: number;
  cycleSpent: number;
}

export function computeFoodMeter(
  budget: FoodBudget,
  cycleStartDay: number,
  foodExpenses: Expense[],
  nowMs: number,
  reset: FoodReset = "cycle",
): FoodMeter {
  const wd = budget.weekdayAmount ?? 0;
  const we = budget.weekendAmount ?? 0;
  const { start, end } = currentCycle(cycleStartDay, nowMs);

  // Cycle day allocations — drive the "this cycle (projected)" cap.
  const alloc: number[] = [];
  for (let t = start; t < end; ) {
    const d = new Date(t);
    alloc.push(isWeekend(d) ? we : wd);
    t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
  }

  // Spending indexed by day, across ALL expenses (the weekly window can reach
  // back into the previous cycle), plus the cycle total for the projection.
  const spentByKey = new Map<string, number>();
  let cycleSpent = 0;
  for (const e of foodExpenses) {
    const k = dayKey(e.occurredAt);
    spentByKey.set(k, (spentByKey.get(k) ?? 0) + e.amount);
    if (e.occurredAt >= start && e.occurredAt < end) cycleSpent += e.amount;
  }

  const td = new Date(nowMs);
  const todayStart = new Date(td.getFullYear(), td.getMonth(), td.getDate()).getTime();
  const todayKey = dayKey(nowMs);

  // Carry-in window: nothing (daily), this week so far (weekly), or this cycle
  // so far (cycle). Independent weeks reset every Monday regardless of cycle.
  const windowStart =
    reset === "weekly"
      ? startOfWeekMonday(nowMs)
      : reset === "cycle"
        ? start
        : todayStart; // daily

  let carryIn = 0;
  for (let t = windowStart; t < todayStart; ) {
    const d = new Date(t);
    const a = isWeekend(d) ? we : wd;
    carryIn += a - (spentByKey.get(dayKey(d.getTime())) ?? 0);
    t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
  }

  const todayBase = isWeekend(td) ? we : wd;
  const spentToday = spentByKey.get(todayKey) ?? 0;
  const todayAvailable = todayBase + carryIn;
  const remainingToday = todayAvailable - spentToday;

  const ws = startOfWeekMonday(nowMs);
  const weEnd = ws + 7 * 86_400_000;
  let weekSpent = 0;
  for (const e of foodExpenses) if (e.occurredAt >= ws && e.occurredAt < weEnd) weekSpent += e.amount;

  return {
    splitMode: budget.splitMode,
    weekdayAmount: wd,
    weekendAmount: we,
    reset,
    cycleStart: start,
    cycleEnd: end,
    totalDays: alloc.length,
    weeklyProjection: wd * 5 + we * 2,
    monthlyProjection: alloc.reduce((s, a) => s + a, 0),
    todayBase,
    carryIn,
    todayAvailable,
    spentToday,
    remainingToday,
    weekSpent,
    cycleSpent,
  };
}

// Live projection for the editor (before saving)
export function projectFood(weekdayAmount: number, weekendAmount: number, cycleStartDay: number, nowMs: number) {
  const { start, end } = currentCycle(cycleStartDay, nowMs);
  let weekdays = 0;
  let weekends = 0;
  for (let t = start; t < end; ) {
    const d = new Date(t);
    if (isWeekend(d)) weekends++; else weekdays++;
    t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
  }
  return {
    weekly: weekdayAmount * 5 + weekendAmount * 2,
    monthly: weekdayAmount * weekdays + weekendAmount * weekends,
    days: weekdays + weekends,
  };
}