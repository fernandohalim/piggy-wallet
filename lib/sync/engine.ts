import { collection, doc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
import { db as firestore } from "@/lib/firebase";
import { onOutbox } from "@/lib/db/events";
import { applyRemote, clearOutboxItem, getOutbox, readForSync } from "@/lib/db/repository";
import type { SyncStore } from "@/lib/db/database";
import type { Expense, SimpleBudget, FoodBudget, Settings } from "@/lib/types";

let unsubscribers: Unsubscribe[] = [];
let currentUid: string | null = null;
let flushing = false;

function refFor(uid: string, store: SyncStore, docId: string) {
  switch (store) {
    case "expenses": return doc(firestore, "users", uid, "expenses", docId);
    case "simpleBudgets": return doc(firestore, "users", uid, "simpleBudgets", docId);
    case "foodBudget": return doc(firestore, "users", uid, "meta", "foodBudget");
    case "settings": return doc(firestore, "users", uid, "meta", "settings");
  }
}

export async function flushOutbox() {
  if (!currentUid || flushing || !navigator.onLine) return;
  flushing = true;
  try {
    for (const item of await getOutbox()) {
      const data = await readForSync(item.store, item.docId);
      if (!data) { await clearOutboxItem(item.key); continue; }
      await setDoc(refFor(currentUid, item.store, item.docId), data, { merge: true });
      await clearOutboxItem(item.key);
    }
  } catch (err) {
    console.warn("[sync] flush failed, will retry", err); // items stay queued
  } finally {
    flushing = false;
  }
}

export function startSync(uid: string) {
  if (currentUid === uid) return;
  stopSync();
  currentUid = uid;

  unsubscribers.push(
    onSnapshot(collection(firestore, "users", uid, "expenses"), (snap) =>
      snap.docChanges().forEach((c) => c.type !== "removed" && applyRemote("expenses", c.doc.data() as Expense)),
    ),
    onSnapshot(collection(firestore, "users", uid, "simpleBudgets"), (snap) =>
      snap.docChanges().forEach((c) => c.type !== "removed" && applyRemote("simpleBudgets", c.doc.data() as SimpleBudget)),
    ),
    onSnapshot(collection(firestore, "users", uid, "meta"), (snap) =>
      snap.docChanges().forEach((c) => {
        if (c.type === "removed") return;
        if (c.doc.id === "foodBudget") applyRemote("foodBudget", c.doc.data() as FoodBudget);
        else if (c.doc.id === "settings") applyRemote("settings", c.doc.data() as Settings);
      }),
    ),
    onOutbox(flushOutbox),
  );

  flushOutbox();
  window.addEventListener("online", flushOutbox);
}

export function stopSync() {
  unsubscribers.forEach((u) => u());
  unsubscribers = [];
  window.removeEventListener("online", flushOutbox);
  currentUid = null;
}