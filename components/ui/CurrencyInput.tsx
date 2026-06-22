"use client";
import { useEffect, useState } from "react";
import { useTouchDevice } from "@/lib/hooks/useTouchDevice";
import { Numpad } from "./Numpad";

type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
  label?: string;
  autoFocus?: boolean;
};

export function CurrencyInput({ value, onChange, label, autoFocus }: Props) {
  const touch = useTouchDevice();
  const [padOpen, setPadOpen] = useState(false);
  const display =
    value != null ? new Intl.NumberFormat("id-ID").format(value) : "";

  useEffect(() => {
    if (touch && autoFocus) setPadOpen(true);
  }, [touch, autoFocus]);

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    onChange(digits ? Number(digits) : null);
  }

  function pressKey(k: string) {
    const current = value != null ? String(value) : "";
    let next: string;
    if (k === "back") next = current.slice(0, -1);
    else next = current + k; // handles "0", digits, and "000"
    next = next.replace(/^0+(?=\d)/, ""); // strip leading zeros
    if (next.length > 12) return; // sane cap (~999 billion)
    const n = next ? Number(next) : 0;
    onChange(n > 0 ? n : null);
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink">{label}</label>
      )}
      <div
        onClick={touch ? () => setPadOpen(true) : undefined}
        className={`flex items-center h-14 px-4 rounded-card bg-surface border border-border ${
          touch
            ? "cursor-pointer"
            : "focus-within:ring-2 focus-within:ring-primary/40"
        } ${padOpen ? "ring-2 ring-primary/40" : ""}`}
      >
        <span className="text-muted mr-2">Rp</span>
        {touch ? (
          <div className="flex-1 text-lg font-medium">
            {display || <span className="text-muted">0</span>}
          </div>
        ) : (
          <input
            inputMode="numeric"
            autoFocus={autoFocus}
            value={display}
            onChange={handle}
            placeholder="0"
            className="flex-1 bg-transparent text-lg font-medium text-ink outline-none"
          />
        )}
      </div>

      {touch && padOpen && (
        <Numpad onKey={pressKey} onClose={() => setPadOpen(false)} />
      )}
    </div>
  );
}
