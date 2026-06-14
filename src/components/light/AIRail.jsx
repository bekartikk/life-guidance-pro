import { cn } from "../../lib/cn.js";
import {
  HiOutlineFire,
  HiOutlineLightBulb,
  HiOutlineArrowTrendingUp,
  HiOutlineExclamationTriangle,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi2";
import { motion as Motion } from "framer-motion";

export function AICard({ type, title, description, icon: Icon, accent, className }) {
  const accentStyles = {
    focus: "border-lt-ai-focus bg-lt-ai-focus-bg",
    recovery: "border-lt-ai-recovery bg-lt-ai-recovery-bg",
    burnout: "border-lt-ai-burnout bg-lt-ai-burnout-bg",
    growth: "border-lt-ai-growth bg-lt-ai-growth-bg",
    default: "border-lt-primary bg-lt-primary-subtle",
  };

  const iconStyles = {
    focus: "text-lt-ai-focus",
    recovery: "text-lt-ai-recovery",
    burnout: "text-lt-ai-burnout",
    growth: "text-lt-ai-growth",
    default: "text-lt-primary",
  };

  return (
    <Motion.div
      className={cn(
        "lt-ai-card border-l",
        accent && accentStyles[accent],
        className
      )}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <div className="lt-ai-card__header">
        <div className={cn("lt-ai-card__eyebrow", accent && `lt-ai-card__eyebrow--${accent}`)}>
          {Icon && <Icon className={cn("w-4 h-4", accent && iconStyles[accent])} />}
          <span>{type}</span>
        </div>
      </div>
      <h4 className="lt-ai-card__title">{title}</h4>
      <p className="lt-ai-card__body">{description}</p>
    </Motion.div>
  );
}

export default function AIRail({ insights = {} }) {
  const cards = [
    {
      type: "Today's Focus",
      title: insights.focusTitle || "Balanced Progress",
      description: insights.focusDescription || "Work on your top 3 priorities while maintaining energy balance.",
      icon: HiOutlineFire,
      accent: "focus",
    },
    {
      type: "Momentum",
      title: `${insights.momentum || 0} day streak`,
      description: insights.momentumDescription || "You're building consistent momentum. Keep the streak alive.",
      icon: HiOutlineArrowTrendingUp,
      accent: "growth",
    },
    {
      type: "Energy Check",
      title: insights.energyTitle || "Moderate Energy",
      description: insights.energyDescription || "Schedule demanding tasks for your peak hours.",
      icon: HiOutlineLightBulb,
      accent: "recovery",
    },
    {
      type: "Recovery",
      title: insights.recoveryTitle || "Take Micro-breaks",
      description: insights.recoveryDescription || "A 5-minute break every 90 minutes improves focus.",
      icon: HiOutlineCheckCircle,
      accent: "recovery",
    },
  ];

  return (
    <aside className="lt-ai-rail">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-lt-text-primary">AI Intelligence</h3>
        <p className="text-xs text-lt-text-tertiary mt-1">Personalized insights based on your patterns</p>
      </div>

      <div className="flex flex-col gap-3">
        {cards.map((card, index) => (
          <AICard key={index} {...card} />
        ))}
      </div>

      <div className="lt-ai-card mt-4">
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineClock className="w-4 h-4 text-lt-text-tertiary" />
          <span className="text-xs font-semibold text-lt-text-secondary">Next Check-in</span>
        </div>
        <p className="text-sm text-lt-text-primary font-medium">
          Evening reflection at 8:00 PM
        </p>
        <p className="text-xs text-lt-text-tertiary mt-1">
          Review your wins and set intentions for tomorrow
        </p>
      </div>
    </aside>
  );
}