"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";

const LEFT = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/expenses", label: "Expenses", icon: "🧾" },
];
const RIGHT = [
  { href: "/budgets", label: "Budgets", icon: "🎯" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [adding, setAdding] = useState(false);

  const Tab = (t: { href: string; label: string; icon: string }) => {
    const active = pathname === t.href;
    return (
      <Link
        key={t.href}
        href={t.href}
        aria-current={active ? "page" : undefined}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
      >
        <span
          className={`flex items-center justify-center h-8 w-12 rounded-full text-lg transition-all ${
            active ? "bg-primary-soft scale-105" : "grayscale opacity-60"
          }`}
        >
          {t.icon}
        </span>
        <span
          className={`text-[11px] leading-none transition-colors ${
            active
              ? "text-primary-dark font-semibold"
              : "text-muted font-medium"
          }`}
        >
          {t.label}
        </span>
      </Link>
    );
  };

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
        <div className="mx-auto max-w-md sm:max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto relative flex items-stretch rounded-3xl border border-border bg-surface/95 shadow-card backdrop-blur-xl">
            <div className="flex flex-1">{LEFT.map(Tab)}</div>
            <div className="w-16 shrink-0" aria-hidden />
            <div className="flex flex-1">{RIGHT.map(Tab)}</div>

            <button
              onClick={() => setAdding(true)}
              aria-label="Add expense"
              className="absolute left-1/2 -top-6 -translate-x-1/2 grid place-items-center h-14 w-14 rounded-full bg-gradient-to-b from-primary to-primary-dark text-white text-3xl leading-none shadow-pop ring-4 ring-surface transition-transform active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      </nav>

      <Sheet open={adding} onClose={() => setAdding(false)} title="Add expense">
        <ExpenseForm onDone={() => setAdding(false)} />
      </Sheet>
    </>
  );
}
