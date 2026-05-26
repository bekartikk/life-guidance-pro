import { cn } from "../../lib/cn.js";

function SectionHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between", className)}>
      <div className="grid gap-2">
        {eyebrow ? <p className="ds-eyebrow m-0">{eyebrow}</p> : null}
        {title ? <h2 className="ds-text-h2 m-0">{title}</h2> : null}
        {description ? <p className="ds-text-body m-0">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export default SectionHeader;
