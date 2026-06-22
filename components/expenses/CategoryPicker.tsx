"use client";
import { CATEGORIES, type CategoryId } from "@/lib/types";

export function CategoryPicker({
  value,
  onChange,
}: {
  value: CategoryId | null;
  onChange: (c: CategoryId) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {CATEGORIES.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            className={`flex flex-col items-center gap-1 py-3 rounded-card border text-xs transition-all ${
              active
                ? "border-primary bg-primary-soft text-primary-dark shadow-card scale-[1.03]"
                : "border-border bg-surface text-muted hover:border-primary/40"
            }`}
          >
            <span className="text-xl">{c.icon}</span>
            <span className="leading-tight text-center">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
