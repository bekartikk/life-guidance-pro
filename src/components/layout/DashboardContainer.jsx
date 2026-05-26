import { cn } from "../../lib/cn.js";

function DashboardContainer({ className, children, ...props }) {
  return <div className={cn("ds-dashboard-container", className)} {...props}>{children}</div>;
}

export default DashboardContainer;
