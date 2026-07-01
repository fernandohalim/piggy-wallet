"use client";
import { useMemo, useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { listExpenses } from "@/lib/db/repository";
import { dayKey, monthMatrix } from "@/lib/date";
import { formatIDR } from "@/lib/format";
import { CATEGORIES, categoryLabel, type CategoryId } from "@/lib/types";
import { categoryColor, CategoryIcon } from "../ui/Icons";
import { Dropdown } from "../ui/Dropdown";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WD = ["M", "T", "W", "T", "F", "S", "S"]; // Monday-first
const ALPHAS = [0, 0.16, 0.4, 0.66, 1]; // by level
const EMPTY = "#ECEAF6";

type CatFilter = "all" | CategoryId;

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function cellBg(level: number, hex: string) {
  if (level <= 0) return EMPTY;
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${ALPHAS[level]})`;
}

const CAT_OPTIONS: { value: CatFilter; label: string }[] = [
  { value: "all", label: "All categories" },
  ...CATEGORIES.map((c) => ({ value: c.id as CatFilter, label: c.label })),
];

type Hover = { ms: number; amount: number };

export function SpendingHeatmap() {
  const [nowMs] = useState(() => Date.now());
  const [cat, setCat] = useState<CatFilter>("all");
  const [hover, setHover] = useState<Hover | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const expenses = useLiveQuery(() => listExpenses(), []);

  const data = useMemo(() => {
    if (!expenses) return null;
    const totals = new Map<string, number>();
    for (const e of expenses) {
      if (cat !== "all" && e.categoryId !== cat) continue;
      const k = dayKey(e.occurredAt);
      totals.set(k, (totals.get(k) ?? 0) + e.amount);
    }

    const now = new Date(nowMs);
    let pY = now.getFullYear();
    let pM = now.getMonth() - 1;
    if (pM < 0) {
      pM = 11;
      pY -= 1;
    }
    const months = [
      { year: pY, month: pM },
      { year: now.getFullYear(), month: now.getMonth() },
    ].map(({ year, month }) => {
      const all = monthMatrix(year, month);
      let lastIn = 0;
      all.forEach((d, i) => {
        if (d.getMonth() === month) lastIn = i;
      });
      const cells = all.slice(0, Math.ceil((lastIn + 1) / 7) * 7);
      return { year, month, cells };
    });

    let max = 0;
    for (const m of months)
      for (const d of m.cells)
        if (d.getMonth() === m.month) {
          const a = totals.get(dayKey(d.getTime())) ?? 0;
          if (a > max) max = a;
        }

    return { totals, months, max };
  }, [expenses, nowMs, cat]);

  if (!data) return null;

  const dayList =
    selected != null && expenses
      ? expenses
          .filter(
            (e) =>
              dayKey(e.occurredAt) === dayKey(selected) &&
              (cat === "all" || e.categoryId === cat),
          )
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3)
      : [];

  const base = cat === "all" ? "#5B5BD6" : categoryColor(cat);

  const level = (a: number) => {
    if (a <= 0) return 0;
    if (data.max <= 0) return 1;
    const r = a / data.max;
    if (r > 0.66) return 4;
    if (r > 0.33) return 3;
    if (r > 0.1) return 2;
    return 1;
  };

  return (
    <section className="rounded-card bg-surface border border-border shadow-card p-5">
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-lg font-semibold">Spending heatmap</span>
        <span className="text-xs text-muted text-right">
          {hover ? (
            `${formatIDR(hover.amount)} · ${new Date(hover.ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
          ) : (
            <>
              <span className="sm:hidden">Last month</span>
              <span className="hidden sm:inline">Last 2 months</span>
            </>
          )}
        </span>
      </div>

      <div className="mb-4">
        <Dropdown value={cat} onChange={setCat} options={CAT_OPTIONS} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {data.months.map((m, idx) => (
          <div
            key={`${m.year}-${m.month}`}
            className={idx === 0 ? "hidden sm:block" : ""}
          >
            <p className="text-xs font-semibold text-ink mb-2">
              {MONTHS[m.month]} {m.year}
            </p>
            <div className="grid grid-cols-7 gap-1">
              {WD.map((d, i) => (
                <span
                  key={i}
                  className="text-[9px] text-muted text-center leading-none mb-0.5"
                >
                  {d}
                </span>
              ))}
              {m.cells.map((date, i) => {
                if (date.getMonth() !== m.month)
                  return <span key={i} className="aspect-square" />;
                const ms = date.getTime();
                const future = ms > nowMs;
                const amount = data.totals.get(dayKey(ms)) ?? 0;
                const lvl = level(amount);
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={future}
                    onMouseEnter={() => !future && setHover({ ms, amount })}
                    onMouseLeave={() => setHover(null)}
                    onClick={() =>
                      !future &&
                      setSelected(
                        amount > 0 ? (selected === ms ? null : ms) : null,
                      )
                    }
                    aria-label={`${dayKey(ms)}: ${formatIDR(amount)}`}
                    className={`aspect-square rounded-md flex items-center justify-center text-[9px] tabular-nums transition-transform ${
                      future ? "opacity-40" : "hover:scale-105"
                    } ${selected === ms ? "ring-2 ring-ink/50" : ""}`}
                    style={{
                      backgroundColor: future ? "#F3F1FA" : cellBg(lvl, base),
                      color: lvl >= 3 ? "rgba(255,255,255,0.9)" : "#9b98ad",
                    }}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-muted">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <span
            key={l}
            className="h-3 w-3 rounded-[3px]"
            style={{ backgroundColor: cellBg(l, base) }}
          />
        ))}
        <span>More</span>
      </div>

      {dayList.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-muted mb-2">
            Top expenses ·{" "}
            {new Date(selected!).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </p>
          <ul className="space-y-1.5">
            {dayList.map((e) => (
              <li key={e.id} className="flex items-center gap-2.5">
                <span
                  className="grid place-items-center h-8 w-8 shrink-0 rounded-full"
                  style={{
                    backgroundColor: `${categoryColor(e.categoryId)}1A`,
                    color: categoryColor(e.categoryId),
                  }}
                >
                  <CategoryIcon id={e.categoryId} className="h-4 w-4" />
                </span>
                <span className="flex-1 min-w-0 truncate text-sm">
                  {e.name ?? categoryLabel(e.categoryId)}
                </span>
                <span className="text-sm font-medium tabular-nums">
                  {formatIDR(e.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
