"use client";
import Link from "next/link";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { listExpenses } from "@/lib/db/repository";
import { dayKey, timeInputValue } from "@/lib/date";
import { categoryLabel } from "@/lib/types";
import { formatIDR } from "@/lib/format";
import { categoryColor, CategoryIcon } from "../ui/Icons";

export function RecentTransactions() {
  const items = useLiveQuery(async () => {
    const all = await listExpenses(); // already sorted newest-first
    const todayKey = dayKey(Date.now());
    return all.filter((e) => dayKey(e.occurredAt) === todayKey).slice(0, 3);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-ink">Today’s activity</h2>
        <Link
          href="/expenses"
          className="text-xs font-medium text-muted hover:text-primary transition-colors"
        >
          See all
        </Link>
      </div>
      {items.map((e) => (
        <Link
          key={e.id}
          href="/expenses"
          className="w-full flex items-center gap-3 rounded-card bg-surface border border-border shadow-card px-3.5 py-3 text-left transition-transform active:scale-[0.99]"
        >
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
        </Link>
      ))}
    </section>
  );
}
