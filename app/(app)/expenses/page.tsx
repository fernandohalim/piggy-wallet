"use client";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import type { Expense } from "@/lib/types";

export default function ExpensesPage() {
  const [editing, setEditing] = useState<Expense | null>(null);

  return (
    <main className="min-h-dvh max-w-md sm:max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-28 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Expenses</h1>
        <p className="text-sm text-muted">Every record, grouped by day.</p>
      </header>
      <ExpenseList onEdit={setEditing} />
      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit expense"
        variant="entry"
      >
        {editing && (
          <ExpenseForm expense={editing} onDone={() => setEditing(null)} />
        )}
      </Sheet>
    </main>
  );
}
