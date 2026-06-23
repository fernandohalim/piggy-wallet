"use client";
import { useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/types";
import type { ExpenseFilter, PeriodMode } from "@/lib/expenseFilter";
import { RangeTabs } from "@/components/ui/RangeTabs";
import { Dropdown } from "@/components/ui/Dropdown";
import { CalendarIcon, SearchIcon } from "@/components/ui/Icons";
import { DateRangePicker } from "./DateRangePicker";

const fmtDay = (ms: number) =>
  new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export function ExpenseFilters({
  filter,
  onChange,
  cycleLabel,
}: {
  filter: ExpenseFilter;
  onChange: (patch: Partial<ExpenseFilter>) => void;
  cycleLabel: string;
}) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const monthDate = new Date(filter.monthRef);
  const monthLabel = monthDate.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
  const [nowMs] = useState(() => Date.now());
  const now = new Date(nowMs);
  const atCurrentMonth =
    monthDate.getFullYear() === now.getFullYear() &&
    monthDate.getMonth() === now.getMonth();
  const shiftMonth = (delta: number) =>
    onChange({
      monthRef: new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + delta,
        1,
      ).getTime(),
    });

  return (
    <div className="space-y-2">
      {/* row 1 — period */}
      <div className="flex items-center gap-2">
        <RangeTabs<PeriodMode>
          value={filter.period}
          onChange={(v) => onChange({ period: v })}
          options={[
            { value: "cycle", label: "Cycle" },
            { value: "month", label: "Month" },
            { value: "custom", label: "Custom" },
          ]}
        />

        {filter.period === "cycle" && (
          <span className="flex-1 min-w-0 text-right text-xs text-muted truncate">
            {cycleLabel}
          </span>
        )}
        {filter.period === "month" && (
          <div className="flex-1 flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="h-7 w-7 grid place-items-center rounded-full text-muted text-lg hover:bg-surface"
            >
              ‹
            </button>
            <span className="text-xs font-medium whitespace-nowrap">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={atCurrentMonth}
              aria-label="Next month"
              className="h-7 w-7 grid place-items-center rounded-full text-muted text-lg hover:bg-surface disabled:opacity-30"
            >
              ›
            </button>
          </div>
        )}
        {filter.period === "custom" && (
          <button
            type="button"
            onClick={() => setRangeOpen(true)}
            className="flex-1 min-w-0 flex items-center justify-end gap-1.5 text-xs font-medium text-primary"
          >
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {fmtDay(filter.customStart)} – {fmtDay(filter.customEnd)}
            </span>
          </button>
        )}
      </div>

      {/* row 2 — category + search */}
      <div className="flex gap-2">
        <div className="flex-1 min-w-0">
          <Dropdown<string>
            value={filter.categoryId ?? "all"}
            onChange={(v) =>
              onChange({ categoryId: v === "all" ? null : (v as CategoryId) })
            }
            options={[
              { value: "all", label: "All categories" },
              ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
            ]}
          />
        </div>
        <div className="relative flex-1 min-w-0">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            value={filter.search}
            onChange={(ev) => onChange({ search: ev.target.value })}
            placeholder="Search"
            className="w-full h-12 pl-9 pr-9 rounded-card bg-surface border border-border text-ink text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {filter.search && (
            <button
              type="button"
              onClick={() => onChange({ search: "" })}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {rangeOpen && (
        <DateRangePicker
          start={filter.customStart}
          end={filter.customEnd}
          onApply={(s, e) =>
            onChange({ period: "custom", customStart: s, customEnd: e })
          }
          onClose={() => setRangeOpen(false)}
        />
      )}
    </div>
  );
}
