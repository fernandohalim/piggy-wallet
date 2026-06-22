"use client";
import { useState } from "react";
import { useOnline } from "@/lib/hooks/useOnline";
import { Sheet } from "@/components/ui/Sheet";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import type { Expense } from "@/lib/types";
import { HomeSummary } from "@/components/home/HomeSummary";

export default function HomePage() {
  const online = useOnline();
  const [editing, setEditing] = useState<Expense | null>(null);

  return (
    <main className="min-h-dvh max-w-md sm:max-w-lg mx-auto px-5 pt-6 sm:pt-10 pb-24 ...">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🐷</span>
          <h1 className="text-2xl font-semibold">Piggy Wallet</h1>
        </div>
        {!online && (
          <span className="text-xs px-2 py-1 rounded-full bg-accent/20 text-ink">
            Offline
          </span>
        )}
      </header>

      <HomeSummary />
      <ExpenseList onEdit={setEditing} />

      <Sheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit expense"
      >
        {editing && (
          <ExpenseForm expense={editing} onDone={() => setEditing(null)} />
        )}
      </Sheet>
    </main>
  );
}
