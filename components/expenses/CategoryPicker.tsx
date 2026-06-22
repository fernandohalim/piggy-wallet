"use client";
import { CATEGORIES, type CategoryId } from "@/lib/types";
import { CategoryIcon, categoryColor } from "@/components/ui/Icons";

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
        const color = categoryColor(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(c.id)}
            style={
              active
                ? { borderColor: color, backgroundColor: `${color}14` }
                : undefined
            }
            className={`flex flex-col items-center gap-1.5 py-3 rounded-card border text-[11px] font-medium transition-all ${
              active
                ? "shadow-card scale-[1.03]"
                : "border-border bg-surface hover:border-primary/30"
            }`}
          >
            <span
              className="grid place-items-center h-9 w-9 rounded-full"
              style={{ backgroundColor: `${color}1A`, color }}
            >
              <CategoryIcon id={c.id} className="h-5 w-5" />
            </span>
            <span
              className={`leading-tight text-center ${active ? "" : "text-muted"}`}
              style={active ? { color } : undefined}
            >
              {c.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
