import { cn } from "../../../lib/cn.js";
import { HiOutlineCheckCircle, HiOutlineExclamationTriangle, HiOutlineInformationCircle, HiOutlineXCircle } from "react-icons/hi2";

const toneIcons = {
  success: HiOutlineCheckCircle,
  error: HiOutlineXCircle,
  warning: HiOutlineExclamationTriangle,
  info: HiOutlineInformationCircle,
  default: HiOutlineInformationCircle,
};

const toneStyles = {
  success: "bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)] text-[var(--ds-color-success)]",
  error: "bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-[var(--ds-color-danger)]",
  warning: "bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.2)] text-[var(--ds-color-warning)]",
  info: "bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.2)] text-[var(--ds-color-info)]",
  default: "bg-white/5 border-[var(--ds-color-border-default)] text-[var(--ds-color-text-secondary)]",
};

export function Alert({ tone = "default", title, children, className, icon: IconComponent }) {
  const Icon = IconComponent || toneIcons[tone] || toneIcons.default;
  return (
    <div className={cn("flex gap-3 rounded-[var(--ds-radius-md)] border p-4", toneStyles[tone], className)} role="alert">
      <Icon className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1 min-w-0 w-full text-[var(--ds-color-text-primary)]">
        {title && <h4 className="font-semibold text-current">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}

export default Alert;
