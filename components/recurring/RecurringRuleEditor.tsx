"use client";
import { useState } from "react";
import { addRecurringRule, updateRecurringRule, deleteRecurringRule } from "@/lib/db/repository";
import { Sheet } from "@/components/ui/Sheet";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { CategorySelect } from "@/components/expenses/CategorySelect";
import { TextField } from "@/components/ui/TextField";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type { CategoryId, RecurringFrequency, RecurringRule } from "@/lib/types";

// Monday-first labels; values map to Date.getDay() (0 = Sunday)
const WEEKDAYS: { value: number; label: string }[] = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const FREQUENCIES: [RecurringFrequency, string][] = [
  ["monthly", "Monthly"],
  ["weekly", "Weekly"],
  ["cycle", "Every cycle"],
];

export function RecurringRuleEditor({
  rule,
  onClose,
}: {
  rule: RecurringRule | null; // null → creating a new rule
  onClose: () => void;
}) {
  const isEdit = !!rule;
  const [amount, setAmount] = useState<number | null>(rule?.amount ?? null);
  const [categoryId, setCategoryId] = useState<CategoryId | null>(rule?.categoryId ?? null);
  const [name, setName] = useState(rule?.name ?? "");
  const [frequency, setFrequency] = useState<RecurringFrequency>(rule?.frequency ?? "monthly");
  const [dayOfMonth, setDayOfMonth] = useState<number>(rule?.dayOfMonth ?? 1);
  const [weekday, setWeekday] = useState<number>(rule?.weekday ?? 1);
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const valid = amount != null && amount > 0 && categoryId != null;

  async function save() {
    if (!valid) return;
    setBusy(true);
    try {
      const payload = {
        name: name || null,
        amount: amount!,
        categoryId: categoryId!,
        frequency,
        dayOfMonth: frequency === "monthly" ? dayOfMonth : undefined,
        weekday: frequency === "weekly" ? weekday : undefined,
      };
      if (rule) await updateRecurringRule(rule.id, payload);
      else await addRecurringRule(payload);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!rule) return;
    setBusy(true);
    try {
      await deleteRecurringRule(rule.id);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open onClose={onClose} title={isEdit ? "Edit recurring expense" : "New recurring expense"}>
      <div className="space-y-4">
        <CurrencyInput label="Amount" value={amount} onChange={setAmount} autoFocus={!isEdit} />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Category</label>
          <CategorySelect value={categoryId} onChange={setCategoryId} />
        </div>

        <TextField
          label="Name (optional)"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Netflix, Rent"
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Repeats</label>
          <div className="grid grid-cols-3 gap-2">
            {FREQUENCIES.map(([value, label]) => {
              const active = frequency === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFrequency(value)}
                  aria-pressed={active}
                  className={`h-11 rounded-card border text-sm transition-colors ${
                    active
                      ? "border-primary bg-primary-soft text-primary-dark font-medium"
                      : "border-border text-muted"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {frequency === "monthly" && (
          <Dropdown
            label="Day of month"
            value={dayOfMonth}
            onChange={setDayOfMonth}
            placement="up"
            options={Array.from({ length: 28 }, (_, i) => ({ value: i + 1, label: `Day ${i + 1}` }))}
          />
        )}
        {frequency === "weekly" && (
          <Dropdown label="Day of week" value={weekday} onChange={setWeekday} placement="up" options={WEEKDAYS} />
        )}
        {frequency === "cycle" && (
          <p className="text-sm text-muted">
            Adds automatically on your cycle start day, each cycle. Change the day in Settings.
          </p>
        )}

        <Button onClick={save} loading={busy} disabled={!valid}>
          {isEdit ? "Save changes" : "Add recurring expense"}
        </Button>

        {isEdit && (
          <button
            onClick={() => setConfirmDel(true)}
            disabled={busy}
            className="w-full h-12 text-danger font-medium"
          >
            Delete recurring expense
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmDel}
        title="Delete recurring expense"
        message="It will stop adding future expenses. Expenses already created stay untouched."
        confirmLabel="Delete"
        busy={busy}
        onConfirm={remove}
        onCancel={() => setConfirmDel(false)}
      />
    </Sheet>
  );
}
