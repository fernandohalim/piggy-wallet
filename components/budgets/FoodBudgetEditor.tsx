"use client";
import { useState } from "react";
import { removeFoodBudget, setFoodBudget } from "@/lib/db/repository";
import { projectFood } from "@/lib/food";
import { Sheet } from "@/components/ui/Sheet";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/format";
import type { FoodBudget, SplitMode } from "@/lib/types";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function FoodBudgetEditor({
  budget,
  cycleStartDay,
  nowMs,
  onClose,
}: {
  budget: FoodBudget | null;
  cycleStartDay: number;
  nowMs: number;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<SplitMode>(budget?.splitMode ?? "even");
  const [daily, setDaily] = useState<number | null>(
    budget && budget.splitMode === "even" ? budget.weekdayAmount : null,
  );
  const [weekday, setWeekday] = useState<number | null>(
    budget?.weekdayAmount ?? null,
  );
  const [weekend, setWeekend] = useState<number | null>(
    budget?.weekendAmount ?? null,
  );
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const wd = mode === "even" ? (daily ?? 0) : (weekday ?? 0);
  const we = mode === "even" ? (daily ?? 0) : (weekend ?? 0);
  const valid = mode === "even" ? daily != null && daily > 0 : wd > 0 && we > 0;

  const proj = projectFood(wd, we, cycleStartDay, nowMs);

  async function save() {
    if (!valid) return;
    setBusy(true);
    try {
      await setFoodBudget({
        splitMode: mode,
        weekdayAmount: wd,
        weekendAmount: we,
      });
      onClose();
    } finally {
      setBusy(false);
    }
  }
  async function clear() {
    setBusy(true);
    try {
      await removeFoodBudget();
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open onClose={onClose} title="Food & Drinks budget">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">
            Budget type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode("even")}
              className={`h-11 rounded-card border text-sm ${mode === "even" ? "border-primary bg-primary-soft text-primary-dark" : "border-border text-muted"}`}
            >
              Even daily
            </button>
            <button
              type="button"
              onClick={() => setMode("split")}
              className={`h-11 rounded-card border text-sm ${mode === "split" ? "border-primary bg-primary-soft text-primary-dark" : "border-border text-muted"}`}
            >
              Weekday / weekend
            </button>
          </div>
        </div>

        {mode === "even" ? (
          <CurrencyInput
            label="Daily budget"
            value={daily}
            onChange={setDaily}
            autoFocus
          />
        ) : (
          <div className="space-y-3">
            <CurrencyInput
              label="Weekday budget (per day)"
              value={weekday}
              onChange={setWeekday}
              autoFocus
            />
            <CurrencyInput
              label="Weekend budget (per day)"
              value={weekend}
              onChange={setWeekend}
            />
          </div>
        )}

        {valid && (
          <div className="rounded-card bg-background p-3 text-sm space-y-1">
            <p className="text-muted text-xs">
              Projected from your daily budget
            </p>
            <p>
              ≈ <span className="font-medium">{formatIDR(proj.weekly)}</span>{" "}
              per week
            </p>
            <p>
              ≈ <span className="font-medium">{formatIDR(proj.monthly)}</span>{" "}
              this cycle <span className="text-muted">({proj.days} days)</span>
            </p>
          </div>
        )}

        <Button onClick={save} loading={busy} disabled={!valid}>
          Save budget
        </Button>
        {budget && (
          <button
            onClick={() => setConfirmDel(true)}
            disabled={busy}
            className="w-full h-12 text-danger font-medium"
          >
            Remove budget
          </button>
        )}
      </div>
      <ConfirmDialog
        open={confirmDel}
        title="Remove food budget"
        message="Your daily food budget will be removed. Your expenses stay untouched."
        confirmLabel="Remove"
        busy={busy}
        onConfirm={clear}
        onCancel={() => setConfirmDel(false)}
      />
    </Sheet>
  );
}
