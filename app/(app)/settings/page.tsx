"use client";
import { useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, updateSettings } from "@/lib/db/repository";
import { useAuth } from "@/components/auth/AuthProvider";
import { logOut } from "@/lib/auth";
import { currentCycle, cycleLabel } from "@/lib/budget";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { PiggyIcon } from "@/components/ui/Icons";

export default function SettingsPage() {
  const { user } = useAuth();
  const [nowMs] = useState(() => Date.now());
  const settings = useLiveQuery(() => getSettings(), []);

  if (!settings) return null;
  const { start, end } = currentCycle(settings.cycleStartDay, nowMs);

  const name = user?.displayName ?? user?.email?.split("@")[0] ?? "there";
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="min-h-dvh max-w-md sm:max-w-lg mx-auto px-5 pt-6 sm:pt-10 pb-28 space-y-4">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="rounded-card bg-surface border border-border shadow-card p-4 flex items-center gap-3">
        <span className="grid place-items-center h-12 w-12 shrink-0 rounded-full bg-gradient-to-b from-primary to-primary-dark text-white text-lg font-bold">
          {initial}
        </span>
        <div className="min-w-0">
          {user?.displayName && (
            <p className="font-medium truncate">{user.displayName}</p>
          )}
          <p className="text-sm text-muted truncate">{user?.email}</p>
        </div>
      </section>

      <section className="rounded-card bg-surface border border-border shadow-card p-4 space-y-3">
        <div>
          <h2 className="font-semibold">Budget cycle start day</h2>
          <p className="text-sm text-muted">
            When your budgets reset each month. Set it to your payday if you
            like.
          </p>
        </div>
        <Dropdown
          value={settings.cycleStartDay}
          onChange={(v) => updateSettings({ cycleStartDay: v })}
          options={Array.from({ length: 28 }, (_, i) => ({
            value: i + 1,
            label: `Day ${i + 1}${i + 1 === 1 ? " (calendar month)" : ""}`,
          }))}
        />
        <p className="text-sm text-muted">
          Current cycle:{" "}
          <span className="font-medium text-ink">{cycleLabel(start, end)}</span>
        </p>
      </section>

      <Button variant="outline" onClick={() => logOut()}>
        Log out
      </Button>

      <p className="text-center text-xs text-muted pt-2">
        Piggy Wallet · offline-first
      </p>
    </main>
  );
}
