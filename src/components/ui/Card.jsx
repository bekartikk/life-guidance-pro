import { forwardRef } from "react";
import { cn } from "../../lib/cn.js";

const toneClasses = {
  default: "ds-glass",
  soft: "ds-glass-soft",
  elevated: "ds-glass ds-ambient-panel",
};

const Card = forwardRef(function Card(
  { as: asElement = "section", className, tone = "default", padded = true, ...props },
  ref,
) {
  const Component = asElement;
  return (
    <Component
      ref={ref}
      className={cn("ds-card-base", toneClasses[tone], padded && "ds-card-shell", className)}
      {...props}
    />
  );
});

export function CardHeader({ className, ...props }) {
  return <div className={cn("mb-4 grid gap-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("ds-text-h3 m-0", className)} {...props} />;
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("ds-text-body m-0", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("grid gap-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("mt-4 flex flex-wrap items-center gap-3", className)} {...props} />;
}

export default Card;
