import { cn } from "../../lib/cn.js";

function AppShell({ className, children, ...props }) {
  return <div className={cn("min-h-screen bg-[var(--ds-color-bg-app)] text-[var(--ds-color-text-primary)]", className)} {...props}>{children}</div>;
}

export default AppShell;
