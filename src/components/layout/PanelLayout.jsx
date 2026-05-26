import { cn } from "../../lib/cn.js";

function PanelLayout({ className, children, ...props }) {
  return <div className={cn("ds-panel-grid", className)} {...props}>{children}</div>;
}

export default PanelLayout;
