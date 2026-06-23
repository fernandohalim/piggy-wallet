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
    version: "1.6",
    badge: "Insights & export",
    badgeColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    date: "23 Jun 2026",
    title: "Know your trend, take it with you",
    features: [
      "Month-over-month trend — the home screen now shows your past month's spending against the month before it, at a glance, so you can see whether you're trending up or down independent of your payday cycle.",
      "PDF expense reports — hit export on the Expenses page to turn whatever you're currently viewing into a clean, neatly formatted PDF, with the filters you used printed right on it. Save it to your phone and read it anywhere.",
      "Weekly food budgets — the food budget reset is now your choice of daily, weekly, or monthly. Weekly rolls unspent allowance forward through the week and resets every Monday, sitting neatly between a fixed daily allowance and full cycle rollover.",
    ],
  },
  {
    version: "1.5.1",
    badge: "Fixes",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    date: "23 Jun 2026",
    title: "A more honest heatmap",
    features: [
      "Heatmap label, corrected — on mobile the spending heatmap shows a single month, so it now reads \"Last month\" instead of \"Last 2 months\" (desktop still shows two).",
    ],
  },
  {
    version: "1.5",
    badge: "Filtering",
    badgeColor: "bg-rose-100 text-rose-700 border-rose-200",
    date: "23 Jun 2026",
    title: "Find any expense, fast",
    features: [
      "Filter by category — a row of colour-coded chips narrows the list to a single category with one tap.",
      "Filter by period — switch between your payday cycle, any month, or a custom date range of up to one month; future dates and months are kept out of reach.",
      "Search by name — type to find an expense by its name or category instantly.",
      "Multi-select delete — tap the trash icon to enter select mode, tick as many expenses as you like, then remove them together with a confirmation step.",
      "Period insights — a compact strip shows your average per day, biggest single expense, and top category for whatever you're currently viewing.",
      "Filters that stay put — the filter bar sticks to the top as you scroll, with a one-tap \"Clear filters\" whenever a filter is active.",
    ],
  },
  {
    version: "1.4",
    badge: "Refinements",
    badgeColor: "bg-violet-100 text-violet-700 border-violet-200",
    date: "23 Jun 2026",
    title: "A clearer calendar and safer deletes",
    features: [
      "Heatmap, reborn as a calendar — spending now lays out as a proper two-month calendar (one month on mobile), and you can filter it to any single category to see just that pattern.",
      "Tap a day to dig in — tapping a day on the heatmap reveals its three biggest expenses right below it.",
      "Budgets that sort themselves — categories you've set sit up top as full progress cards, while the rest tuck into a quiet \"add a budget\" row.",
      "Safer deletes — removing an expense or a budget now asks for confirmation first, so nothing disappears by accident.",
    ],
  },
  {
    version: "1.3",
    badge: "Insights",
    badgeColor: "bg-sky-100 text-sky-700 border-sky-200",
    date: "23 Jun 2026",
    title: "See your spending clearly",
    features: [
      "Spending donut, reimagined — switch between cycle, month and week, with the total front-and-centre and a cleaner middle that shows your transaction count (and any category's share the moment you tap a slice).",
      "Tidier expense entry — closed the big empty gap between the date picker and the numpad on mobile, so the keypad sits right where your thumb expects it.",
    ],
  },
  {
    version: "1.2",
    badge: "Settings",
    badgeColor: "bg-accent/15 text-amber-700 border-accent/30",
    date: "23 Jun 2026",
    title: "Food budgeting, your way",
    features: [
      "Rollover toggle for food budgets — a new switch in Settings lets you choose whether unspent food allowance carries forward into today, or each day gets its own fixed amount.",
      "On by default — nothing changes unless you flip it, so your existing rollover behaviour stays exactly as it was.",
    ],
  },
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