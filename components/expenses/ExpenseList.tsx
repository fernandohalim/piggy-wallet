"use client";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { listExpenses } from "@/lib/db/repository";
import { dayKey, dayLabel, timeInputValue } from "@/lib/date";
import { categoryIcon, categoryLabel, type Expense } from "@/lib/types";
import { formatIDR } from "@/lib/format";

export function ExpenseList({ onEdit }: { onEdit: (e: Expense) => void }) {
  const expenses = useLiveQuery(() => listExpenses(), []) ?? [];

  if (expenses.length === 0) {
    return (
      <p className="text-center text-muted py-16">
        No expenses yet.
        <br />
        Tap “Add expense” to log your first one.
      </p>
    );
  }

  const groups: {
    key: string;
    label: string;
    items: Expense[];
    total: number;
  }[] = [];
  for (const e of expenses) {
    const k = dayKey(e.occurredAt);
    let g = groups.find((x) => x.key === k);
    if (!g) {
      g = { key: k, label: dayLabel(e.occurredAt), items: [], total: 0 };
      groups.push(g);
    }
    g.items.push(e);
    g.total += e.amount;
  }

  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <div key={g.key} className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium text-muted">{g.label}</span>
            <span className="text-sm text-muted">{formatIDR(g.total)}</span>
          </div>
          {g.items.map((e) => (
            <button
              key={e.id}
              onClick={() => onEdit(e)}
              className="w-full flex items-center gap-3 rounded-card bg-surface border border-border px-4 py-3 text-left"
            >
              <span className="text-xl">{categoryIcon(e.categoryId)}</span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium truncate">
                  {e.name ?? categoryLabel(e.categoryId)}
                </span>
                <span className="block text-xs text-muted">
                  {e.name ? `${categoryLabel(e.categoryId)} · ` : ""}
                  {timeInputValue(e.occurredAt)}
                </span>
              </span>
              <span className="font-medium">{formatIDR(e.amount)}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
