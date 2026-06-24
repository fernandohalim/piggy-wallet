export const CATEGORIES = [
  { id: "food", label: "Food & Drinks", icon: "🍜" },
  { id: "groceries", label: "Groceries", icon: "🛒" },
  { id: "transport", label: "Transportation", icon: "🚌" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "bills", label: "Bills & Rent", icon: "🧾" },
  { id: "entertainment", label: "Fun & Entertainment", icon: "🎬" },
  { id: "health", label: "Health & Care", icon: "💊" },
  { id: "other", label: "Other", icon: "📦" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const FOOD_CATEGORY: CategoryId = "food";
export const SIMPLE_BUDGET_CATEGORIES = CATEGORIES.filter((c) => c.id !== FOOD_CATEGORY);

export const categoryLabel = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;
export const categoryIcon = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)?.icon ?? "📦";

export interface Expense {
  id: string;
  name: string | null;
  amount: number;        // integer IDR
  categoryId: CategoryId;
  occurredAt: number;    // epoch ms — the date it happened (budgets use this)
  createdAt: number;     // epoch ms
  updatedAt: number;     // epoch ms — LWW key
  deleted: boolean;      // soft delete
}

export interface SimpleBudget {
  categoryId: CategoryId; // keyPath; never "food"
  monthlyAmount: number;
  updatedAt: number;
  deleted: boolean;
}

export type SplitMode = "even" | "split";

export interface FoodBudget {
  id: "foodBudget";
  splitMode: SplitMode;
  weekdayAmount: number; // daily rupiah for weekdays (and THE daily amount when "even")
  weekendAmount: number; // daily rupiah for weekends (equals weekdayAmount when "even")
  updatedAt: number;
  deleted: boolean;
}

export type FoodReset = "daily" | "weekly" | "cycle";

export interface Settings {
  id: "settings";         // singleton
  cycleStartDay: number;  // 1..28, your payroll anchor
  foodRollover: boolean;  // legacy mirror of foodReset (kept in sync for older clients)
  foodReset?: FoodReset;  // daily = fixed per day, weekly = Mon-reset, cycle = cycle-reset
  updatedAt: number;
  deleted: boolean;
}