import { cn } from "../../../lib/cn.js";

export function EmptyState({ icon: Icon, title, description, actions, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--ds-color-border-default)] rounded-[var(--ds-radius-lg)] ds-glass", className)}>
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[var(--ds-color-text-tertiary)] mb-4">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="ds-text-h3 font-semibold mb-2 text-[var(--ds-color-text-primary)]">{title}</h3>
      <p className="text-[var(--ds-color-text-muted)] max-w-md mb-6">{description}</p>
      {actions && <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>}
    </div>
  );
}

export default EmptyState;
