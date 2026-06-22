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
      <div className="rounded-card bg-surface border border-dashed border-border p-10 text-center">
        <p className="text-3xl mb-2">📝</p>
        <p className="text-muted text-sm">
          No expenses yet.
          <br />
          Tap the <span className="text-primary font-semibold">+</span> button
          to log your first one.
        </p>
      </div>
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
            <span className="text-sm font-semibold text-ink">{g.label}</span>
            <span className="text-xs font-medium text-muted bg-surface border border-border rounded-full px-2.5 py-0.5">
              {formatIDR(g.total)}
            </span>
          </div>
          {g.items.map((e) => (
            <button
              key={e.id}
              onClick={() => onEdit(e)}
              className="w-full flex items-center gap-3 rounded-card bg-surface border border-border shadow-card px-3.5 py-3 text-left transition-transform active:scale-[0.99]"
            >
              <span className="grid place-items-center h-10 w-10 shrink-0 rounded-full bg-primary-soft text-xl">
                {categoryIcon(e.categoryId)}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium truncate">
                  {e.name ?? categoryLabel(e.categoryId)}
                </span>
                <span className="block text-xs text-muted">
                  {e.name ? `${categoryLabel(e.categoryId)} · ` : ""}
                  {timeInputValue(e.occurredAt)}
                </span>
              </span>
              <span className="font-semibold tabular-nums">
                {formatIDR(e.amount)}
              </span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
