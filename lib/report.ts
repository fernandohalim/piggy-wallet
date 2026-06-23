import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { categoryLabel, type Expense } from "./types";
import { formatIDR } from "./format";

export interface ReportMeta {
  periodLabel: string; // e.g. "1 Jun – 30 Jun"
  category: string; // "All categories" or a specific label
  search: string; // "" when none
  total: number;
  count: number;
}

type RGB = [number, number, number];
const PRIMARY: RGB = [91, 91, 214];
const MUTED: RGB = [155, 152, 173];
const INK: RGB = [44, 42, 58];
const BORDER: RGB = [231, 229, 240];
const CHIP_BG: RGB = [236, 234, 246];
const SUBTLE: RGB = [248, 247, 252];
const CAT_TEXT: RGB = [107, 104, 128];
const WHITE: RGB = [255, 255, 255];

const longDate = (ms: number) =>
  new Date(ms).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

async function loadDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () =>
        resolve(typeof r.result === "string" ? r.result : null);
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function printExpenseReport(
  expenses: Expense[],
  meta: ReportMeta,
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  const right = pageW - margin;

  // ---- header ----
  const icon = await loadDataUrl("/icons/icon-192.png");
  let y = 16;
  if (icon) doc.addImage(icon, "PNG", margin, y - 5, 9, 9);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...PRIMARY);
  doc.text("Piggy Wallet", icon ? margin + 11 : margin, y + 1.5);

  const generated = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Generated ${generated}`, right, y + 0.5, { align: "right" });

  y += 6;
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.6);
  doc.line(margin, y, right, y);

  // ---- title ----
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text("Expense Report", margin, y);

  // ---- filter chips ----
  y += 7;
  const chips = [`Period:  ${meta.periodLabel}`, `Category:  ${meta.category}`];
  if (meta.search) chips.push(`Search:  "${meta.search}"`);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const chipH = 6.5;
  let cx = margin;
  for (const c of chips) {
    const w = doc.getTextWidth(c) + 6;
    if (cx + w > right) {
      cx = margin;
      y += chipH + 2.5;
    }
    doc.setFillColor(...CHIP_BG);
    doc.roundedRect(cx, y - chipH + 2, w, chipH, 1.6, 1.6, "F");
    doc.setTextColor(...PRIMARY);
    doc.text(c, cx + 3, y);
    cx += w + 3;
  }

  // ---- stat boxes ----
  y += 9;
  const days = new Set(expenses.map((e) => longDate(e.occurredAt))).size || 1;
  const avgPerDay = meta.total / days;
  const biggest = expenses.reduce((m, e) => (e.amount > m ? e.amount : m), 0);
  const stats: [string, string][] = [
    ["Expenses", String(meta.count)],
    ["Total", formatIDR(meta.total)],
    ["Avg / day", formatIDR(avgPerDay)],
    ["Biggest", formatIDR(biggest)],
  ];
  const gap = 3;
  const boxW = (right - margin - gap * 3) / 4;
  const boxH = 16;
  stats.forEach(([k, v], i) => {
    const x = margin + i * (boxW + gap);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, boxW, boxH, 2, 2, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(k.toUpperCase(), x + 3, y + 5.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(...INK);
    doc.text(v, x + 3, y + 11.5);
  });
  y += boxH + 6;

  // ---- table ----
  if (expenses.length) {
    autoTable(doc, {
      startY: y,
      theme: "striped",
      head: [["Date", "Name", "Category", "Amount"]],
      body: expenses.map((e) => [
        longDate(e.occurredAt),
        e.name ?? categoryLabel(e.categoryId),
        categoryLabel(e.categoryId),
        formatIDR(e.amount),
      ]),
      foot: [["", "", "Total", formatIDR(meta.total)]],
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 2.2, textColor: INK, lineWidth: 0 },
      headStyles: {
        fillColor: WHITE,
        textColor: MUTED,
        fontStyle: "bold",
        fontSize: 7.5,
      },
      footStyles: {
        fillColor: WHITE,
        textColor: INK,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: SUBTLE },
      columnStyles: {
        0: { cellWidth: 26, textColor: CAT_TEXT },
        2: { textColor: CAT_TEXT },
        3: { halign: "right" },
      },
      didParseCell: (d) => {
        if (d.column.index === 3) d.cell.styles.halign = "right";
      },
    });
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...MUTED);
    doc.text("No expenses match this filter.", pageW / 2, y + 10, {
      align: "center",
    });
  }

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`piggy-wallet-report-${stamp}.pdf`);
}
