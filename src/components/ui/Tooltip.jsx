import { useState } from "react";
import { cn } from "../../lib/cn.js";

function Tooltip({ content, children, className }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open && content ? (
        <span
          role="tooltip"
          className="ds-tooltip-surface pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[1100] w-max max-w-[220px] -translate-x-1/2 rounded-[var(--ds-radius-md)] px-3 py-2 text-xs leading-5 text-[var(--ds-color-text-secondary)]"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

export default Tooltip;
