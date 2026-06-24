import { addExpense, getSettings, listRecurringRules, updateRecurringRule } from "@/lib/db/repository";
import { dueOccurrences } from "@/lib/recurring";

let running = false;

/**
 * Materializes any due recurring occurrences into real expenses, back-filling
 * every missed cycle since each rule's `lastRunAt`. Safe to call repeatedly:
 * the per-rule watermark means a no-op once everything is caught up.
 */
export async function runRecurring(now = Date.now()) {
  if (running) return;
  running = true;
  try {
    const [rules, settings] = await Promise.all([listRecurringRules(), getSettings()]);
    for (const rule of rules) {
      const due = dueOccurrences(rule, settings.cycleStartDay, now);
      if (due.length === 0) continue;
      for (const occ of due) {
        await addExpense({
          name: rule.name,
          amount: rule.amount,
          categoryId: rule.categoryId,
          occurredAt: occ,
          recurringRuleId: rule.id,
        });
      }
      await updateRecurringRule(rule.id, { lastRunAt: due[due.length - 1] });
    }
  } catch (err) {
    console.warn("[recurring] run failed", err);
  } finally {
    running = false;
  }
}
