"use client";
import { useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, updateSettings } from "@/lib/db/repository";
import { useAuth } from "@/components/auth/AuthProvider";
import { logOut } from "@/lib/auth";
import { currentCycle, cycleLabel } from "@/lib/budget";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { InfoIcon, PiggyIcon } from "@/components/ui/Icons";
import { AboutModal } from "@/components/about/AboutModal";

export default function SettingsPage() {
  const { user } = useAuth();
  const [nowMs] = useState(() => Date.now());
  const [aboutOpen, setAboutOpen] = useState(false);
  const settings = useLiveQuery(() => getSettings(), []);

  if (!settings) return null;
  const { start, end } = currentCycle(settings.cycleStartDay, nowMs);

  const name = user?.displayName ?? user?.email?.split("@")[0] ?? "there";
  const initial = name.charAt(0).toUpperCase();

  return (
    <main className="min-h-dvh max-w-md sm:max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-28 space-y-4">
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
          <span className="font-semibold">Budget cycle start day</span>
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

      <section className="rounded-card bg-surface border border-border shadow-card p-4">
        <button
          type="button"
          role="switch"
          aria-checked={settings.foodRollover}
          onClick={() =>
            updateSettings({ foodRollover: !settings.foodRollover })
          }
          className="w-full flex items-center justify-between gap-4 text-left"
        >
          <span className="min-w-0">
            <span className="block font-semibold">Roll over food budget</span>
            <span className="block text-sm text-muted">
              Carry unspent food allowance from earlier days into today. Turn
              off to give each day its own fixed allowance.
            </span>
          </span>
          <span
            className={`relative shrink-0 h-7 w-12 rounded-full transition-colors ${
              settings.foodRollover ? "bg-primary" : "bg-border"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                settings.foodRollover ? "translate-x-5" : ""
              }`}
            />
          </span>
        </button>
      </section>

      <button
        onClick={() => setAboutOpen(true)}
        className="w-full flex items-center justify-between rounded-card bg-surface border border-border shadow-card p-4 transition-transform active:scale-[0.99]"
      >
        <span className="flex items-center gap-3 font-medium">
          <span className="grid place-items-center h-9 w-9 rounded-full bg-primary-soft text-primary-dark">
            <InfoIcon className="h-5 w-5" />
          </span>
          About Piggy Wallet
        </span>
        <svg
          className="h-4 w-4 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      <Button variant="outline" onClick={() => logOut()}>
        Log out
      </Button>

      <p className="text-center text-xs text-muted pt-2">
        Piggy Wallet · offline-first
      </p>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
  );
}
