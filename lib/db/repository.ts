import { getDB, type SyncStore } from "./database";
import { emitChange, emitOutbox } from "./events";
import type { CategoryId, Expense, FoodBudget, Settings, SimpleBudget, SplitMode } from "@/lib/types";

const now = () => Date.now();
const uuid = () => crypto.randomUUID();

async function enqueue(store: SyncStore, docId: string) {
  const db = await getDB();
  await db.put("outbox", { key: `${store}/${docId}`, store, docId, queuedAt: now() });
  emitOutbox();
}

// ---------- Expenses ----------
export async function listExpenses(): Promise<Expense[]> {
  const db = await getDB();
  return (await db.getAll("expenses"))
    .filter((e) => !e.deleted)
    .sort((a, b) => b.occurredAt - a.occurredAt);
}

export async function addExpense(input: {
  name?: string | null;
  amount: number;
  categoryId: CategoryId;
  occurredAt?: number;
}): Promise<Expense> {
  const db = await getDB();
  const ts = now();
  const expense: Expense = {
    id: uuid(),
    name: input.name?.trim() ? input.name.trim() : null,
    amount: Math.round(input.amount),
    categoryId: input.categoryId,
    occurredAt: input.occurredAt ?? ts,
    createdAt: ts,
    updatedAt: ts,
    deleted: false,
  };
  await db.put("expenses", expense);
  await enqueue("expenses", expense.id);
  emitChange();
  return expense;
}

export async function updateExpense(
  id: string,
  patch: Partial<Pick<Expense, "name" | "amount" | "categoryId" | "occurredAt">>,
) {
  const db = await getDB();
  const existing = await db.get("expenses", id);
  if (!existing) return;
  const updated: Expense = {
    ...existing,
    ...patch,
    name: patch.name !== undefined ? (patch.name?.trim() ? patch.name.trim() : null) : existing.name,
    amount: patch.amount !== undefined ? Math.round(patch.amount) : existing.amount,
    updatedAt: now(),
  };
  await db.put("expenses", updated);
  await enqueue("expenses", id);
  emitChange();
}

export async function deleteExpense(id: string) {
  const db = await getDB();
  const existing = await db.get("expenses", id);
  if (!existing) return;
  await db.put("expenses", { ...existing, deleted: true, updatedAt: now() });
  await enqueue("expenses", id);
  emitChange();
}

// ---------- Simple budgets ----------
export async function listSimpleBudgets(): Promise<SimpleBudget[]> {
  const db = await getDB();
  return (await db.getAll("simpleBudgets")).filter((b) => !b.deleted);
}
export async function setSimpleBudget(categoryId: CategoryId, monthlyAmount: number) {
  const db = await getDB();
  await db.put("simpleBudgets", { categoryId, monthlyAmount: Math.round(monthlyAmount), updatedAt: now(), deleted: false });
  await enqueue("simpleBudgets", categoryId);
  emitChange();
}
export async function removeSimpleBudget(categoryId: CategoryId) {
  const db = await getDB();
  const existing = await db.get("simpleBudgets", categoryId);
  if (!existing) return;
  await db.put("simpleBudgets", { ...existing, deleted: true, updatedAt: now() });
  await enqueue("simpleBudgets", categoryId);
  emitChange();
}

// ---------- Food budget (singleton) ----------
export async function getFoodBudget(): Promise<FoodBudget | undefined> {
  const db = await getDB();
  const fb = await db.get("foodBudget", "foodBudget");
  return fb && !fb.deleted ? fb : undefined;
}

export async function setFoodBudget(input: {
  splitMode: SplitMode;
  weekdayAmount: number;
  weekendAmount: number;
}) {
  const db = await getDB();
  await db.put("foodBudget", {
    id: "foodBudget",
    splitMode: input.splitMode,
    weekdayAmount: Math.round(input.weekdayAmount),
    weekendAmount: Math.round(input.weekendAmount),
    updatedAt: now(),
    deleted: false,
  });
  await enqueue("foodBudget", "foodBudget");
  emitChange();
}

export async function removeFoodBudget() {
  const db = await getDB();
  const existing = await db.get("foodBudget", "foodBudget");
  if (!existing) return;
  await db.put("foodBudget", { ...existing, deleted: true, updatedAt: now() });
  await enqueue("foodBudget", "foodBudget");
  emitChange();
}

// ---------- Settings (singleton, seeded on first read) ----------
export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  let s = await db.get("settings", "settings");
  if (!s) {
    s = { id: "settings", cycleStartDay: 1, updatedAt: 0, deleted: false };
    await db.put("settings", s);
  }
  return s;
}

export async function updateSettings(patch: Partial<Pick<Settings, "cycleStartDay">>) {
  const db = await getDB();
  const current = await getSettings();
  await db.put("settings", { ...current, ...patch, updatedAt: now() });
  await enqueue("settings", "settings");
  emitChange();
}

// ---------- Sync-engine-only helpers ----------
type RemoteDoc = Expense | SimpleBudget | FoodBudget | Settings;

export async function applyRemote(store: SyncStore, doc: RemoteDoc) {
  const db = await getDB();
  const isNewer = (existing: { updatedAt: number } | undefined) =>
    !existing || existing.updatedAt < doc.updatedAt; // LWW

  switch (store) {
    case "expenses": {
      const d = doc as Expense;
      if (isNewer(await db.get("expenses", d.id))) { await db.put("expenses", d); emitChange(); }
      break;
    }
    case "simpleBudgets": {
      const d = doc as SimpleBudget;
      if (isNewer(await db.get("simpleBudgets", d.categoryId))) { await db.put("simpleBudgets", d); emitChange(); }
      break;
    }
    case "foodBudget": {
      const d = doc as FoodBudget;
      if (isNewer(await db.get("foodBudget", "foodBudget"))) { await db.put("foodBudget", d); emitChange(); }
      break;
    }
    case "settings": {
      const d = doc as Settings;
      if (isNewer(await db.get("settings", "settings"))) { await db.put("settings", d); emitChange(); }
      break;
    }
  }
}

export async function getOutbox() {
  return (await getDB()).getAll("outbox");
}
export async function clearOutboxItem(key: string) {
  await (await getDB()).delete("outbox", key);
}
export async function readForSync(store: SyncStore, docId: string): Promise<RemoteDoc | undefined> {
  const db = await getDB();
  switch (store) {
    case "expenses": return db.get("expenses", docId);
    case "simpleBudgets": return db.get("simpleBudgets", docId);
    case "foodBudget": return db.get("foodBudget", "foodBudget");
    case "settings": return db.get("settings", "settings");
  }
}

