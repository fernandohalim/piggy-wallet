"use client";
import { useState } from "react";
import { addExpense, updateExpense, deleteExpense } from "@/lib/db/repository";
import { useTouchDevice } from "@/lib/hooks/useTouchDevice";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { CategorySelect } from "./CategorySelect";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { Numpad } from "@/components/ui/Numpad";
import { WhenPicker } from "../ui/WhenPicker";
import type { CategoryId, Expense } from "@/lib/types";

const fmt = (v: number | null) =>
  v != null ? new Intl.NumberFormat("id-ID").format(v) : "0";

export function ExpenseForm({
  expense,
  onDone,
}: {
  expense?: Expense;
  onDone: () => void;
}) {
  const touch = useTouchDevice();
  const [name, setName] = useState(expense?.name ?? "");
  const [amount, setAmount] = useState<number | null>(expense?.amount ?? null);
  const [categoryId, setCategoryId] = useState<CategoryId | null>(
    expense?.categoryId ?? null,
  );
  const [occurredAt, setOccurredAt] = useState<number>(
    () => expense?.occurredAt ?? Date.now(),
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const valid = amount != null && amount > 0 && categoryId != null;

  async function save() {
    if (!valid) {
      setError("Enter an amount and pick a category.");
      return;
    }
    setBusy(true);
    try {
      if (expense)
        await updateExpense(expense.id, {
          name: name || null,
          amount: amount!,
          categoryId: categoryId!,
          occurredAt,
        });
      else
        await addExpense({
          name: name || null,
          amount: amount!,
          categoryId: categoryId!,
          occurredAt,
        });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!expense) return;
    setBusy(true);
    try {
      await deleteExpense(expense.id);
      onDone();
    } finally {
      setBusy(false);
    }
  }

  function pressAmount(k: string) {
    const current = amount != null ? String(amount) : "";
    let next = k === "back" ? current.slice(0, -1) : current + k;
    next = next.replace(/^0+(?=\d)/, "");
    if (next.length > 12) return;
    const n = next ? Number(next) : 0;
    setAmount(n > 0 ? n : null);
  }

  // ---------- Touch: native-style calculator entry ----------
  if (touch) {
    return (
      <div className="flex flex-col h-full">
        <div className="shrink-0 px-5 pb-4 text-center">
          <p className="text-xs text-muted mb-0.5">Amount</p>
          <p
            className={`text-4xl font-bold tracking-tight ${amount ? "text-ink" : "text-muted"}`}
          >
            <span className="text-2xl align-middle mr-1 text-muted">Rp</span>
            {fmt(amount)}
          </p>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 space-y-2.5">
          <CategorySelect value={categoryId} onChange={setCategoryId} />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add a note (optional)"
            className="w-full h-12 px-3.5 rounded-card bg-surface border border-border text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <WhenPicker value={occurredAt} onChange={setOccurredAt} />
          {expense && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="w-full h-11 text-danger text-sm font-medium"
            >
              Delete expense
            </button>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Numpad
            onKey={pressAmount}
            onSave={save}
            saveDisabled={!valid || busy}
            saveLabel={expense ? "Update" : "Save"}
          />
        </div>
      </div>
    );
  }

  // ---------- Desktop: unchanged form ----------
  return (
    <div className="space-y-4">
      <CurrencyInput
        label="Amount"
        value={amount}
        onChange={setAmount}
        autoFocus={!expense}
      />
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Category</label>
        <CategorySelect value={categoryId} onChange={setCategoryId} />
      </div>
      <TextField
        label="Name (optional)"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Lunch with team"
      />
      <WhenPicker value={occurredAt} onChange={setOccurredAt} />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button onClick={save} loading={busy} disabled={!valid}>
        {expense ? "Save changes" : "Add expense"}
      </Button>
      {expense && (
        <button
          onClick={remove}
          disabled={busy}
          className="w-full h-12 text-danger font-medium"
        >
          Delete expense
        </button>
      )}
    </div>
  );
}
