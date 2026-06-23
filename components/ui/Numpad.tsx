"use client";
import { useEffect } from "react";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "back"];

export function Numpad({
  onKey,
  onClose,
}: {
  onKey: (k: string) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-background border-t border-border rounded-t-3xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-pop animate-slide-up">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-border" />
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onKey(k)}
              className="h-14 rounded-card bg-surface border border-border text-xl font-semibold text-ink active:scale-95 transition-transform grid place-items-center"
            >
              {k === "back" ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6H9L3 12l6 6h11a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" />
                  <path d="M15 9.5l-4 5M11 9.5l4 5" />
                </svg>
              ) : (
                k
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full h-12 rounded-card bg-primary text-white font-semibold"
        >
          Done
        </button>
      </div>
    </div>
  );
}
