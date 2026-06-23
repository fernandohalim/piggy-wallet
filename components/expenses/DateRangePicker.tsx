"use client";
import { useState } from "react";
import { monthMatrix } from "@/lib/date";
import { dayStart, MAX_CUSTOM_DAYS, DAY_MS } from "@/lib/expenseFilter";
import { createPortal } from "react-dom";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
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

export function DateRangePicker({
  start,
  end,
  onApply,
  onClose,
}: {
  start: number;
  end: number;
  onApply: (start: number, end: number) => void;
  onClose: () => void;
}) {
  const [s, setS] = useState<number | null>(dayStart(start));
  const [e, setE] = useState<number | null>(dayStart(end));
  const [view, setView] = useState(() => {
    const d = new Date(start);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const [nowMs] = useState(() => Date.now());
  const cells = monthMatrix(view.y, view.m);
  const today = dayStart(nowMs);
  const nowD = new Date(nowMs);
  const atCurrentMonth =
    view.y === nowD.getFullYear() && view.m === nowD.getMonth();
  const shift = (delta: number) =>
    setView((v) => {
      const m = v.m + delta;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });

  const pick = (d: Date) => {
    const t = dayStart(d.getTime());
    if (t > today) return; // no future dates
    if (s === null || e !== null) {
      setS(t);
      setE(null);
      return;
    } // start a fresh range
    if (t < s) {
      setS(t);
      setE(null);
      return;
    } // earlier tap → new start
    if ((t - s) / DAY_MS + 1 > MAX_CUSTOM_DAYS) {
      setS(t);
      setE(null);
      return;
    } // > 1 month → restart
    setE(t);
  };

  const inRange = (t: number) => s !== null && e !== null && t >= s && t <= e;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-sm bg-background rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[90dvh] overflow-y-auto no-scrollbar animate-slide-up sm:animate-scale-in">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Pick a date range</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-muted">
          Tap a start day, then an end day. Up to 1 month.
        </p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => shift(-1)}
            aria-label="Previous month"
            className="w-9 h-9 text-muted text-lg"
          >
            ‹
          </button>
          <span className="text-sm font-medium">
            {MONTHS[view.m]} {view.y}
          </span>
          <button
            type="button"
            onClick={() => shift(1)}
            disabled={atCurrentMonth}
            aria-label="Next month"
            className="w-9 h-9 text-muted text-lg disabled:opacity-30"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-xs text-muted py-1">
              {w}
            </span>
          ))}
          {cells.map((d, i) => {
            const t = dayStart(d.getTime());
            const inMonth = d.getMonth() === view.m;
            const isFuture = t > today;
            const isToday = t === today;
            const isEndpoint =
              (s !== null && t === s) || (e !== null && t === e);
            const between = inRange(t) && !isEndpoint;
            return (
              <button
                key={i}
                type="button"
                disabled={isFuture}
                onClick={() => pick(d)}
                className={`h-9 rounded-card text-sm transition-colors ${
                  isEndpoint
                    ? "bg-primary text-white font-medium"
                    : between
                      ? "bg-primary-soft text-primary-dark"
                      : isFuture
                        ? "text-muted/30"
                        : isToday
                          ? "text-primary-dark font-medium ring-1 ring-primary/40"
                          : inMonth
                            ? "text-ink hover:bg-primary-soft"
                            : "text-muted/40"
                }`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={s === null || e === null}
          onClick={() => {
            if (s !== null && e !== null) {
              onApply(s, e);
              onClose();
            }
          }}
          className="w-full h-12 rounded-card bg-primary text-white font-medium disabled:opacity-50"
        >
          Apply
        </button>
      </div>
    </div>,
    document.body,
  );
}
