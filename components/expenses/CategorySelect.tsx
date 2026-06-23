"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

type Pos = {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  up: boolean;
};

export function CategorySelect({
  value,
  onChange,
}: {
  value: CategoryId | null;
  onChange: (c: CategoryId) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = CATEGORIES.find((c) => c.id === value) ?? null;

  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      const b = btnRef.current?.getBoundingClientRect();
      if (!b) return;
      const vh = window.innerHeight;
      const desired = Math.min(CATEGORIES.length * 48 + 8, 288);
      const below = vh - b.bottom - 12;
      const up = below < desired && b.top - 12 > below;
      setPos(
        up
          ? { left: b.left, width: b.width, bottom: vh - b.top + 8, up: true }
          : { left: b.left, width: b.width, top: b.bottom + 8, up: false },
      );
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
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

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
            }}
            className={`z-[80] max-h-72 overflow-y-auto no-scrollbar rounded-card bg-surface border border-border shadow-pop p-1 animate-scale-in ${
              pos.up ? "origin-bottom" : "origin-top"
            }`}
          >
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
                    active
                      ? "bg-primary-soft"
                      : "hover:bg-background active:bg-background"
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
          </div>,
          document.body,
        )}
    </>
  );
}
