"use client";
import Link from "next/link";
import { useOnline } from "@/lib/hooks/useOnline";
import { HomeSummary } from "@/components/home/HomeSummary";
import { SpendingDonut } from "@/components/home/SpendingDonut";
import { SpendingHeatmap } from "@/components/home/SpendingHeatmap";
import { useAuth } from "@/components/auth/AuthProvider";

export default function HomePage() {
  const online = useOnline();

  const { user } = useAuth();
  const raw =
    user?.displayName?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";
  const name = raw.charAt(0).toUpperCase() + raw.slice(1);

  return (
    <main className="min-h-dvh max-w-md sm:max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-28 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {name}</h1>
        {!online && (
          <span className="text-xs px-2.5 py-1 rounded-full bg-accent/20 text-ink font-medium">
            Offline
          </span>
        )}
      </header>

      <HomeSummary />
      <SpendingDonut />
      <SpendingHeatmap />

      <Link
        href="/expenses"
        className="block text-center text-sm font-medium text-primary"
      >
        View all expenses →
      </Link>
    </main>
  );
}
