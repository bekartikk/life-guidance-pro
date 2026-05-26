import { forwardRef } from "react";
import { cn } from "../../lib/cn.js";

const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn("ds-textarea ds-focus-ring", className)} {...props} />;
});

export default Textarea;
