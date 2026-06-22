"use client";
import { useEffect, useRef, useState } from "react";

type Option<T> = { value: T; label: string };

export function Dropdown<T extends string | number>({
  value,
  options,
  onChange,
  label,
  placement = "down",
}: {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  label?: string;
  placement?: "down" | "up";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

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
    <div className="space-y-1.5" ref={ref}>
      {label && (
        <label className="block text-sm font-medium text-ink">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full h-12 px-4 rounded-card bg-surface border border-border text-ink text-left flex items-center justify-between"
        >
          <span>{selected?.label ?? "Select…"}</span>
          <span
            className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>
        {open && (
          <div
            className={`absolute z-50 w-full max-h-64 overflow-y-auto rounded-card bg-surface border border-border shadow-pop py-1 ${
              placement === "up" ? "bottom-full mb-1" : "mt-1"
            }`}
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={String(o.value)}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm ${
                    active
                      ? "bg-primary-soft text-primary-dark font-medium"
                      : "text-ink hover:bg-background"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
