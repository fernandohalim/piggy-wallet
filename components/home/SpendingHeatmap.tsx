"use client";
import { useMemo, useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { listExpenses } from "@/lib/db/repository";
import { dayKey, startOfWeekMonday } from "@/lib/date";
import { formatIDR } from "@/lib/format";

const WEEKS = 15;
const DAY_MS = 86_400_000;
const WD = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const LEVEL_BG = ["#ECEAF6", "#DDDCF7", "#B9B8EF", "#8B8AE3", "#5B5BD6"];

type Cell = { ms: number; key: string; amount: number; inFuture: boolean };

export function SpendingHeatmap() {
  const [nowMs] = useState(() => Date.now());
  const [hover, setHover] = useState<Cell | null>(null);

  const totals = useLiveQuery(async () => {
    const expenses = await listExpenses();
    const m = new Map<string, number>();
    for (const e of expenses)
      m.set(
        dayKey(e.occurredAt),
        (m.get(dayKey(e.occurredAt)) ?? 0) + e.amount,
      );
    return m;
  }, [nowMs]);

  const grid = useMemo(() => {
    if (!totals) return null;
    const startMonday = startOfWeekMonday(nowMs - (WEEKS - 1) * 7 * DAY_MS);
    const cols: Cell[][] = [];
    let max = 0;
    for (let w = 0; w < WEEKS; w++) {
      const col: Cell[] = [];
      for (let d = 0; d < 7; d++) {
        const ms = startMonday + (w * 7 + d) * DAY_MS;
        const key = dayKey(ms);
        const amount = totals.get(key) ?? 0;
        if (amount > max) max = amount;
        col.push({ ms, key, amount, inFuture: ms > nowMs });
      }
      cols.push(col);
    }
    return { cols, max };
  }, [totals, nowMs]);

  if (!grid) return null;

  const level = (a: number) => {
    if (a <= 0) return 0;
    if (grid.max <= 0) return 1;
    const r = a / grid.max;
    if (r > 0.66) return 4;
    if (r > 0.33) return 3;
    if (r > 0.1) return 2;
    return 1;
  };

  const monthLabel = (w: number) => {
    const d = new Date(grid.cols[w][0].ms);
    const prev = w > 0 ? new Date(grid.cols[w - 1][0].ms) : null;
    return !prev || prev.getMonth() !== d.getMonth()
      ? MONTHS[d.getMonth()]
      : "";
  };

  return (
    <section className="rounded-card bg-surface border border-border shadow-card p-5">
      <div className="flex items-center justify-between mb-3 gap-2">
        <h2 className="text-lg font-semibold">Spending heatmap</h2>
        <span className="text-xs text-muted text-right">
          {hover
            ? `${formatIDR(hover.amount)} · ${new Date(hover.ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}`
            : "last 15 weeks"}
        </span>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <div className="inline-flex flex-col gap-1 min-w-full">
          <div className="flex gap-1 pl-7">
            {grid.cols.map((_, w) => (
              <span
                key={w}
                className="w-3.5 text-[9px] text-muted leading-none"
              >
                {monthLabel(w)}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-0.5 w-6">
              {WD.map((d, i) => (
                <span
                  key={i}
                  className="h-3.5 text-[9px] text-muted leading-[0.9rem]"
                >
                  {d}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {grid.cols.map((col, w) => (
                <div key={w} className="flex flex-col gap-1">
                  {col.map((cell) => (
                    <button
                      key={cell.key}
                      type="button"
                      disabled={cell.inFuture}
                      onMouseEnter={() => !cell.inFuture && setHover(cell)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => !cell.inFuture && setHover(cell)}
                      aria-label={`${cell.key}: ${formatIDR(cell.amount)}`}
                      className="h-3.5 w-3.5 rounded-[3px] transition-transform hover:scale-110 disabled:opacity-0"
                      style={{ backgroundColor: LEVEL_BG[level(cell.amount)] }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted">
        <span>Less</span>
        {LEVEL_BG.map((c, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-[3px]"
            style={{ backgroundColor: c }}
          />
        ))}
        <span>More</span>
      </div>
    </section>
  );
}
