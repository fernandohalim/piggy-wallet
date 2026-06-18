"use client";
import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({
  label,
  error,
  className = "",
  id,
  name,
  ...rest
}: Props) {
  const inputId = id || name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={`w-full h-12 px-4 rounded-card bg-surface border ${
          error ? "border-danger" : "border-border"
        } text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
        {...rest}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
