import type { RecurringRule } from "@/lib/types";

// Occurrences land at noon local time so they sit firmly on the intended
// calendar day regardless of timezone/DST (matters because budgets group by day).
const noonOn = (y: number, m: number, d: number) =>
  new Date(y, m, d, 12, 0, 0, 0).getTime();

const startOfDay = (ms: number) => {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
};

// Ascending generator of every occurrence timestamp from the rule's start onward.
// Capped for safety so a far-past startAt can never loop forever.
function* occurrences(rule: RecurringRule, cycleStartDay: number): Generator<number> {
  const start = new Date(startOfDay(rule.startAt));

  if (rule.frequency === "weekly") {
    const weekday = rule.weekday ?? start.getDay();
    const delta = (weekday - start.getDay() + 7) % 7; // days to first matching weekday on/after start
    let cur = noonOn(start.getFullYear(), start.getMonth(), start.getDate() + delta);
    for (let i = 0; i < 520; i++) {
      yield cur;
      const d = new Date(cur);
      cur = noonOn(d.getFullYear(), d.getMonth(), d.getDate() + 7);
    }
    return;
  }

  // monthly or cycle — "cycle" is simply monthly anchored to the payday day
  const dom = rule.frequency === "cycle" ? cycleStartDay : (rule.dayOfMonth ?? Math.min(start.getDate(), 28));
  const year = start.getFullYear();
  let month = start.getMonth();
  if (start.getDate() > dom) month += 1; // first occurrence on/after start
  for (let i = 0; i < 240; i++) {
    yield noonOn(year, month, dom); // Date() normalizes month overflow into later years
    month += 1;
  }
}

/**
 * Every occurrence that should be materialized right now: dated on/after the
 * rule's start day, strictly after the last one already created, and not in the
 * future. Returned ascending. `lastRunAt` is the sole idempotency watermark —
 * editing a generated expense's date never causes it to regenerate.
 */
export function dueOccurrences(rule: RecurringRule, cycleStartDay: number, now: number): number[] {
  const floor = Math.max(startOfDay(rule.startAt), (rule.lastRunAt ?? -Infinity) + 1);
  const out: number[] = [];
  for (const occ of occurrences(rule, cycleStartDay)) {
    if (occ > now) break; // ascending — nothing further is due
    if (occ >= floor) out.push(occ);
  }
  return out;
}
