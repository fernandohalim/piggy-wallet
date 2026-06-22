"use client";
import { formatIDR } from "@/lib/format";
import type { FoodMeter as FoodMeterData } from "@/lib/food";

export function FoodMeter({
  meter,
  onEdit,
}: {
  meter: FoodMeterData;
  onEdit: () => void;
}) {
  const over = meter.remainingToday < 0;
  const pct =
    meter.todayAvailable > 0
      ? Math.min(
          100,
          Math.round((meter.spentToday / meter.todayAvailable) * 100),
        )
      : meter.spentToday > 0
        ? 100
        : 0;
  const cyclePct =
    meter.monthlyProjection > 0
      ? Math.min(
          100,
          Math.round((meter.cycleSpent / meter.monthlyProjection) * 100),
        )
      : 0;
  const cycleOver = meter.cycleSpent > meter.monthlyProjection;

  const dailyLabel =
    meter.splitMode === "split"
      ? `${formatIDR(meter.weekdayAmount)} · ${formatIDR(meter.weekendAmount)}`
      : `${formatIDR(meter.weekdayAmount)}/day`;

  return (
    <button
      onClick={onEdit}
      className="w-full text-left rounded-card bg-surface border border-border p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 font-medium">
          <span className="text-xl">🍜</span> Food &amp; Drinks
        </span>
        <span className="text-xs text-muted">{dailyLabel}</span>
      </div>

      <div>
        <p
          className={`text-2xl font-semibold ${over ? "text-danger" : "text-ink"}`}
        >
          {over
            ? `${formatIDR(-meter.remainingToday)} over today`
            : `${formatIDR(meter.remainingToday)} left today`}
        </p>
        <p className="text-xs text-muted">
          {formatIDR(meter.spentToday)} spent of{" "}
          {formatIDR(meter.todayAvailable)} available
        </p>
      </div>

      <div className="h-2.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full ${over ? "bg-danger" : "bg-primary"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {Math.round(meter.carryIn) !== 0 && (
        <p
          className={`text-xs ${meter.carryIn > 0 ? "text-primary-dark" : "text-danger"}`}
        >
          {meter.carryIn > 0
            ? `+${formatIDR(meter.carryIn)} rolled over from earlier days`
            : `${formatIDR(-meter.carryIn)} overspent earlier, trimmed from today`}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
        <div className="rounded-card bg-background p-2.5">
          <p className="text-muted">This week</p>
          <p className="font-medium text-sm">
            {formatIDR(meter.weekSpent)} / {formatIDR(meter.weeklyProjection)}
          </p>
        </div>
        <div className="rounded-card bg-background p-2.5">
          <p className="text-muted">This cycle (projected)</p>
          <p
            className={`font-medium text-sm ${cycleOver ? "text-danger" : ""}`}
          >
            {formatIDR(meter.cycleSpent)} / {formatIDR(meter.monthlyProjection)}
          </p>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full ${cycleOver ? "bg-danger" : "bg-primary"}`}
          style={{ width: `${cyclePct}%` }}
        />
      </div>
    </button>
  );
}
