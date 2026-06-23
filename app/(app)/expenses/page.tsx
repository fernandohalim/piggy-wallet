"use client";
import { useEffect, useRef, useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, listExpenses, deleteExpenses } from "@/lib/db/repository";
import { currentCycle, cycleLabel } from "@/lib/budget";
import {
  filterExpenses,
  dayStart,
  type ExpenseFilter,
} from "@/lib/expenseFilter";
import { formatIDR } from "@/lib/format";
import { dayKey } from "@/lib/date";
import { TrashIcon, CategoryIcon, categoryColor } from "@/components/ui/Icons";
import { categoryLabel, type CategoryId, type Expense } from "@/lib/types";
import { printExpenseReport } from "@/lib/report";

export default function ExpensesPage() {
  const [nowMs] = useState(() => Date.now());
  const [editing, setEditing] = useState<Expense | null>(null);

  const data = useLiveQuery(async () => {
    const settings = await getSettings();
    const expenses = await listExpenses();
    return { expenses, cycleStartDay: settings.cycleStartDay };
  }, []);

  const cycleStartDay = data?.cycleStartDay ?? 1;
  const allExpenses = data?.expenses ?? [];

  const [filter, setFilter] = useState<ExpenseFilter>(() => {
    const d = new Date();
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
    return {
      period: "cycle",
      monthRef: monthStart,
      customStart: monthStart,
      customEnd: dayStart(Date.now()),
      categoryId: null,
      search: "",
    };
  });
  const patch = (p: Partial<ExpenseFilter>) =>
    setFilter((f) => ({ ...f, ...p }));

  const cycle = currentCycle(cycleStartDay, nowMs);
  const cycleRangeLabel = cycleLabel(cycle.start, cycle.end);

  const periodLabel =
    filter.period === "cycle"
      ? cycleRangeLabel
      : filter.period === "month"
        ? new Date(filter.monthRef).toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })
        : `${new Date(filter.customStart).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(filter.customEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;

  const exportReport = () =>
    printExpenseReport(filtered, {
      periodLabel,
      category: filter.categoryId
        ? categoryLabel(filter.categoryId)
        : "All categories",
      search: filter.search.trim(),
      total: periodTotal,
      count: filtered.length,
    });

  const filtered = filterExpenses(allExpenses, filter, cycleStartDay, nowMs);
  const periodTotal = filtered.reduce((sum, e) => sum + e.amount, 0);
  const insights = (() => {
    if (filtered.length === 0) return null;
    const days = new Set(filtered.map((e) => dayKey(e.occurredAt)));
    const byCat = new Map<CategoryId, number>();
    let biggest = filtered[0];
    for (const e of filtered) {
      if (e.amount > biggest.amount) biggest = e;
      byCat.set(e.categoryId, (byCat.get(e.categoryId) ?? 0) + e.amount);
    }
    let topCat: { id: CategoryId; total: number } | null = null;
    if (filter.categoryId === null) {
      for (const [id, total] of byCat)
        if (!topCat || total > topCat.total) topCat = { id, total };
    }
    return { avgPerDay: periodTotal / days.size, biggest, topCat };
  })();

  const filtersActive =
    filter.period !== "cycle" ||
    filter.categoryId !== null ||
    filter.search.trim() !== "";
  const clearFilters = () =>
    patch({ period: "cycle", categoryId: null, search: "" });

  const filterRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el = filterRef.current;
      if (el) setStuck(el.getBoundingClientRect().top <= 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---- select / bulk-delete ----
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // hide the bottom nav while selecting
  useEffect(() => {
    if (selecting) document.body.dataset.selectMode = "1";
    else delete document.body.dataset.selectMode;
    return () => {
      delete document.body.dataset.selectMode;
    };
  }, [selecting]);

  const exitSelect = () => {
    setSelecting(false);
    setSelectedIds(new Set());
  };
  const toggleSelect = (id: string) =>
    setSelectedIds((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allVisibleSelected =
    filtered.length > 0 && filtered.every((e) => selectedIds.has(e.id));
  const toggleAll = () =>
    setSelectedIds(
      allVisibleSelected ? new Set() : new Set(filtered.map((e) => e.id)),
    );

  const confirmDelete = async () => {
    setBusy(true);
    await deleteExpenses([...selectedIds]);
    setBusy(false);
    setConfirmOpen(false);
    exitSelect();
  };

  return (
    <main className="min-h-dvh max-w-md sm:max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-28 space-y-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-sm text-muted">Every record, grouped by day.</p>
        </div>
        {selecting ? (
          <button
            onClick={exitSelect}
            className="text-sm font-medium text-muted px-1 py-2"
          >
            Cancel
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={exportReport}
              disabled={filtered.length === 0}
              aria-label="Export report as PDF"
              className="grid place-items-center h-9 w-9 shrink-0 rounded-full border border-border text-muted active:scale-95 transition-transform disabled:opacity-40"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
            <button
              onClick={() => setSelecting(true)}
              aria-label="Select expenses to delete"
              className="grid place-items-center h-9 w-9 shrink-0 rounded-full border border-border text-muted active:scale-95 transition-transform"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </header>

      <div
        ref={filterRef}
        className={`sticky top-0 z-30 -mx-5 px-5 py-2 transition-colors -mt-2 ${
          stuck ? "bg-background/85 backdrop-blur-md" : ""
        }`}
      >
        <ExpenseFilters
          filter={filter}
          onChange={patch}
          cycleLabel={cycleRangeLabel}
        />
      </div>

      <div className="flex items-center justify-between px-1 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted">
            {filtered.length} {filtered.length === 1 ? "expense" : "expenses"}
          </span>
          {filtersActive && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-full bg-primary-soft text-primary-dark px-2 py-0.5 text-xs font-medium"
            >
              Clear filters ×
            </button>
          )}
        </div>
        <span className="font-semibold tabular-nums">
          {formatIDR(periodTotal)}
        </span>
      </div>

      {insights && !selecting && (
        <div
          className={`grid ${insights.topCat ? "grid-cols-3" : "grid-cols-2"} gap-2`}
        >
          {insights.topCat && (
            <div className="rounded-card bg-surface border border-border p-3 min-w-0">
              <p className="text-[11px] text-muted">Top category</p>
              <p
                className="text-sm font-semibold truncate flex items-center gap-1.5"
                style={{ color: categoryColor(insights.topCat.id) }}
              >
                <CategoryIcon
                  id={insights.topCat.id}
                  className="h-4 w-4 shrink-0"
                />
                <span className="truncate">
                  {categoryLabel(insights.topCat.id)}
                </span>
              </p>
            </div>
          )}
          <div className="rounded-card bg-surface border border-border p-3">
            <p className="text-[11px] text-muted">Avg / day</p>
            <p className="text-sm font-semibold tabular-nums">
              {formatIDR(insights.avgPerDay)}
            </p>
          </div>
          <div className="rounded-card bg-surface border border-border p-3">
            <p className="text-[11px] text-muted">Biggest</p>
            <p className="text-sm font-semibold tabular-nums">
              {formatIDR(insights.biggest.amount)}
            </p>
          </div>
        </div>
      )}

      {selecting && (
        <div className="flex items-center justify-between px-1">
          <button
            onClick={toggleAll}
            className="text-sm font-medium text-primary"
          >
            {allVisibleSelected ? "Clear all" : "Select all"}
          </button>
          <span className="text-sm text-muted">
            {selectedIds.size} selected
          </span>
        </div>
      )}

      <ExpenseList
        expenses={filtered}
        hasAny={allExpenses.length > 0}
        selecting={selecting}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onEdit={setEditing}
      />

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

      {selecting && (
        <div className="fixed inset-x-0 bottom-0 z-50 lg:left-60 bg-surface border-t border-border px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] animate-slide-up">
          <div className="mx-auto max-w-md sm:max-w-2xl flex gap-2">
            <button
              onClick={exitSelect}
              className="flex-1 h-12 rounded-card border border-border bg-surface font-medium text-ink active:scale-[0.98] transition-transform"
            >
              Cancel
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              disabled={selectedIds.size === 0}
              className="flex-1 h-12 rounded-card bg-danger text-white font-medium active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              Delete{selectedIds.size ? ` (${selectedIds.size})` : ""}
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete expenses?"
        message={`This will remove ${selectedIds.size} ${selectedIds.size === 1 ? "expense" : "expenses"}. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
        busy={busy}
      />
    </main>
  );
}
