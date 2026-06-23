export interface Release {
  version: string;
  badge: string;
  badgeColor: string;
  date: string;
  title: string;
  features: string[];
}

export const releases: Release[] = [
  {
    version: "1.1",
    badge: "Polish",
    badgeColor: "bg-mint-soft text-teal-700 border-mint/30",
    date: "23 Jun 2026",
    title: "A sharper home and shareable links",
    features: [
      "Today's activity on home — your three most recent expenses for the day, surfaced right under the summary so the latest spend is always in view.",
      "Shareable link previews — Piggy Wallet now ships a branded 1200×630 social card, so links unfurl with the app icon and tagline instead of a blank box.",
      "Polished changelog on desktop — a wider, roomier timeline that uses the extra space on large screens.",
    ],
  },
  {
    version: "1.0",
    badge: "Launch",
    badgeColor: "bg-primary-soft text-primary-dark border-primary/20",
    date: "23 Jun 2026",
    title: "Piggy Wallet is here",
    features: [
      "Offline-first PWA — log expenses with no connection; everything saves locally and syncs when you're back online.",
      "Firebase account sync — sign in with email or Google and your data follows you across devices, with last-write-wins merge.",
      "Fast expense entry — a native-style numpad screen on mobile with the amount as the hero and one-tap save.",
      "Categories at a glance — eight colour-coded categories with a clean icon dropdown.",
      "Simple budgets — set a monthly cap per category and watch the meter fill as you spend.",
      "Smart food budgeting — daily or weekday/weekend food allowance with rollover, weekly and full-cycle projections.",
      "Custom budget cycle — anchor your month to payday instead of the 1st; the setting syncs everywhere.",
      "Home insights — today and cycle totals, a category donut, and a 15-week spending heatmap.",
      "Logging streaks — daily streak tracking with milestone badges to keep the habit going.",
      "Responsive design — a docked sidebar on desktop, a floating bottom bar on mobile.",
      "Installable everywhere — add to your home screen and launch it like a native app.",
    ],
  },
];