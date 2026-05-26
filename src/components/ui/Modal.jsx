import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn.js";

function Modal({ open, onClose, title, children, className, surfaceClassName }) {
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

  return createPortal(
    <div className={cn("fixed inset-0 z-[1000] flex items-center justify-center p-4", className)} role="presentation">
      <button type="button" aria-label="Close modal backdrop" className="absolute inset-0 bg-[var(--ds-color-bg-overlay)]" onClick={onClose} />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn("ds-modal-surface relative z-[1] w-full max-w-2xl rounded-[var(--ds-radius-2xl)] p-6", surfaceClassName)}
      >
        {title ? <header className="mb-4"><h2 className="ds-text-h2 m-0">{title}</h2></header> : null}
        {children}
      </section>
    </div>,
    document.body,
  );
}

export default Modal;
