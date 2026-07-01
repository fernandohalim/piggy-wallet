"use client";
import { useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import {
  getFoodBudget,
  getSettings,
  listExpenses,
  listSimpleBudgets,
} from "@/lib/db/repository";
import { currentCycle, cycleLabel } from "@/lib/budget";
import { computeFoodMeter } from "@/lib/food";
import {
  categoryLabel,
  SIMPLE_BUDGET_CATEGORIES,
  type CategoryId,
} from "@/lib/types";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetEditor } from "@/components/budgets/BudgetEditor";
import { FoodMeter } from "@/components/budgets/FoodMeter";
import { FoodBudgetEditor } from "@/components/budgets/FoodBudgetEditor";
import { categoryColor, CategoryIcon, FoodIcon } from "@/components/ui/Icons";

export default function BudgetsPage() {
  const [nowMs] = useState(() => Date.now());
  const [editing, setEditing] = useState<CategoryId | null>(null);
  const [foodOpen, setFoodOpen] = useState(false);

  const data = useLiveQuery(async () => {
    const settings = await getSettings();
    const { start, end } = currentCycle(settings.cycleStartDay, nowMs);

    const [expenses, budgets, foodBudget] = await Promise.all([
      listExpenses(),
      listSimpleBudgets(),
      getFoodBudget(),
    ]);

    const spent = new Map<CategoryId, number>();
    for (const e of expenses) {
      if (e.occurredAt >= start && e.occurredAt < end) {
        spent.set(e.categoryId, (spent.get(e.categoryId) ?? 0) + e.amount);
      }
    }
    const caps = new Map<CategoryId, number>();
    for (const b of budgets) caps.set(b.categoryId, b.monthlyAmount);

    const foodExpenses = expenses.filter((e) => e.categoryId === "food");
    const meter = foodBudget
      ? computeFoodMeter(
          foodBudget,
          settings.cycleStartDay,
          foodExpenses,
          nowMs,
          settings.foodReset ?? "cycle",
        )
      : null;

    return {
      start,
      end,
      spent,
      caps,
      foodBudget: foodBudget ?? null,
      meter,
      cycleStartDay: settings.cycleStartDay,
    };
  }, [nowMs]);

  console.log("[budgets] render, data =", data);

  if (!data) return <main className="p-6 text-muted">Loading budgets…</main>;

  const isSet = (c: { id: CategoryId }) => (data.caps.get(c.id) ?? 0) > 0;
  const setCats = SIMPLE_BUDGET_CATEGORIES.filter(isSet);
  const unsetCats = SIMPLE_BUDGET_CATEGORIES.filter((c) => !isSet(c));

  return (
    <main className="min-h-dvh max-w-md sm:max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-28 space-y-4 lg:pb-12">
      <header>
        <h1 className="text-2xl font-semibold">Budgets</h1>
        <p className="text-sm text-muted">
          Cycle: {cycleLabel(data.start, data.end)}
        </p>
      </header>
      {data.meter ? (
        <FoodMeter meter={data.meter} onEdit={() => setFoodOpen(true)} />
      ) : (
        <button
          onClick={() => setFoodOpen(true)}
          className="w-full text-left rounded-card bg-surface border border-dashed border-border p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
        >
          <span className="flex items-center gap-2.5 font-medium">
            <span className="grid place-items-center h-9 w-9 rounded-full bg-accent/15">
              <FoodIcon className="h-5 w-5 text-accent" />
            </span>
            Food &amp; Drinks
          </span>
          <span className="text-sm font-medium text-primary">
            Set daily budget
          </span>
        </button>
      )}
      {setCats.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {setCats.map((c) => (
            <BudgetCard
              key={c.id}
              categoryId={c.id}
              cap={data.caps.get(c.id) ?? null}
              spent={data.spent.get(c.id) ?? 0}
              onEdit={() => setEditing(c.id)}
            />
          ))}
        </div>
      )}

      {unsetCats.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide px-1">
            Add a budget
          </p>
          <div className="flex flex-wrap gap-2">
            {unsetCats.map((c) => (
              <button
                key={c.id}
                onClick={() => setEditing(c.id)}
                className="flex items-center gap-2 rounded-full bg-surface border border-dashed border-border px-3 py-1.5 text-sm text-muted hover:border-primary/50 hover:text-ink transition-colors"
              >
                <CategoryIcon
                  id={c.id}
                  className="h-4 w-4 shrink-0"
                  style={{ color: categoryColor(c.id) }}
                />
                {categoryLabel(c.id)}
                <span className="text-primary font-semibold leading-none">
                  +
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <BudgetEditor
        key={editing ?? "none"}
        categoryId={editing}
        currentCap={editing ? (data.caps.get(editing) ?? null) : null}
        onClose={() => setEditing(null)}
      />
      {foodOpen && (
        <FoodBudgetEditor
          key={data.foodBudget?.updatedAt ?? "new"}
          budget={data.foodBudget}
          cycleStartDay={data.cycleStartDay}
          nowMs={nowMs}
          onClose={() => setFoodOpen(false)}
        />
      )}
    </main>
  );
}
