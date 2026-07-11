"use client";

import { useId, useState } from "react";

type HelpTipProps = {
  text: string;
};

export default function HelpTip({ text }: HelpTipProps) {
  const tooltipId = useId();
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="Help"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="flex h-4 w-4 cursor-help items-center justify-center rounded-full border border-[var(--card-border)] text-[10px] leading-none text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
      >
        ?
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute left-0 top-full z-10 mt-2 w-60 max-w-[70vw] rounded-lg border border-[var(--card-border)] bg-[var(--card)] p-3 text-xs font-normal normal-case tracking-normal text-[var(--muted)] shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}
