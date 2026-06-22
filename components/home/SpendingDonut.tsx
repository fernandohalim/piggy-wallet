"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, listExpenses } from "@/lib/db/repository";
import { currentCycle } from "@/lib/budget";
import {
  CATEGORIES,
  categoryLabel,
  categoryIcon,
  type CategoryId,
} from "@/lib/types";
import { formatIDR } from "@/lib/format";

const COLORS: Record<CategoryId, string> = {
  food: "#5B5BD6",
  groceries: "#20C9A6",
  transport: "#54B8F0",
  shopping: "#F5A623",
  bills: "#8B5CF6",
  entertainment: "#EF5A6F",
  health: "#F472B6",
  other: "#94A3B8",
};

export function SpendingDonut() {
  const [nowMs] = useState(() => Date.now());
  const [active, setActive] = useState<CategoryId | null>(null);

  const data = useLiveQuery(async () => {
    const settings = await getSettings();
    const { start, end } = currentCycle(settings.cycleStartDay, nowMs);
    const expenses = await listExpenses();
    const totals = new Map<CategoryId, number>();
    let total = 0;
    for (const e of expenses) {
      if (e.occurredAt >= start && e.occurredAt < end) {
        totals.set(e.categoryId, (totals.get(e.categoryId) ?? 0) + e.amount);
        total += e.amount;
      }
    }
    const slices = CATEGORIES.map((c) => ({
      id: c.id,
      label: c.label,
      value: totals.get(c.id) ?? 0,
    }))
      .filter((s) => s.value > 0)
      .sort((a, b) => b.value - a.value);
    return { slices, total };
  }, [nowMs]);

  if (!data) return null;

  if (data.slices.length === 0) {
    return (
      <section className="rounded-card bg-surface border border-border shadow-card p-5">
        <h2 className="text-lg font-semibold mb-1">Where it goes</h2>
        <p className="text-sm text-muted py-8 text-center">
          No spending this cycle yet. Add an expense to see the breakdown. 🥧
        </p>
      </section>
    );
  }

  const activeSlice = active ? data.slices.find((s) => s.id === active) : null;
  const center = activeSlice
    ? { title: categoryLabel(activeSlice.id), value: activeSlice.value }
    : { title: "This cycle", value: data.total };

  return (
    <section className="rounded-card bg-surface border border-border shadow-card p-5">
      <h2 className="text-lg font-semibold mb-3">Where it goes</h2>
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
                    fill={COLORS[s.id]}
                    opacity={active && active !== s.id ? 0.3 : 1}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] text-muted">{center.title}</span>
            <span className="text-lg font-bold leading-tight">
              {formatIDR(center.value)}
            </span>
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
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[s.id] }}
                  />
                  <span className="text-base">{categoryIcon(s.id)}</span>
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
