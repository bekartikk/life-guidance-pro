import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/cn.js";
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlineInformationCircle, HiOutlineXCircle, HiOutlineXMark } from "react-icons/hi2";

const ToastContext = createContext(null);

const toneIcons = {
  success: HiOutlineCheckCircle,
  error: HiOutlineXCircle,
  warning: HiOutlineExclamationTriangle,
  info: HiOutlineInformationCircle,
  default: HiOutlineInformationCircle,
};

const toneClasses = {
  success: "border-[rgba(16,185,129,0.28)] text-[var(--ds-color-success)]",
  error: "border-[rgba(239,68,68,0.28)] text-[var(--ds-color-danger)]",
  warning: "border-[rgba(245,158,11,0.28)] text-[var(--ds-color-warning)]",
  info: "border-[rgba(59,130,246,0.28)] text-[var(--ds-color-info)]",
  default: "border-[var(--ds-color-border-default)] text-[var(--ds-color-text-secondary)]",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((toast) => {
    const id = toast.id ?? `feedback-toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { tone: "default", duration: 4000, ...toast, id }]);
    const duration = toast.duration ?? 4000;
    if (typeof window !== "undefined" && duration > 0) {
      window.setTimeout(() => dismissToast(id), duration);
    }
    return id;
  }, [dismissToast]);

  const value = useMemo(() => ({ dismissToast, pushToast }), [dismissToast, pushToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined"
        ? createPortal(
            <div className="pointer-events-none fixed bottom-4 right-4 z-[1200] flex flex-col gap-3">
              {toasts.map((toast) => {
                const Icon = toneIcons[toast.tone] || toneIcons.default;
                return (
                  <div
                    key={toast.id}
                    className={cn(
                      "ds-toast-surface pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--ds-radius-lg)] p-4 shadow-lg transition-all",
                      toneClasses[toast.tone],
                    )}
                    role="alert"
                  >
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="flex flex-1 flex-col gap-1 min-w-0 text-[var(--ds-color-text-primary)]">
                      {toast.title && <strong className="font-semibold text-sm">{toast.title}</strong>}
                      {toast.description && <p className="text-sm text-[var(--ds-color-text-secondary)]">{toast.description}</p>}
                    </div>
                    {toast.dismissible !== false && (
                      <button
                        onClick={() => dismissToast(toast.id)}
                        className="text-[var(--ds-color-text-muted)] hover:text-[var(--ds-color-text-primary)] transition-colors shrink-0"
                        aria-label="Close"
                      >
                        <HiOutlineXMark className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  return useContext(ToastContext) ?? { dismissToast: () => {}, pushToast: () => null };
}

export default { ToastProvider, useToast };
