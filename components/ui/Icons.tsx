import type { SVGProps, FC } from "react";
import type { CategoryId } from "@/lib/types";

type IconProps = SVGProps<SVGSVGElement>;

const base: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const Svg = (props: IconProps) => (
  <svg {...base} width="24" height="24" {...props} />
);

/* ---- Categories ---- */
export const FoodIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h16" />
    <path d="M5.5 12a6.5 6.5 0 0 0 13 0" />
    <path d="M9 4.5c-.7 1 .7 2 0 3" />
    <path d="M13 4.5c-.7 1 .7 2 0 3" />
  </Svg>
);
export const CartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 4h2l2.2 10.5a1 1 0 0 0 1 .8h7.6a1 1 0 0 0 1-.8L20 7H6" />
    <circle cx="9" cy="19" r="1.4" />
    <circle cx="17" cy="19" r="1.4" />
  </Svg>
);
export const BusIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="5" width="16" height="12" rx="2.5" />
    <path d="M4 11h16" />
    <path d="M8 17v2M16 17v2" />
    <path d="M7.5 14h.01M16.5 14h.01" />
  </Svg>
);
export const BagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 8h11l-1 11.2a1 1 0 0 1-1 .8H8.5a1 1 0 0 1-1-.8L6.5 8Z" />
    <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
  </Svg>
);
export const BillIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 3h7l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M14 3v4h4" />
    <path d="M9 12h6M9 16h4" />
  </Svg>
);
export const ClapperIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="8" width="18" height="12" rx="1.5" />
    <path d="M3 8l2.5-4h13L21 8" />
    <path d="M8 4l-1.5 4M13 4l-1.5 4" />
  </Svg>
);
export const PillIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="8.5" width="18" height="7" rx="3.5" />
    <path d="M12 8.5v7" />
  </Svg>
);
export const BoxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path d="M4 7l8 4 8-4M12 11v10" />
  </Svg>
);

/* ---- Nav / UI ---- */
export const HomeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 11.5 12 4l8 7.5" />
    <path d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);
export const ReceiptIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h12v18l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 21V3Z" />
    <path d="M9 8h6M9 12h6" />
  </Svg>
);
export const TargetIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" />
  </Svg>
);
export const SettingsIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h9M17 7h3" />
    <path d="M4 17h3M11 17h9" />
    <circle cx="15" cy="7" r="2.2" />
    <circle cx="9" cy="17" r="2.2" />
  </Svg>
);
export const FlameIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 2.8c2.2 3.4 6 5.4 6 10.2a6 6 0 0 1-12 0c0-1.6.6-3 1.6-4.1.3 1.4 1.2 2.3 2.3 2.7C9.3 8.7 10.3 5.7 12 2.8Z" />
  </Svg>
);
export const TrophyIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4.5v1.5A3.5 3.5 0 0 0 8 10M17 5h2.5v1.5A3.5 3.5 0 0 1 16 10" />
    <path d="M12 13v3M9 20h6l-1-4h-4l-1 4Z" />
  </Svg>
);
export const CalendarIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
  </Svg>
);
export const PieIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9h9" />
  </Svg>
);
export const EditIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16v4Z" />
    <path d="M14 6l4 4" />
  </Svg>
);
export const PiggyIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...p}>
    <path d="M7 4.8 5.6 9 9.4 8.2Z" />
    <path d="M17 4.8 18.4 9 14.6 8.2Z" />
    <path
      fillRule="evenodd"
      d="M5 13a7 6 0 1 0 14 0a7 6 0 1 0-14 0Z
         M8.65 11.2a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0-1.7 0Z
         M13.65 11.2a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0-1.7 0Z
         M10.15 15a0.55 0.9 0 1 0 1.1 0a0.55 0.9 0 1 0-1.1 0Z
         M12.75 15a0.55 0.9 0 1 0 1.1 0a0.55 0.9 0 1 0-1.1 0Z"
    />
  </svg>
);

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5" />
    <path d="M12 8h.01" />
  </Svg>
);

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-3.2-3.2" />
  </Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
    <path d="M10 11v6M14 11v6" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </Svg>
);

export const RepeatIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M17 2.5 20.5 6 17 9.5" />
    <path d="M3.5 11V9a3 3 0 0 1 3-3h14" />
    <path d="M7 21.5 3.5 18 7 14.5" />
    <path d="M20.5 13v2a3 3 0 0 1-3 3h-14" />
  </Svg>
);

/* ---- Category mapping + shared colors (same as the donut) ---- */
const CATEGORY_ICONS: Record<CategoryId, FC<IconProps>> = {
  food: FoodIcon,
  groceries: CartIcon,
  transport: BusIcon,
  shopping: BagIcon,
  bills: BillIcon,
  entertainment: ClapperIcon,
  health: PillIcon,
  other: BoxIcon,
};

export const CATEGORY_COLORS: Record<CategoryId, string> = {
  food: "#5B5BD6",
  groceries: "#20C9A6",
  transport: "#54B8F0",
  shopping: "#F5A623",
  bills: "#8B5CF6",
  entertainment: "#EF5A6F",
  health: "#F472B6",
  other: "#94A3B8",
};
export const categoryColor = (id: CategoryId) => CATEGORY_COLORS[id];

export function CategoryIcon({ id, ...props }: IconProps & { id: CategoryId }) {
  const Cmp = CATEGORY_ICONS[id];
  return <Cmp {...props} />;
}
