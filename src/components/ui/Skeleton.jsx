import { cn } from "../../lib/cn.js";

function Skeleton({ className, ...props }) {
  return <div aria-hidden="true" className={cn("ds-skeleton rounded-[var(--ds-radius-md)]", className)} {...props} />;
}

export default Skeleton;
