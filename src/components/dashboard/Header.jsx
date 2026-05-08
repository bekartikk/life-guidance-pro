import { motion } from "framer-motion";
import { HiOutlineArrowLeftOnRectangle, HiOutlineBars3BottomLeft, HiOutlineMoon, HiOutlinePlus, HiOutlineSparkles } from "react-icons/hi2";

const MotionHeader = motion.header;

function Header({
  title,
  description,
  searchQuery,
  onSearchChange,
  streakLabel,
  onQuickAdd,
  focusMode,
  onToggleFocus,
  onToggleMobileNav,
  userEmail,
  onLogout,
}) {
  return (
    <MotionHeader
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="saas-panel hero-header"
    >
      <div className="hero-header-copy">
        <p className="saas-pill w-fit">
          <HiOutlineSparkles className="h-3.5 w-3.5" />
          Workspace
        </p>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>

      <div className="hero-header-actions">
        <button type="button" onClick={onToggleMobileNav} className="saas-button-secondary hero-header-mobile-nav">
          <HiOutlineBars3BottomLeft className="h-4 w-4" />
          Menu
        </button>
        <label className="hero-search-shell">
          <span>Search workspace</span>
          <input
            className="saas-input"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Find goals, plans, routines..."
          />
        </label>
        {userEmail ? <span className="hero-header-chip">{userEmail}</span> : null}
        <span className="hero-header-chip">{streakLabel}</span>
        <button type="button" onClick={onToggleFocus} className="saas-button-secondary">
          <HiOutlineMoon className="h-4 w-4" />
          {focusMode ? "Exit Focus" : "Focus Mode"}
        </button>
        <button type="button" onClick={onQuickAdd} className="saas-button-primary">
          <HiOutlinePlus className="h-4 w-4" />
          Add Task
        </button>
        <button type="button" onClick={onLogout} className="saas-button-secondary">
          <HiOutlineArrowLeftOnRectangle className="h-4 w-4" />
          Logout
        </button>
      </div>
    </MotionHeader>
  );
}

export default Header;
