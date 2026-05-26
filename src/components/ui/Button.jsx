import { forwardRef } from "react";
import { cn } from "../../lib/cn.js";

const variantClasses = {
  primary: "ds-button ds-button--primary",
  secondary: "ds-button ds-button--secondary",
  ghost: "ds-button ds-button--ghost",
  danger: "ds-button ds-button--danger",
};

const sizeClasses = {
  sm: "min-h-10 px-4 text-sm",
  md: "",
  lg: "min-h-12 px-5 text-[0.95rem]",
  icon: "h-11 w-11 px-0",
};

const Button = forwardRef(function Button(
  { asChild = false, className, variant = "primary", size = "md", type = "button", ...props },
  ref,
) {
  const Component = asChild ? "span" : "button";
  return <Component ref={ref} type={asChild ? undefined : type} className={cn(variantClasses[variant], sizeClasses[size], className)} {...props} />;
});

export default Button;
