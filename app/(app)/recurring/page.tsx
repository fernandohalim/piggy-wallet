"use client";
import { useState } from "react";
import { useLiveQuery } from "@/lib/db/useLiveQuery";
import { getSettings, listRecurringRules } from "@/lib/db/repository";
import { RecurringRuleEditor } from "@/components/recurring/RecurringRuleEditor";
import { BackLink } from "@/components/ui/BackLink";
import { categoryColor, CategoryIcon, RepeatIcon } from "@/components/ui/Icons";
import { formatIDR } from "@/lib/format";
import { categoryLabel, type RecurringRule } from "@/lib/types";

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function describe(rule: RecurringRule, cycleStartDay: number) {
  if (rule.frequency === "weekly") return `Weekly on ${WEEKDAY_NAMES[rule.weekday ?? 1]}s`;
  if (rule.frequency === "cycle") return `Every cycle · day ${cycleStartDay}`;
  return `Monthly on the ${ordinal(rule.dayOfMonth ?? 1)}`;
}

export default function RecurringPage() {
  const [editorRule, setEditorRule] = useState<RecurringRule | null>(null);
  const [adding, setAdding] = useState(false);

  const data = useLiveQuery(async () => {
    const [rules, settings] = await Promise.all([listRecurringRules(), getSettings()]);
    return { rules, cycleStartDay: settings.cycleStartDay };
  }, []);

  if (!data) return <main className="p-6 text-muted">Loading…</main>;

  const editorOpen = adding || editorRule !== null;
  const closeEditor = () => {
    setAdding(false);
    setEditorRule(null);
  };

  const addButton = (
    <button
      onClick={() => setAdding(true)}
      className="w-full h-12 rounded-card border border-dashed border-border text-sm font-medium text-primary hover:border-primary/50 transition-colors"
    >
      + New recurring expense
    </button>
  );

  return (
    <main className="min-h-dvh max-w-md sm:max-w-2xl mx-auto px-5 pt-6 sm:pt-10 pb-28 space-y-4 lg:pb-12">
      <header className="space-y-2">
        <BackLink />
        <h1 className="text-2xl font-semibold">Recurring expenses</h1>
        <p className="text-sm text-muted">
          Subscriptions, rent, and bills — added for you automatically each time they come due.
        </p>
      </header>

      {data.rules.length === 0 ? (
        <div className="space-y-4">
          <div className="py-10 text-center">
            <RepeatIcon className="h-9 w-9 mx-auto mb-2.5 text-muted" />
            <p className="text-muted text-sm">
              No recurring expenses yet.
              <br />
              Add one and it&apos;ll appear on schedule.
            </p>
          </div>
          {addButton}
        </div>
      ) : (
        <>
          {addButton}
          <div className="grid gap-2 sm:grid-cols-2">
            {data.rules.map((r) => (
              <button
                key={r.id}
                onClick={() => setEditorRule(r)}
                className="w-full flex items-center gap-3 rounded-card bg-surface border border-border shadow-card px-3.5 py-3 text-left transition-transform active:scale-[0.99]"
              >
                <span
                  className="grid place-items-center h-10 w-10 shrink-0 rounded-full"
                  style={{ backgroundColor: `${categoryColor(r.categoryId)}1A`, color: categoryColor(r.categoryId) }}
                >
                  <CategoryIcon id={r.categoryId} className="h-5 w-5" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-1.5 font-medium truncate">
                    {r.name ?? categoryLabel(r.categoryId)}
                    <RepeatIcon className="h-3.5 w-3.5 shrink-0 text-muted" />
                  </span>
                  <span className="block text-xs text-muted">{describe(r, data.cycleStartDay)}</span>
                </span>
                <span className="font-semibold tabular-nums">{formatIDR(r.amount)}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {editorOpen && (
        <RecurringRuleEditor key={editorRule?.id ?? "new"} rule={editorRule} onClose={closeEditor} />
      )}
    </main>
  );
}
