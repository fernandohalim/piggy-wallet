const pad = (n: number) => String(n).padStart(2, "0");

export function dateInputValue(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Change the calendar date but keep the original time-of-day (preserves ordering)
export function setDatePart(ms: number, dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(ms);
  dt.setFullYear(y, m - 1, d);
  return dt.getTime();
}

export const dayKey = (ms: number) => dateInputValue(ms);

export function dayLabel(ms: number): string {
  const today = dayKey(Date.now());
  const yesterday = dayKey(Date.now() - 86_400_000);
  const k = dayKey(ms);
  if (k === today) return "Today";
  if (k === yesterday) return "Yesterday";
  return new Date(ms).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function timeInputValue(ms: number): string {
  const d = new Date(ms);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function setTimePart(ms: number, timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  const dt = new Date(ms);
  dt.setHours(h, m, 0, 0);
  return dt.getTime();
}

// 6×7 grid of dates for a month, Monday-first (spillover days included)
export function monthMatrix(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const mondayOffset = (first.getDay() + 6) % 7;
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) cells.push(new Date(year, month, 1 - mondayOffset + i));
  return cells;
}

export function startOfWeekMonday(ms: number): number {
  const d = new Date(ms);
  const offset = (d.getDay() + 6) % 7; // days since Monday
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - offset, 0, 0, 0, 0).getTime();
}