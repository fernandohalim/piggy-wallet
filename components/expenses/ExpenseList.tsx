"use client";
import { dayKey, dayLabel, timeInputValue } from "@/lib/date";
import { categoryLabel, type Expense } from "@/lib/types";
import { formatIDR } from "@/lib/format";
import {
  categoryColor,
  CategoryIcon,
  CheckIcon,
  ReceiptIcon,
  SearchIcon,
} from "../ui/Icons";

export function ExpenseList({
  expenses,
  hasAny,
  selecting,
  selectedIds,
  onToggleSelect,
  onEdit,
}: {
  expenses: Expense[];
  hasAny: boolean;
  selecting: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onEdit: (e: Expense) => void;
}) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-card bg-surface border border-dashed border-border p-10 text-center">
        {hasAny ? (
          <>
            <SearchIcon className="h-8 w-8 mx-auto mb-2 text-muted" />
            <p className="text-muted text-sm">
              No expenses match your filters.
            </p>
          </>
        ) : (
          <>
            <ReceiptIcon className="h-8 w-8 mx-auto mb-2 text-muted" />
            <p className="text-muted text-sm">
              No expenses yet.
              <br />
              Tap the <span className="text-primary font-semibold">+</span>{" "}
              button to log your first one.
            </p>
          </>
        )}
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
          {g.items.map((e) => {
            const checked = selectedIds.has(e.id);
            return (
              <button
                key={e.id}
                onClick={() => (selecting ? onToggleSelect(e.id) : onEdit(e))}
                className={`w-full flex items-center gap-3 rounded-card border px-3.5 py-3 text-left transition-transform active:scale-[0.99] ${
                  checked
                    ? "bg-primary-soft border-primary/40"
                    : "bg-surface border-border shadow-card"
                }`}
              >
                {selecting && (
                  <span
                    className={`grid place-items-center h-5 w-5 shrink-0 rounded-full border ${
                      checked
                        ? "bg-primary border-primary text-white"
                        : "border-border text-transparent"
                    }`}
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                )}
                <span
                  className="grid place-items-center h-10 w-10 shrink-0 rounded-full"
                  style={{
                    backgroundColor: `${categoryColor(e.categoryId)}1A`,
                    color: categoryColor(e.categoryId),
                  }}
                >
                  <CategoryIcon id={e.categoryId} className="h-5 w-5" />
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
            );
          })}
        </div>
      ))}
    </div>
  );
}
