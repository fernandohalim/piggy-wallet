"use client";
import { useState } from "react";
import { addExpense, updateExpense, deleteExpense } from "@/lib/db/repository";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { CategoryPicker } from "./CategoryPicker";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import type { CategoryId, Expense } from "@/lib/types";
import { WhenPicker } from "../ui/WhenPicker";

export function ExpenseForm({
  expense,
  onDone,
}: {
  expense?: Expense;
  onDone: () => void;
}) {
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
    if (amount == null || amount <= 0 || categoryId == null) {
      setError("Enter an amount and pick a category.");
      return;
    }
    setBusy(true);
    try {
      if (expense)
        await updateExpense(expense.id, {
          name: name || null,
          amount,
          categoryId,
          occurredAt,
        });
      else
        await addExpense({
          name: name || null,
          amount,
          categoryId,
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
        <CategoryPicker value={categoryId} onChange={setCategoryId} />
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
