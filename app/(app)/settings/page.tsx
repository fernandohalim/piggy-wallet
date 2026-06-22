"use client";
import { useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, updateSettings } from "@/lib/db/repository";
import { useAuth } from "@/components/auth/AuthProvider";
import { logOut } from "@/lib/auth";
import { currentCycle, cycleLabel } from "@/lib/budget";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";

export default function SettingsPage() {
  const { user } = useAuth();
  const [nowMs] = useState(() => Date.now());
  const settings = useLiveQuery(() => getSettings(), []);

  if (!settings) return null;
  const { start, end } = currentCycle(settings.cycleStartDay, nowMs);

  return (
    <main className="min-h-dvh max-w-md sm:max-w-lg mx-auto px-5 pt-6 sm:pt-10 pb-24 ...">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="rounded-card bg-surface border border-border p-4 space-y-3">
        <div>
          <h2 className="font-medium">Budget cycle start day</h2>
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
          Current cycle: {cycleLabel(start, end)}
        </p>
      </section>

      <section className="rounded-card bg-surface border border-border p-4 space-y-1">
        <h2 className="font-medium">Account</h2>
        <p className="text-sm text-muted">{user?.email}</p>
      </section>

      <Button variant="outline" onClick={() => logOut()}>
        Log out
      </Button>
    </main>
  );
}
