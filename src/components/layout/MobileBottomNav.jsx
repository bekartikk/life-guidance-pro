import { cn } from "../../lib/cn.js";

function MobileBottomNav({ className, children, ...props }) {
  return (
    <nav
      className={cn(
        "ds-glass fixed inset-x-4 bottom-4 z-[300] flex items-center justify-between gap-2 rounded-[var(--ds-radius-2xl)] px-3 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] lg:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </nav>
  );
}

export default MobileBottomNav;
