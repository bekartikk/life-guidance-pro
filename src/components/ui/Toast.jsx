import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/cn.js";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((toast) => {
    const id = toast.id ?? `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [...current, { tone: "default", duration: 3200, ...toast, id }]);
    const duration = toast.duration ?? 3200;
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
            <div className="pointer-events-none fixed bottom-4 right-4 z-[1200] grid gap-3">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={cn(
                    "ds-toast-surface pointer-events-auto min-w-[260px] rounded-[var(--ds-radius-lg)] px-4 py-3 text-sm",
                    toast.tone === "success" && "border-[rgba(89,227,174,0.28)]",
                    toast.tone === "danger" && "border-[rgba(255,127,159,0.28)]",
                  )}
                >
                  {toast.title ? <strong className="mb-1 block">{toast.title}</strong> : null}
                  <div className="text-[var(--ds-color-text-secondary)]">{toast.description}</div>
                </div>
              ))}
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
