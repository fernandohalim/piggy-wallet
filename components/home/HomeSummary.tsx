"use client";
import { useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, listExpenses } from "@/lib/db/repository";
import { currentCycle } from "@/lib/budget";
import { computeStreak } from "@/lib/streak";
import { dayKey } from "@/lib/date";
import { formatIDR } from "@/lib/format";

export function HomeSummary() {
  const [nowMs] = useState(() => Date.now());

  const data = useLiveQuery(async () => {
    const settings = await getSettings();
    const { start, end } = currentCycle(settings.cycleStartDay, nowMs);
    const expenses = await listExpenses();

    const todayKey = dayKey(nowMs);
    let todayTotal = 0;
    let cycleTotal = 0;
    for (const e of expenses) {
      if (dayKey(e.occurredAt) === todayKey) todayTotal += e.amount;
      if (e.occurredAt >= start && e.occurredAt < end) cycleTotal += e.amount;
    }
    return { todayTotal, cycleTotal, streak: computeStreak(expenses, nowMs) };
  }, [nowMs]);

  if (!data) return null;
  const { todayTotal, cycleTotal, streak } = data;

  return (
    <div className="space-y-3 mb-6">
      {streak.current > 0 && (
        <div className="flex items-center justify-between rounded-card bg-primary-soft px-4 py-2.5">
          <span className="flex items-center gap-2 text-primary-dark font-medium">
            <span className="text-lg">🔥</span> {streak.current}-day streak
          </span>
          {!streak.loggedToday ? (
            <span className="text-xs text-primary-dark">
              Log today to keep it!
            </span>
          ) : streak.milestone ? (
            <span className="text-xs text-primary-dark">
              🏆 {streak.milestone}-day badge
            </span>
          ) : null}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-card bg-surface border border-border p-3">
          <p className="text-xs text-muted">Today</p>
          <p className="text-lg font-semibold">{formatIDR(todayTotal)}</p>
        </div>
        <div className="rounded-card bg-surface border border-border p-3">
          <p className="text-xs text-muted">This cycle</p>
          <p className="text-lg font-semibold">{formatIDR(cycleTotal)}</p>
        </div>
      </div>
    </div>
  );
}
