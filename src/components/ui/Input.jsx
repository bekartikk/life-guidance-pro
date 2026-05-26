import { forwardRef } from "react";
import { cn } from "../../lib/cn.js";

const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn("ds-input ds-focus-ring", className)} {...props} />;
});

export default Input;
