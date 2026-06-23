"use client";
import { useState } from "react";
import { removeSimpleBudget, setSimpleBudget } from "@/lib/db/repository";
import { Sheet } from "@/components/ui/Sheet";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Button } from "@/components/ui/Button";
import { categoryLabel, type CategoryId } from "@/lib/types";
import { ConfirmDialog } from "../ui/ConfirmDialog";

export function BudgetEditor({
  categoryId,
  currentCap,
  onClose,
}: {
  categoryId: CategoryId | null;
  currentCap: number | null;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState<number | null>(currentCap);
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  if (!categoryId) return null;
  const cat = categoryId;

  async function save() {
    if (amount == null || amount <= 0) return;
    setBusy(true);
    try {
      await setSimpleBudget(cat, amount);
      onClose();
    } finally {
      setBusy(false);
    }
  }
  async function clear() {
    setBusy(true);
    try {
      await removeSimpleBudget(cat);
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open onClose={onClose} title={`${categoryLabel(cat)} budget`}>
      <div className="space-y-4">
        <CurrencyInput
          label="Monthly budget"
          value={amount}
          onChange={setAmount}
          autoFocus
        />
        <Button
          onClick={save}
          loading={busy}
          disabled={amount == null || amount <= 0}
        >
          Save budget
        </Button>
        {currentCap != null && (
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
        title={`Remove ${categoryLabel(cat)} budget`}
        message="This budget will be removed. Your expenses stay untouched."
        confirmLabel="Remove"
        busy={busy}
        onConfirm={clear}
        onCancel={() => setConfirmDel(false)}
      />
    </Sheet>
  );
}
