import { cn } from "../../lib/cn.js";

function GridLayout({ columns = "auto", className, children, ...props }) {
  const columnClass = columns === "analytics" ? "ds-grid-analytics" : "ds-grid-auto";
  return <div className={cn(columnClass, className)} {...props}>{children}</div>;
}

export default GridLayout;
