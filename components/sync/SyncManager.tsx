"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { startSync, stopSync } from "@/lib/sync/engine";
import { runRecurring } from "@/lib/sync/recurringEngine";
import { getSettings } from "@/lib/db/repository";

export function SyncManager() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    getSettings(); // seeds cycleStartDay = 1 on first run
    startSync(user.uid);
    runRecurring(); // back-fill any due recurring expenses on open

    const tick = () => runRecurring();
    window.addEventListener("focus", tick);
    window.addEventListener("online", tick);
    return () => {
      stopSync();
      window.removeEventListener("focus", tick);
      window.removeEventListener("online", tick);
    };
  }, [user]);
  return null;
}
