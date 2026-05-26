import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn.js";

function Drawer({ open, onClose, title, side = "right", children, className }) {
  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const sideClass = side === "left" ? "left-0" : "right-0";

  return createPortal(
    <div className="fixed inset-0 z-[999]">
      <button type="button" aria-label="Close drawer backdrop" className="absolute inset-0 bg-[var(--ds-color-bg-overlay)]" onClick={onClose} />
      <aside className={cn("ds-drawer-surface ds-scrollbar absolute top-0 h-full w-full max-w-sm overflow-y-auto p-5", sideClass, className)}>
        {title ? <h2 className="ds-text-h3 mb-4">{title}</h2> : null}
        {children}
      </aside>
    </div>,
    document.body,
  );
}

export default Drawer;
