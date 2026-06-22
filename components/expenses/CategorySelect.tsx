"use client";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, type CategoryId } from "@/lib/types";
import { CategoryIcon, categoryColor } from "@/components/ui/Icons";

function Swatch({ id }: { id: CategoryId }) {
  return (
    <span
      className="grid place-items-center h-8 w-8 shrink-0 rounded-full"
      style={{
        backgroundColor: `${categoryColor(id)}1A`,
        color: categoryColor(id),
      }}
    >
      <CategoryIcon id={id} className="h-4 w-4" />
    </span>
  );
}

export function CategorySelect({
  value,
  onChange,
}: {
  value: CategoryId | null;
  onChange: (c: CategoryId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = CATEGORIES.find((c) => c.id === value) ?? null;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-12 px-3 rounded-card bg-surface border border-border text-ink text-left flex items-center gap-2.5"
      >
        {selected ? (
          <>
            <Swatch id={selected.id} />
            <span className="flex-1 truncate font-medium">
              {selected.label}
            </span>
          </>
        ) : (
          <span className="flex-1 text-muted px-1">Pick a category</span>
        )}
        <span
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute z-50 w-full max-h-72 overflow-y-auto rounded-card bg-surface border border-border shadow-pop p-1 mt-1">
          {CATEGORIES.map((c) => {
            const active = c.id === value;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(c.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl text-left transition-colors ${
                  active ? "bg-primary-soft" : "hover:bg-background"
                }`}
              >
                <Swatch id={c.id} />
                <span
                  className={`flex-1 truncate text-sm ${active ? "font-semibold text-primary-dark" : ""}`}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
