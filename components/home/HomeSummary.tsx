"use client";
import { useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, listExpenses } from "@/lib/db/repository";
import { currentCycle } from "@/lib/budget";
import { computeStreak } from "@/lib/streak";
import { dayKey } from "@/lib/date";
import { formatIDR } from "@/lib/format";
import { FlameIcon, TrophyIcon } from "../ui/Icons";

const addMonths = (ms: number, n: number) => {
  const d = new Date(ms);
  d.setMonth(d.getMonth() + n);
  return d.getTime();
};
const fmtDay = (ms: number) =>
  new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export function HomeSummary() {
  const [nowMs] = useState(() => Date.now());

  const data = useLiveQuery(async () => {
    const settings = await getSettings();
    const { start, end } = currentCycle(settings.cycleStartDay, nowMs);
    const expenses = await listExpenses();

    // Rolling month-over-month windows, anchored to today's date:
    // current  = [one month ago, today], previous = [two months ago, one month ago)
    const winStart = addMonths(nowMs, -1);
    const winPrev = addMonths(nowMs, -2);

    const todayKey = dayKey(nowMs);
    let todayTotal = 0;
    let cycleTotal = 0;
    let thisMonthTotal = 0;
    let lastMonthTotal = 0;
    for (const e of expenses) {
      if (dayKey(e.occurredAt) === todayKey) todayTotal += e.amount;
      if (e.occurredAt >= start && e.occurredAt < end) cycleTotal += e.amount;
      if (e.occurredAt >= winStart && e.occurredAt <= nowMs)
        thisMonthTotal += e.amount;
      else if (e.occurredAt >= winPrev && e.occurredAt < winStart)
        lastMonthTotal += e.amount;
    }

    return {
      todayTotal,
      cycleTotal,
      thisMonthTotal,
      lastMonthTotal,
      winStart,
      winPrev,
      streak: computeStreak(expenses, nowMs),
    };
  }, [nowMs]);

  if (!data) return null;
  const {
    todayTotal,
    cycleTotal,
    thisMonthTotal,
    lastMonthTotal,
    winStart,
    winPrev,
    streak,
  } = data;

  const delta =
    lastMonthTotal > 0
      ? Math.round(((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100)
      : null;
  const trendTitle = `${fmtDay(winStart)} – ${fmtDay(nowMs)} vs ${fmtDay(winPrev)} – ${fmtDay(winStart)}`;

  return (
    <div className="space-y-3 mb-6">
      {streak.current > 0 && (
        <div className="flex items-center justify-between rounded-card bg-primary-soft px-4 py-2.5">
          <span className="flex items-center gap-2 text-primary-dark font-medium">
            <FlameIcon className="h-5 w-5 text-accent" /> {streak.current}-day
            streak
          </span>
          {!streak.loggedToday ? (
            <span className="text-xs text-primary-dark">
              Log today to keep it!
            </span>
          ) : streak.milestone ? (
            <span className="text-xs text-primary-dark">
              <TrophyIcon className="inline h-3.5 w-3.5 mr-0.5 align-[-2px]" />
              {streak.milestone}-day badge
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

      {delta !== null && (
        <div
          title={trendTitle}
          className="flex items-center justify-between rounded-card bg-surface border border-border px-4 py-3"
        >
          <div>
            <p className="text-xs text-muted">Past month</p>
            <p className="text-base font-semibold tabular-nums">
              {formatIDR(thisMonthTotal)}
            </p>
          </div>
          <span
            className={`text-sm font-semibold ${
              delta > 0
                ? "text-rose-600"
                : delta < 0
                  ? "text-emerald-600"
                  : "text-muted"
            }`}
          >
            {delta > 0
              ? `↑ ${delta}%`
              : delta < 0
                ? `↓ ${Math.abs(delta)}%`
                : "≈ 0%"}{" "}
            <span className="font-normal text-muted">vs prev</span>
          </span>
        </div>
      )}
    </div>
  );
}
