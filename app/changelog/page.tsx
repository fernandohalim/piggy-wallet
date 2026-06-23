"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { releases } from "@/lib/changelog";
import { PiggyIcon } from "@/components/ui/Icons";

export default function ChangelogPage() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <main className="min-h-dvh flex flex-col items-center px-5 pt-6 pb-20">
      <div className="w-full max-w-md sm:max-w-2xl">
        <div className="sticky top-0 z-20 -mx-5 px-5 pt-2 pb-4 mb-8 bg-background/85 backdrop-blur-xl border-b border-border flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            aria-label="Back home"
            className="grid place-items-center h-11 w-11 rounded-full bg-surface border border-border shadow-card text-muted hover:text-primary-dark active:scale-95 transition-all"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex flex-col items-end">
            <h1 className="text-xl font-bold font-display tracking-tight">
              Changelog
            </h1>
            <span className="text-[10px] font-semibold text-muted uppercase tracking-widest">
              current version {releases[0]?.version}
            </span>
          </div>
        </div>

        <div className="relative space-y-5 before:absolute before:inset-y-0 before:left-6 before:-translate-x-1/2 before:w-0.5 before:bg-gradient-to-b before:from-primary/40 before:via-border before:to-transparent before:rounded-full">
          {releases.map((release, index) => {
            const parts = release.version.split(".");
            let weight = 3;
            if (parts.length === 2) weight = parts[1] === "0" ? 1 : 2;
            const isOpen = weight !== 3 || expanded[release.version];

            let Node = null;
            if (weight === 1) {
              Node = (
                <div className="grid place-items-center h-12 w-12 rounded-full border-4 border-background bg-gradient-to-b from-primary to-primary-dark text-white shadow-pop relative z-10 group-hover:scale-105 transition-transform">
                  <PiggyIcon className="h-6 w-6" />
                </div>
              );
            } else if (weight === 2) {
              Node = (
                <div className="grid place-items-center h-10 w-10 rounded-full border-4 border-background bg-primary text-white shadow-card relative z-10 mt-0.5 group-hover:scale-105 transition-transform">
                  <span className="text-[10px] font-bold">
                    {release.version}
                  </span>
                </div>
              );
            } else {
              Node = (
                <div
                  className="h-5 w-5 rounded-full border-[3px] border-background bg-border relative z-10 mt-2.5 group-hover:bg-primary group-hover:scale-110 transition-all"
                  aria-hidden="true"
                />
              );
            }

            const toggle = () =>
              weight === 3 &&
              setExpanded((p) => ({
                ...p,
                [release.version]: !p[release.version],
              }));

            return (
              <div
                key={release.version}
                style={{ animationDelay: `${index * 80}ms` }}
                className={`relative flex gap-3 sm:gap-4 group animate-fade-in ${
                  weight === 1 ? "mt-10 first:mt-0" : ""
                }`}
              >
                <div className="w-12 flex justify-center shrink-0">{Node}</div>
                <div
                  onClick={toggle}
                  role={weight === 3 ? "button" : undefined}
                  tabIndex={weight === 3 ? 0 : undefined}
                  aria-expanded={weight === 3 ? Boolean(isOpen) : undefined}
                  onKeyDown={
                    weight === 3
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle();
                          }
                        }
                      : undefined
                  }
                  className={`flex-1 rounded-card bg-surface border border-border shadow-card p-5 transition-all group-hover:-translate-y-0.5 ${
                    weight === 3 ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2 gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${release.badgeColor}`}
                    >
                      {release.version} · {release.badge}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <time className="text-[10px] font-semibold text-muted uppercase tracking-wider">
                        {release.date}
                      </time>
                      {weight === 3 && (
                        <svg
                          className={`h-4 w-4 text-muted transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-primary" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <h3
                    className={`font-bold text-ink ${
                      weight === 1 ? "text-xl" : "text-base"
                    } ${isOpen ? "mb-3" : "mb-0"}`}
                  >
                    {release.title}
                  </h3>
                  {isOpen && (
                    <ul className="space-y-2 animate-fade-in">
                      {release.features.map((f, idx) => (
                        <li
                          key={idx}
                          className="text-sm text-muted flex items-start gap-2 leading-snug"
                        >
                          <span className="mt-0.5 shrink-0 text-primary">
                            ↳
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-14 text-center text-xs font-semibold text-muted/70 uppercase tracking-widest">
          more coming soon
        </p>
      </div>
    </main>
  );
}
