import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import heroImage from "./assets/hero.png";
import AppErrorBoundary from "./components/AppErrorBoundary";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import "./App.css";

const heroMetrics = [
  { label: "Life state", value: "Structured rebuild" },
  { label: "Primary track", value: "Career clarity" },
  { label: "Top skill", value: "Adaptive planning" },
];

const workflowSteps = [
  "Collect routine, emotional state, interests, skills, and constraints.",
  "Assess life state and surface hidden strengths.",
  "Generate an adaptive daily routine and growth roadmap.",
  "Check time and budget feasibility before recommending actions.",
  "Refine everything through feedback and progress updates.",
];

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (isCheckingAuth) {
    return <main className="page-shell loading-shell">Loading your space...</main>;
  }

  return (
    <main className="page-shell">
      <div className="ambient ambient--left" aria-hidden="true" />
      <div className="ambient ambient--right" aria-hidden="true" />
      <section className="topbar">
        <div className="brand-copy">
          <p className="eyebrow">Private life planning studio</p>
          <h1>Life Guidance Pro</h1>
          <p className="brand-subtitle">
            Build routines, roadmaps, and calmer next steps that actually fit your real life.
          </p>
          <div className="hero-actions">
            <a className="primary-button hero-button" href={user ? "#dashboard-workspace" : "#auth-shell"}>
              {user ? "Go to workspace" : "Build my plan"}
            </a>
            <a className="secondary-button hero-button" href={user ? "#planner-shell" : "#auth-shell"}>
              {user ? "Open planner" : "Start with setup"}
            </a>
          </div>
          <div className="hero-metrics">
            {heroMetrics.map((metric) => (
              <article className="hero-metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <aside className="topbar-side hero-panel">
          <div className="hero-panel-header">
            <div>
              <p className="eyebrow">Closed-loop workflow</p>
              <h2>From profile to progress</h2>
            </div>
            <span className="hero-status-pill">
              {user ? `Signed in as ${user.email}` : "Ready now"}
            </span>
          </div>
          <ol className="workflow-list">
            {workflowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="hero-panel-footer">
            <div className="topbar-visual-shell" aria-hidden="true">
              <img className="topbar-visual" src={heroImage} alt="" />
              <p>
                {user
                  ? "Planner, tracking, AI guidance, and rewards connected in one calm system."
                  : "Shape routines that stay realistic when life gets messy."}
              </p>
            </div>
            {user ? (
              <div className="account-actions">
                <div className="account-badge">
                  <span className="account-label">Signed in</span>
                  <strong>{user.email}</strong>
                </div>
                <button className="secondary-button" onClick={() => signOut(auth)}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="topbar-note">Private answers. Flexible plans. Gentle guidance that still feels realistic.</div>
            )}
          </div>
        </aside>
      </section>

      <AppErrorBoundary>
        {user ? <Dashboard user={user} /> : <Login />}
      </AppErrorBoundary>
    </main>
  );
}

export default App;
