"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, listExpenses } from "@/lib/db/repository";
import { computeRange, type RangeType } from "@/lib/range";
import { CATEGORIES, categoryLabel, type CategoryId } from "@/lib/types";
import { formatIDR } from "@/lib/format";
import { categoryColor, CategoryIcon, PieIcon } from "../ui/Icons";
import { RangeTabs } from "../ui/RangeTabs";

const RANGE_OPTIONS: { value: RangeType; label: string }[] = [
  { value: "cycle", label: "Cycle" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];
const RANGE_NOUN: Record<RangeType, string> = {
  cycle: "cycle",
  month: "month",
  week: "week",
};

export function SpendingDonut() {
  const [nowMs] = useState(() => Date.now());
  const [active, setActive] = useState<CategoryId | null>(null);
  const [range, setRange] = useState<RangeType>("cycle");

  const data = useLiveQuery(async () => {
    const settings = await getSettings();
    const { start, end, label } = computeRange(
      range,
      settings.cycleStartDay,
      nowMs,
    );
    const expenses = await listExpenses();
    const totals = new Map<CategoryId, number>();
    let total = 0;
    let count = 0;
    for (const e of expenses) {
      if (e.occurredAt >= start && e.occurredAt < end) {
        totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + e.amount);
        total += e.amount;
        count++;
      }
    }
    const slices = CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      value: totals.get(c.id) ?? 0,
    }))
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value);
    return { slices, total, label, count };
  }, [nowMs, range]);

  if (!data) return null;

  const header = (
    <div className="flex items-center justify-between gap-2 mb-3">
      <span className="text-lg font-semibold">Where it goes</span>
      <RangeTabs value={range} onChange={setRange} options={RANGE_OPTIONS} />
    </div>
  );

  if (data.slices.length === 0) {
    return (
      <section className="rounded-card bg-surface border border-border shadow-card p-5">
        {header}
        <p className="text-sm text-muted py-8 text-center">
          <PieIcon className="h-8 w-8 mx-auto mb-2 text-muted" />
          No spending this {RANGE_NOUN[range]} yet. Add an expense to see the
          breakdown.
        </p>
      </section>
    );
  }

  const activeSlice = active ? data.slices.find((s) => s.id === active) : null;

  return (
    <section className="rounded-card bg-surface border border-border shadow-card p-5">
      {header}

      <div className="mb-4">
        <p className="text-2xl font-bold leading-tight tabular-nums">
          {formatIDR(data.total)}
        </p>
        <p className="text-xs text-muted">{data.label}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div
          className="relative mx-auto sm:mx-0 h-44 w-44 shrink-0"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.slices}
                dataKey="value"
                nameKey="label"
                innerRadius="62%"
                outerRadius="100%"
                paddingAngle={2}
                stroke="none"
                startAngle={90}
                endAngle={-270}
                onMouseEnter={(_, i) => setActive(data.slices[i].id)}
                onMouseLeave={() => setActive(null)}
                isAnimationActive={false}
              >
                {data.slices.map((s) => (
                  <Cell
                    key={s.id}
                    fill={categoryColor(s.id)}
                    opacity={active && active !== s.id ? 0.3 : 1}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
            {activeSlice ? (
              <>
                <CategoryIcon
                  id={activeSlice.id}
                  className="h-5 w-5 mb-1"
                  style={{ color: categoryColor(activeSlice.id) }}
                />
                <span className="text-2xl font-bold leading-none">
                  {Math.round((activeSlice.value / data.total) * 100)}%
                </span>
                <span className="text-[10px] text-muted truncate max-w-full mt-0.5">
                  {categoryLabel(activeSlice.id)}
                </span>
              </>
            ) : (
              <>
                <span className="text-3xl font-bold leading-none">
                  {data.count}
                </span>
                <span className="text-[11px] text-muted mt-1">
                  {data.count === 1 ? "expense" : "expenses"}
                </span>
              </>
            )}
          </div>
        </div>

        <ul className="flex-1 space-y-1">
          {data.slices.map((s) => {
            const pct = Math.round((s.value / data.total) * 100);
            return (
              <li key={s.id}>
                <button
                  onClick={() => setActive(active === s.id ? null : s.id)}
                  onMouseEnter={() => setActive(s.id)}
                  onMouseLeave={() => setActive(null)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors ${
                    active === s.id ? "bg-background" : ""
                  }`}
                >
                  <CategoryIcon
                    id={s.id}
                    className="h-4 w-4 shrink-0"
                    style={{ color: categoryColor(s.id) }}
                  />
                  <span className="flex-1 min-w-0 truncate text-sm">
                    {s.label}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatIDR(s.value)}
                  </span>
                  <span className="w-9 text-right text-xs text-muted tabular-nums">
                    {pct}%
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
