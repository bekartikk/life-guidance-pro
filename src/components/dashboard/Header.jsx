import { HiOutlineArrowLeftOnRectangle, HiOutlineBars3BottomLeft, HiOutlineMoon, HiOutlinePlus, HiOutlineSparkles } from "react-icons/hi2";
import { Badge, Button, Input } from "../ui/index.js";
import { SectionHeader, TopNavbar } from "../layout/index.js";
import { cn } from "../../lib/cn.js";

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
    <header className="hero-header">
      <TopNavbar className="hero-header ds-shell-card">
        <SectionHeader
          className="hero-header-copy"
          eyebrow={(
            <span className="inline-flex items-center gap-2">
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              Workspace
            </span>
          )}
          title={title}
          description={description}
        />

        <div className="hero-header-actions">
          <Button type="button" onClick={onToggleMobileNav} variant="secondary" className="hero-header-mobile-nav">
            <HiOutlineBars3BottomLeft className="h-4 w-4" />
            Menu
          </Button>
          <label className="hero-search-shell">
            <span>Search workspace</span>
            <Input
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Find goals, plans, routines..."
              aria-label="Search workspace"
              className={cn("saas-input", "min-w-[280px]")}
            />
          </label>
          {userEmail ? <Badge className="hero-header-chip">{userEmail}</Badge> : null}
          <Badge className="hero-header-chip">{streakLabel}</Badge>
          <Button type="button" onClick={onToggleFocus} variant="secondary" aria-label={focusMode ? "Exit focus mode" : "Enable focus mode"}>
            <HiOutlineMoon className="h-4 w-4" />
            {focusMode ? "Exit Focus" : "Focus Mode"}
          </Button>
          <Button type="button" onClick={onQuickAdd} aria-label="Open quick add task dialog">
            <HiOutlinePlus className="h-4 w-4" />
            Add Task
          </Button>
          <Button type="button" onClick={onLogout} variant="secondary" aria-label="Log out">
            <HiOutlineArrowLeftOnRectangle className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </TopNavbar>
    </header>
  );
}

export default Header;
