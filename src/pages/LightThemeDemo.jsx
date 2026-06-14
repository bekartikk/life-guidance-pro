import { DashboardShell } from "../components/light";
import "../styles/light-theme.css";

/**
 * Light Theme Demo Page
 * 
 * This page showcases the new premium light-theme redesign
 * for Life Guidance Pro. It demonstrates:
 * 
 * - True 3-column dashboard layout
 * - Sticky AI Coach Rail
 * - KPI cards with metrics
 * - Daily Timeline
 * - Workspace mode selectors (Student, Employee, Freelancer, Entrepreneur)
 * - Focus Timer
 * - Study Center
 * - Achievements / XP / Streaks
 * - AI Chat interface
 * - Analytics V2
 * 
 * Design Features:
 * - White background with light blue gradients
 * - Soft shadows and floating cards
 * - 24px border radius
 * - Apple-quality spacing
 * - Framer Motion animations
 */
export default function LightThemeDemo() {
  return (
    <div className="min-h-screen bg-lt-bg-surface">
      <DashboardShell />
    </div>
  );
}