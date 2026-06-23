"use client";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/ui/Sheet";
import { PiggyIcon } from "@/components/ui/Icons";
import packageJson from "../../package.json";
import Image from "next/image";

const SOCIALS = [
  {
    href: "https://fernando-halim.vercel.app",
    label: "Website",
    hover: "hover:text-primary hover:border-primary/30",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/in/fernando-halimm",
    label: "LinkedIn",
    hover: "hover:text-sky hover:border-sky/40",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://github.com/fernandohalim",
    label: "GitHub",
    hover: "hover:text-ink hover:border-ink/30",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    href: "mailto:fernandohalim26@gmail.com",
    label: "Email",
    hover: "hover:text-accent hover:border-accent/40",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export function AboutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <Sheet open={open} onClose={onClose} title="About">
      <div className="flex flex-col items-center text-center pb-2">
        <Image
          src="/icons/icon-512.png"
          alt="Icon"
          width={100}
          height={100}
          className="mx-auto block mb-4"
        />

        <h2 className="text-2xl font-bold font-display">Piggy Wallet</h2>
        <p className="text-sm text-muted mt-0.5">
          A simple offline-first expense tracker
        </p>
        <p className="mt-3 text-[10px] font-semibold text-muted uppercase tracking-widest px-3 py-1.5 bg-surface border border-border rounded-lg">
          crafted by Fernando Halim
        </p>

        <div className="w-full mt-6 space-y-3">
          <button
            onClick={() => {
              onClose();
              router.push("/changelog");
            }}
            className="w-full flex items-center justify-between p-4 rounded-card bg-surface border border-border shadow-card hover:border-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98]"
          >
            <span className="font-semibold text-sm">What&apos;s new</span>
            <span className="flex items-center gap-2.5">
              <span className="text-[9px] font-bold uppercase tracking-widest bg-primary-soft text-primary-dark px-2.5 py-1 rounded-lg">
                v{packageJson.version}
              </span>
              <svg
                className="h-4 w-4 text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>

          <div className="flex justify-center items-center gap-3 pt-1">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                title={s.label}
                className={`grid place-items-center h-14 w-14 rounded-2xl bg-surface border border-border text-muted shadow-card transition-all hover:-translate-y-0.5 active:scale-95 ${s.hover}`}
              >
                {s.icon}
              </a>
            ))}
          </div>

          <a
            href="https://github.com/fernandohalim/piggy-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="block pt-3 text-[11px] font-semibold text-muted uppercase tracking-widest hover:text-primary transition-colors"
          >
            view source code
          </a>
        </div>

        <p className="mt-7 pt-5 w-full border-t border-dashed border-border text-[10px] font-semibold text-muted/70 uppercase tracking-widest">
          Piggy Wallet v{packageJson.version} · offline-first
        </p>
      </div>
    </Sheet>
  );
}
