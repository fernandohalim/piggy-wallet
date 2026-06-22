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
import { SIMPLE_BUDGET_CATEGORIES, type CategoryId } from "@/lib/types";
import { BudgetCard } from "@/components/budgets/BudgetCard";
import { BudgetEditor } from "@/components/budgets/BudgetEditor";
import { FoodMeter } from "@/components/budgets/FoodMeter";
import { FoodBudgetEditor } from "@/components/budgets/FoodBudgetEditor";

export default function BudgetsPage() {
  const [nowMs] = useState(() => Date.now());
  const [editing, setEditing] = useState<CategoryId | null>(null);
  const [foodOpen, setFoodOpen] = useState(false);

  const data = useLiveQuery(async () => {
    console.log("[budgets] query START");
    const settings = await getSettings();
    console.log("[budgets] settings:", settings);
    const { start, end } = currentCycle(settings.cycleStartDay, nowMs);
    console.log("[budgets] cycle:", start, end, new Date(start), new Date(end));

    const [expenses, budgets, foodBudget] = await Promise.all([
      listExpenses(),
      listSimpleBudgets(),
      getFoodBudget(),
    ]);
    console.log(
      "[budgets] loaded:",
      expenses.length,
      budgets.length,
      "food:",
      foodBudget,
    );

    const spent = new Map<CategoryId, number>();
    for (const e of expenses) {
      if (e.occurredAt >= start && e.occurredAt < end) {
        spent.set(e.categoryId, (spent.get(e.categoryId) ?? 0) + e.amount);
      }
    }
    const caps = new Map<CategoryId, number>();
    for (const b of budgets) caps.set(b.categoryId, b.monthlyAmount);

    const foodExpenses = expenses.filter((e) => e.categoryId === "food");
    let meter = null;
    try {
      meter = foodBudget
        ? computeFoodMeter(
            foodBudget,
            settings.cycleStartDay,
            foodExpenses,
            nowMs,
          )
        : null;
    } catch (e) {
      console.error("[budgets] computeFoodMeter THREW:", e);
    }
    console.log("[budgets] query DONE, meter:", meter);

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

  return (
    <main className="min-h-dvh max-w-md sm:max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-24 space-y-4">
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
          className="w-full text-left rounded-card bg-surface border border-dashed border-border p-4 flex items-center justify-between"
        >
          <span className="flex items-center gap-2 font-medium">
            <span className="text-xl">🍜</span> Food &amp; Drinks
          </span>
          <span className="text-sm text-primary">Set daily budget</span>
        </button>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {SIMPLE_BUDGET_CATEGORIES.map((c) => (
          <BudgetCard
            key={c.id}
            categoryId={c.id}
            cap={data.caps.get(c.id) ?? null}
            spent={data.spent.get(c.id) ?? 0}
            onEdit={() => setEditing(c.id)}
          />
        ))}
      </div>
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
