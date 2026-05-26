import { cn } from "../../lib/cn.js";

function TopNavbar({ className, children, ...props }) {
  return (
    <header
      className={cn("ds-glass ds-card-base ds-card-shell flex flex-wrap items-center justify-between gap-4 rounded-[var(--ds-radius-xl)]", className)}
      {...props}
    >
      {children}
    </header>
  );
}

export default TopNavbar;
