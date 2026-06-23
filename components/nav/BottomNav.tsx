"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import {
  HomeIcon,
  ReceiptIcon,
  TargetIcon,
  SettingsIcon,
} from "@/components/ui/Icons";

const LEFT = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/expenses", label: "Expenses", Icon: ReceiptIcon },
];
const RIGHT = [
  { href: "/budgets", label: "Budgets", Icon: TargetIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const [adding, setAdding] = useState(false);

  const Tab = (t: { href: string; label: string; Icon: typeof HomeIcon }) => {
    const active = pathname === t.href;
    return (
      <Link
        key={t.href}
        href={t.href}
        aria-current={active ? "page" : undefined}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
      >
        <span
          className={`flex items-center justify-center h-8 w-12 rounded-full transition-all ${
            active
              ? "bg-primary-soft text-primary-dark scale-105"
              : "text-muted"
          }`}
        >
          <t.Icon className="h-5 w-5" />
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
      <nav
        data-bottom-nav
        className="fixed inset-x-0 bottom-0 z-40 pointer-events-none lg:hidden"
      >
        <div className="mx-auto max-w-md sm:max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-auto relative flex items-stretch rounded-3xl border border-border bg-surface/95 shadow-card backdrop-blur-xl overflow-visible">
            <div className="flex flex-1">{LEFT.map(Tab)}</div>
            <div className="relative flex shrink-0 w-14">
              <button
                onClick={() => setAdding(true)}
                aria-label="Add expense"
                className="absolute left-1/2 -top-6 -translate-x-1/2 grid place-items-center h-14 w-14 rounded-full bg-gradient-to-b from-primary to-primary-dark text-white shadow-pop ring-4 ring-surface transition-transform active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>

            <div className="flex flex-1">{RIGHT.map(Tab)}</div>
          </div>
        </div>
      </nav>

      <Sheet
        open={adding}
        onClose={() => setAdding(false)}
        title="Add expense"
        variant="entry"
      >
        <ExpenseForm onDone={() => setAdding(false)} />
      </Sheet>
    </>
  );
}
