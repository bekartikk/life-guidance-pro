import { cn } from "../../lib/cn.js";
import {
  HiOutlineTrophy,
  HiOutlineFire,
  HiOutlineStar,
  HiOutlineLightBulb,
  HiOutlineHeart,
  HiOutlineBookOpen,
  HiOutlineGlobeAlt as HiOutlineGlobe,
  HiOutlineMusicalNote,
} from "react-icons/hi2";
import { motion as Motion } from "framer-motion";

const ACHIEVEMENTS = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Complete your first day",
    icon: HiOutlineStar,
    tier: "bronze",
    unlocked: true,
  },
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "7 day streak achieved",
    icon: HiOutlineFire,
    tier: "silver",
    unlocked: true,
  },
  {
    id: "momentum-master",
    title: "Momentum Master",
    description: "Reach 100 momentum points",
    icon: HiOutlineTrophy,
    tier: "gold",
    unlocked: false,
  },
  {
    id: "deep-thinker",
    title: "Deep Thinker",
    description: "Complete 10 journal entries",
    icon: HiOutlineLightBulb,
    tier: "bronze",
    unlocked: true,
  },
  {
    id: "self-care",
    title: "Self Care",
    description: "Log 5 recovery days",
    icon: HiOutlineHeart,
    tier: "silver",
    unlocked: false,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Complete 20 study sessions",
    icon: HiOutlineBookOpen,
    tier: "gold",
    unlocked: false,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Try all workspace modes",
    icon: HiOutlineGlobe,
    tier: "bronze",
    unlocked: true,
  },
  {
    id: "creative",
    title: "Creative Soul",
    description: "Complete a hobby income plan",
    icon: HiOutlineMusicalNote,
    tier: "silver",
    unlocked: false,
  },
];

export function XPBar({ current, max, level }) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="lt-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-lt-text-primary">Level {level}</p>
          <p className="text-xs text-lt-text-tertiary">
            {max - current} XP to next level
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{level}</span>
        </div>
      </div>

      <div className="lt-xp-bar">
        <div
          className="lt-xp-bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-lt-text-tertiary">{current} XP</span>
        <span className="text-xs text-lt-text-tertiary">{max} XP</span>
      </div>
    </div>
  );
}

export function StreakFlame({ count }) {
  if (count === 0) return null;

  return (
    <div className="lt-streak-flame">
      <HiOutlineFire className="w-4 h-4" />
      <span>{count} day{count > 1 ? "s" : ""} streak</span>
    </div>
  );
}

export function AchievementCard({ achievement }) {
  const Icon = achievement.icon;

  return (
    <Motion.div
      className={cn(
        "lt-achievement-card",
        !achievement.unlocked && "opacity-50"
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={achievement.unlocked ? { y: -4 } : {}}
    >
      <div className={cn(
        "lt-achievement-card__icon",
        `lt-achievement-card__icon--${achievement.tier}`
      )}>
        <Icon className="text-white" />
      </div>
      <h4 className="lt-achievement-card__title">{achievement.title}</h4>
      <p className="lt-achievement-card__description">{achievement.description}</p>
      {achievement.unlocked && (
        <div className="mt-2">
          <span className="lt-badge lt-badge--success">Unlocked</span>
        </div>
      )}
    </Motion.div>
  );
}

export default function Achievements({ stats = {} }) {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* XP Progress */}
      <XPBar
        current={stats.xp || 245}
        max={500}
        level={stats.level || 3}
      />

      {/* Streak */}
      <div className="flex items-center gap-4">
        <StreakFlame count={stats.streak || 7} />
        <div className="text-sm text-lt-text-secondary">
          Longest streak: <span className="font-semibold text-lt-text-primary">{stats.longestStreak || 12} days</span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-lt-text-primary">Achievements</h3>
          <span className="text-sm text-lt-text-tertiary">
            {unlockedCount} / {ACHIEVEMENTS.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </div>
    </div>
  );
}