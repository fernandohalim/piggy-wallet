"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { startSync, stopSync } from "@/lib/sync/engine";
import { getSettings } from "@/lib/db/repository";

export function SyncManager() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    getSettings(); // seeds cycleStartDay = 1 on first run
    startSync(user.uid);
    return () => stopSync();
  }, [user]);
  return null;
}
