"use client";

type Props = {
  value: number | null;
  onChange: (v: number | null) => void;
  label?: string;
  autoFocus?: boolean;
};

export function CurrencyInput({ value, onChange, label, autoFocus }: Props) {
  const display =
    value != null ? new Intl.NumberFormat("id-ID").format(value) : "";

  function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    onChange(digits ? Number(digits) : null);
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-ink">{label}</label>
      )}
      <div className="flex items-center h-14 px-4 rounded-card bg-surface border border-border focus-within:ring-2 focus-within:ring-primary/40">
        <span className="text-muted mr-2">Rp</span>
        <input
          inputMode="numeric"
          autoFocus={autoFocus}
          value={display}
          onChange={handle}
          placeholder="0"
          className="flex-1 bg-transparent text-lg font-medium text-ink outline-none"
        />
      </div>
    </div>
  );
}
