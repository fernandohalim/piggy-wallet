import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Expense, SimpleBudget, FoodBudget, Settings, RecurringRule } from "@/lib/types";

export type SyncStore = "expenses" | "simpleBudgets" | "foodBudget" | "settings" | "recurringRules";

export interface OutboxItem {
  key: string;     // `${store}/${docId}` — collapses repeated edits to one entry
  store: SyncStore;
  docId: string;
  queuedAt: number;
}

interface PiggyDB extends DBSchema {
  expenses: {
    key: string;
    value: Expense;
    indexes: { byOccurredAt: number; byCategory: string; byUpdatedAt: number };
  };
  simpleBudgets: { key: string; value: SimpleBudget };
  foodBudget: { key: string; value: FoodBudget };
  settings: { key: string; value: Settings };
  recurringRules: { key: string; value: RecurringRule };
  outbox: { key: string; value: OutboxItem };
}

let dbPromise: Promise<IDBPDatabase<PiggyDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<PiggyDB>("piggy-wallet", 2, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          const expenses = db.createObjectStore("expenses", { keyPath: "id" });
          expenses.createIndex("byOccurredAt", "occurredAt");
          expenses.createIndex("byCategory", "categoryId");
          expenses.createIndex("byUpdatedAt", "updatedAt");
          db.createObjectStore("simpleBudgets", { keyPath: "categoryId" });
          db.createObjectStore("foodBudget", { keyPath: "id" });
          db.createObjectStore("settings", { keyPath: "id" });
          db.createObjectStore("outbox", { keyPath: "key" });
        }
        if (oldVersion < 2) {
          db.createObjectStore("recurringRules", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}