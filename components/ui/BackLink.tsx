import Link from "next/link";

// Shared "back to Settings" affordance used by sub-pages (recurring, changelog).
export function BackLink({
  href = "/settings",
  label = "Settings",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </Link>
  );
}
