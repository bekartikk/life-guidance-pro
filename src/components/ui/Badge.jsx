import { cn } from "../../lib/cn.js";

const toneClasses = {
  default: "",
  success: "ds-badge--success",
  warning: "ds-badge--warning",
  danger: "ds-badge--danger",
  info: "ds-badge--info",
};

function Badge({ className, tone = "default", ...props }) {
  return <span className={cn("ds-badge", toneClasses[tone], className)} {...props} />;
}

export default Badge;
