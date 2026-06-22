"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";

const LEFT = [
  { href: "/", label: "Expenses", icon: "🧾" },
  { href: "/budgets", label: "Budgets", icon: "🎯" },
];
const RIGHT = [{ href: "/settings", label: "Settings", icon: "⚙️" }];

export function BottomNav() {
  const pathname = usePathname();
  const [adding, setAdding] = useState(false);

  const Tab = (t: { href: string; label: string; icon: string }) => {
    const active = pathname === t.href;
    return (
      <Link
        key={t.href}
        href={t.href}
        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs ${active ? "text-primary" : "text-muted"}`}
      >
        <span className="text-xl">{t.icon}</span>
        {t.label}
      </Link>
    );
  };

  return (
    <>
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-border">
        <div className="max-w-md sm:max-w-lg mx-auto flex items-stretch">
          <div className="flex-1 flex">{LEFT.map(Tab)}</div>
          <div className="relative w-16 flex justify-center">
            <button
              onClick={() => setAdding(true)}
              aria-label="Add expense"
              className="absolute -top-5 w-14 h-14 rounded-full bg-primary text-white text-3xl leading-none flex items-center justify-center shadow-lg"
            >
              +
            </button>
          </div>
          <div className="flex-1 flex">{RIGHT.map(Tab)}</div>
        </div>
      </nav>

      <Sheet open={adding} onClose={() => setAdding(false)} title="Add expense">
        <ExpenseForm onDone={() => setAdding(false)} />
      </Sheet>
    </>
  );
}
