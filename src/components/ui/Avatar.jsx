import { cn } from "../../lib/cn.js";

function getInitials(name) {
  if (!name) {
    return "AI";
  }

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function Avatar({ src, alt = "", name, size = "md", className }) {
  const sizeClass = size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-14 w-14 text-base" : "h-11 w-11 text-sm";

  if (src) {
    return <img src={src} alt={alt} className={cn("rounded-full border border-[var(--ds-color-border-default)] object-cover", sizeClass, className)} />;
  }

  return (
    <span
      aria-label={alt || name || "Avatar"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-[var(--ds-color-border-default)] bg-white/8 font-semibold text-[var(--ds-color-text-secondary)]",
        sizeClass,
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
