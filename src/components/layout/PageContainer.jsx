import { cn } from "../../lib/cn.js";

function PageContainer({ className, children, ...props }) {
  return <div className={cn("ds-page-container", className)} {...props}>{children}</div>;
}

export default PageContainer;
