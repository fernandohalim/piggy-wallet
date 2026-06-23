import { currentCycle } from "./budget";
import { categoryLabel, type CategoryId, type Expense } from "./types";

export type PeriodMode = "cycle" | "month" | "custom";

export const MAX_CUSTOM_DAYS = 31;
const DAY_MS = 86_400_000;

/** 00:00 ms of the day containing `ms` */
export const dayStart = (ms: number) => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

export interface ExpenseFilter {
  period: PeriodMode;
  monthRef: number;     // any ms inside the chosen month (month mode)
  customStart: number;  // 00:00 ms of first day (custom mode)
  customEnd: number;    // 00:00 ms of last day, INCLUSIVE (custom mode)
  categoryId: CategoryId | null;
  search: string;
}

/** start inclusive, end exclusive */
export function periodRange(
  filter: ExpenseFilter,
  cycleStartDay: number,
  now: number,
): { start: number; end: number } {
  if (filter.period === "month") {
    const d = new Date(filter.monthRef);
    return {
      start: new Date(d.getFullYear(), d.getMonth(), 1).getTime(),
      end: new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime(),
    };
  }
  if (filter.period === "custom") {
    const s = new Date(filter.customStart);
    const e = new Date(filter.customEnd);
    return {
      start: new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime(),
      end: new Date(e.getFullYear(), e.getMonth(), e.getDate() + 1).getTime(),
    };
  }
  return currentCycle(cycleStartDay, now);
}

export function filterExpenses(
  expenses: Expense[],
  filter: ExpenseFilter,
  cycleStartDay: number,
  now: number,
): Expense[] {
  const { start, end } = periodRange(filter, cycleStartDay, now);
  const q = filter.search.trim().toLowerCase();
  return expenses.filter((e) => {
    if (e.occurredAt < start || e.occurredAt >= end) return false;
    if (filter.categoryId && e.categoryId !== filter.categoryId) return false;
    if (q) {
      const hay = `${e.name ?? ""} ${categoryLabel(e.categoryId)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export { DAY_MS };