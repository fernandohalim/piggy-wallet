"use client";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Loading";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  loading,
  children,
  className = "",
  disabled,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 h-12 px-5 w-full rounded-card font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    outline: "border border-border bg-surface text-ink hover:bg-background",
    ghost: "text-primary hover:bg-primary-soft",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
