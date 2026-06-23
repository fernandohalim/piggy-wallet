import { currentCycle } from "./budget";
import { dayKey, startOfWeekMonday } from "./date";
import type { Expense, FoodBudget } from "./types";

const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

export interface FoodMeter {
  splitMode: FoodBudget["splitMode"];
  weekdayAmount: number;
  weekendAmount: number;
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
  rollover: boolean = true,
): FoodMeter {
  const wd = budget.weekdayAmount ?? 0;
  const we = budget.weekendAmount ?? 0;
  const { start, end } = currentCycle(cycleStartDay, nowMs);

  const days: Date[] = [];
  for (let t = start; t < end; ) {
    const d = new Date(t);
    days.push(d);
    t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
  }
  const alloc = days.map((d) => (isWeekend(d) ? we : wd)); // daily amount, authoritative

  const spentByKey = new Map<string, number>();
  let cycleSpent = 0;
  for (const e of foodExpenses) {
    if (e.occurredAt >= start && e.occurredAt < end) {
      const k = dayKey(e.occurredAt);
      spentByKey.set(k, (spentByKey.get(k) ?? 0) + e.amount);
      cycleSpent += e.amount;
    }
  }

  const todayKey = dayKey(nowMs);
  let ti = days.findIndex((d) => dayKey(d.getTime()) === todayKey);
  if (ti < 0) ti = days.length - 1;

  let allocThroughYesterday = 0;
  let spentBefore = 0;
  let spentToday = 0;
  for (let i = 0; i < days.length; i++) {
    const s = spentByKey.get(dayKey(days[i].getTime())) ?? 0;
    if (i < ti) { allocThroughYesterday += alloc[i]; spentBefore += s; }
    if (i === ti) spentToday = s;
  }

  const todayBase = alloc[ti] ?? 0;
  const carryIn = rollover ? allocThroughYesterday - spentBefore : 0;
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
    cycleStart: start,
    cycleEnd: end,
    totalDays: days.length,
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