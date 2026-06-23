"use client";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "000", "0", "back"];

export function Numpad({
  onKey,
  onSave,
  saveDisabled,
  saveLabel = "Save",
}: {
  onKey: (k: string) => void;
  onSave: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
}) {
  return (
    <div className="flex items-stretch gap-2">
      <div className="grid grid-cols-3 gap-2 flex-1">
        {KEYS.map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => onKey(k)}
            className="h-13 py-3.5 rounded-card bg-surface border border-border text-xl font-semibold text-ink active:scale-95 transition-transform grid place-items-center"
          >
            {k === "back" ? (
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6H9L3 12l6 6h11a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z" />
                <path d="M15 9.5l-4 5M11 9.5l4 5" />
              </svg>
            ) : (
              k
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saveDisabled}
        className="w-24 shrink-0 rounded-card bg-primary text-white font-semibold shadow-pop flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform disabled:opacity-50 disabled:pointer-events-none"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
        {saveLabel}
      </button>
    </div>
  );
}
