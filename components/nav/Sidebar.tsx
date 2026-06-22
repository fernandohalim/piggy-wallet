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
  PiggyIcon,
} from "@/components/ui/Icons";

const NAV = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/expenses", label: "Expenses", Icon: ReceiptIcon },
  { href: "/budgets", label: "Budgets", Icon: TargetIcon },
  { href: "/settings", label: "Settings", Icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  const [adding, setAdding] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-60 flex-col border-r border-border bg-surface/80 backdrop-blur-xl px-4 py-6">
        <Link href="/" className="flex items-center gap-2.5 px-2 mb-8">
          <span className="grid place-items-center h-10 w-10 rounded-2xl bg-gradient-to-b from-primary to-primary-dark text-white">
            <PiggyIcon className="h-6 w-6" />
          </span>
          <span className="text-lg font-bold font-display">Piggy Wallet</span>
        </Link>

        <button
          onClick={() => setAdding(true)}
          className="flex items-center justify-center gap-2 h-12 rounded-card bg-gradient-to-b from-primary to-primary-dark text-white font-semibold shadow-pop transition-transform active:scale-[0.98] mb-6"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add expense
        </button>

        <nav className="flex flex-col gap-1">
          {NAV.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-3 h-11 rounded-card font-medium transition-colors ${
                  active
                    ? "bg-primary-soft text-primary-dark"
                    : "text-muted hover:bg-background hover:text-ink"
                }`}
              >
                <t.Icon className="h-5 w-5" />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <Sheet open={adding} onClose={() => setAdding(false)} title="Add expense">
        <ExpenseForm onDone={() => setAdding(false)} />
      </Sheet>
    </>
  );
}
