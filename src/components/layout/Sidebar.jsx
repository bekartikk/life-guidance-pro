import { cn } from "../../lib/cn.js";

function Sidebar({ className, children, ...props }) {
  return (
    <aside
      className={cn("ds-glass ds-card-base ds-card-shell flex min-h-full flex-col gap-4 rounded-[var(--ds-radius-xl)]", className)}
      {...props}
    >
      {children}
    </aside>
  );
}

export default Sidebar;
