export function currentCycle(cycleStartDay: number, ref: number) {
  const d = new Date(ref);
  let year = d.getFullYear();
  let month = d.getMonth();
  if (d.getDate() < cycleStartDay) {
    month -= 1;
    if (month < 0) { month = 11; year -= 1; }
  }
  const start = new Date(year, month, cycleStartDay, 0, 0, 0, 0);
  const end = new Date(year, month + 1, cycleStartDay, 0, 0, 0, 0);
  return { start: start.getTime(), end: end.getTime() };
}

export function cycleLabel(start: number, end: number): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const s = new Date(start).toLocaleDateString("en-GB", opts);
  const e = new Date(end - 86_400_000).toLocaleDateString("en-GB", opts); // inclusive last day
  return `${s} – ${e}`;
}