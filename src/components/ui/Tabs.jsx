import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "../../lib/cn.js";

const TabsContext = createContext(null);

export function Tabs({ value, defaultValue, onValueChange, className, children }) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const currentValue = value ?? internalValue;

  const contextValue = useMemo(() => ({
    value: currentValue,
    setValue(nextValue) {
      if (value === undefined) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
  }), [currentValue, onValueChange, value]);

  return <TabsContext.Provider value={contextValue}><div className={cn("grid gap-4", className)}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ className, ...props }) {
  return <div className={cn("inline-flex w-fit flex-wrap gap-2 rounded-[var(--ds-radius-pill)] border border-[var(--ds-color-border-default)] bg-white/5 p-1", className)} {...props} />;
}

export function TabsTrigger({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  const active = context?.value === value;

  return (
    <button
      type="button"
      className={cn(
        "rounded-[var(--ds-radius-pill)] px-3 py-2 text-sm font-medium transition",
        active ? "bg-white/12 text-[var(--ds-color-text-primary)]" : "text-[var(--ds-color-text-secondary)] hover:bg-white/8",
        className,
      )}
      onClick={() => context?.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsPanel({ value, className, children, ...props }) {
  const context = useContext(TabsContext);
  if (context?.value !== value) {
    return null;
  }

  return <div className={cn("grid gap-4", className)} {...props}>{children}</div>;
}
