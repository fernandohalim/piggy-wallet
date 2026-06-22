"use client";
import { categoryIcon, categoryLabel, type CategoryId } from "@/lib/types";
import { formatIDR } from "@/lib/format";

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
      className="w-full text-left rounded-card bg-surface border border-border p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <span className="text-xl">{categoryIcon(categoryId)}</span>
          {categoryLabel(categoryId)}
        </span>
        {hasCap ? (
          <span className="text-sm text-muted">
            {formatIDR(spent)} / {formatIDR(cap)}
          </span>
        ) : (
          <span className="text-sm text-primary">Set budget</span>
        )}
      </div>
      {hasCap && (
        <>
          <div className="h-2 rounded-full bg-border overflow-hidden">
            <div
              className={`h-full ${barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className={`text-xs ${over ? "text-danger" : "text-muted"}`}>
            {over
              ? `${formatIDR(spent - cap)} over budget`
              : `${formatIDR(cap - spent)} left`}
          </p>
        </>
      )}
    </button>
  );
}
