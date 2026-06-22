"use client";
import { categoryIcon, categoryLabel, type CategoryId } from "@/lib/types";
import { formatIDR } from "@/lib/format";
import { categoryColor, CategoryIcon } from "../ui/Icons";

export function BudgetCard({
  categoryId,
  cap,
  spent,
  onEdit,
}: {
  categoryId: CategoryId;
  cap: number | null;
  spent: number;
  onEdit: () => void;
}) {
  const hasCap = cap != null && cap > 0;
  const pct = hasCap ? Math.min(100, Math.round((spent / cap) * 100)) : 0;
  const over = hasCap && spent > cap;
  const near = hasCap && !over && spent >= cap * 0.9;
  const barColor = over ? "bg-danger" : near ? "bg-accent" : "bg-primary";

  return (
    <button
      onClick={onEdit}
      className="w-full text-left rounded-card bg-surface border border-border shadow-card p-4 space-y-3 transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2.5 font-medium min-w-0">
          <span
            className="grid place-items-center h-9 w-9 shrink-0 rounded-full"
            style={{
              backgroundColor: `${categoryColor(categoryId)}1A`,
              color: categoryColor(categoryId),
            }}
          >
            <CategoryIcon id={categoryId} className="h-5 w-5" />
          </span>
          <span className="truncate">{categoryLabel(categoryId)}</span>
        </span>
        {hasCap ? (
          <span className="text-sm text-muted shrink-0 tabular-nums">
            {formatIDR(spent)} / {formatIDR(cap)}
          </span>
        ) : (
          <span className="text-sm font-medium text-primary shrink-0">
            Set budget
          </span>
        )}
      </div>
      {hasCap && (
        <>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor} transition-all`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p
            className={`text-xs ${over ? "text-danger font-medium" : "text-muted"}`}
          >
            {over
              ? `${formatIDR(spent - cap)} over budget`
              : `${formatIDR(cap - spent)} left`}
          </p>
        </>
      )}
    </button>
  );
}
