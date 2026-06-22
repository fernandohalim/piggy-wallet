"use client";
import { useState } from "react";
import {
  dateInputValue,
  dayKey,
  dayLabel,
  monthMatrix,
  setDatePart,
  setTimePart,
  timeInputValue,
} from "@/lib/date";

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

export function WhenPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (ms: number) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">When</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full h-12 px-4 rounded-card bg-surface border border-border text-ink text-left flex items-center justify-between"
      >
        <span>
          {dayLabel(value)}, {timeInputValue(value)}
        </span>
        <span className="text-muted">🗓️</span>
      </button>
      {open && (
        <WhenModal
          value={value}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function WhenModal({
  value,
  onChange,
  onClose,
}: {
  value: number;
  onChange: (ms: number) => void;
  onClose: () => void;
}) {
  const sel = new Date(value);
  const [view, setView] = useState(() => ({
    y: sel.getFullYear(),
    m: sel.getMonth(),
  }));
  const [nowMs] = useState(() => Date.now());

  const selKey = dayKey(value);
  const todayKey = dayKey(nowMs);
  const cells = monthMatrix(view.y, view.m);

  const pickDate = (d: Date) =>
    onChange(setDatePart(value, dateInputValue(d.getTime())));
  const shift = (delta: number) =>
    setView((v) => {
      const m = v.m + delta;
      return { y: v.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
    });

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-background rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Pick date &amp; time</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => pickDate(new Date(nowMs))}
            className="flex-1 h-9 rounded-card bg-primary-soft text-primary-dark text-sm font-medium"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => pickDate(new Date(nowMs - 86_400_000))}
            className="flex-1 h-9 rounded-card bg-primary-soft text-primary-dark text-sm font-medium"
          >
            Yesterday
          </button>
        </div>

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
            aria-label="Next month"
            className="w-9 h-9 text-muted text-lg"
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
            const k = dayKey(d.getTime());
            const inMonth = d.getMonth() === view.m;
            const selected = k === selKey;
            const isToday = k === todayKey;
            return (
              <button
                key={i}
                type="button"
                onClick={() => pickDate(d)}
                className={`h-9 rounded-card text-sm ${
                  selected
                    ? "bg-primary text-white font-medium"
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

        <div className="flex items-center gap-2">
          <input
            type="time"
            value={timeInputValue(value)}
            onChange={(e) =>
              e.target.value && onChange(setTimePart(value, e.target.value))
            }
            className="flex-1 h-12 px-4 rounded-card bg-surface border border-border text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="button"
            onClick={() =>
              onChange(setTimePart(value, timeInputValue(Date.now())))
            }
            className="text-sm text-primary font-medium px-2"
          >
            Now
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full h-12 rounded-card bg-primary text-white font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
}
