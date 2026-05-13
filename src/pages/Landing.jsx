import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowTrendingUp,
  HiOutlineBolt,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBarSquare,
  HiOutlineCheckBadge,
  HiOutlineHeart,
  HiOutlineLightBulb,
  HiOutlineMoon,
  HiOutlineRocketLaunch,
  HiOutlineSparkles,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { trackEvent } from "../utils/analytics";
import "../styles/landing-experience.css";

const MotionSection = motion.section;

const audienceCards = [
  {
    title: "Students",
    icon: HiOutlineAcademicCap,
    struggle: "Inconsistency, exam pressure, low motivation, and no clear direction.",
    help: "The AI turns scattered days into a realistic study rhythm, skill roadmap, and recovery-aware routine.",
    outcome: "More structure, less panic, and a clearer path into career-building work.",
  },
  {
    title: "Employees",
    icon: HiOutlineBriefcase,
    struggle: "Work stress, low energy after hours, health neglect, and future confusion.",
    help: "The system balances work, recovery, money goals, and personal growth in one operating plan.",
    outcome: "A calmer week with better focus, stronger routines, and less burnout drift.",
  },
  {
    title: "Freelancers",
    icon: HiOutlineRocketLaunch,
    struggle: "Unstable schedules, creative overwhelm, inconsistent output, and pressure to earn.",
    help: "The AI creates focus blocks, client-work rhythms, and a momentum system you can repeat.",
    outcome: "Higher consistency, clearer output, and more stable growth without chaos.",
  },
  {
    title: "Creators",
    icon: HiOutlineSparkles,
    struggle: "Too many ideas, weak execution systems, and hobbies that never turn into leverage.",
    help: "It connects creative energy to practice, portfolio work, learning, and monetization experiments.",
    outcome: "From scattered inspiration to a visible creative growth engine.",
  },
  {
    title: "People feeling lost",
    icon: HiOutlineLightBulb,
    struggle: "Confusion, loneliness, decision fatigue, and not knowing what matters next.",
    help: "The AI helps uncover patterns, simplify direction, and make the next step feel possible again.",
    outcome: "Clarity, steadier routines, and less pressure to figure out everything at once.",
  },
  {
    title: "Burned-out individuals",
    icon: HiOutlineHeart,
    struggle: "Stress, emotional heaviness, unreliable energy, and repeated routine collapse.",
    help: "The planner lowers intensity, protects recovery, and adapts expectations based on real-life conditions.",
    outcome: "A gentler, safer system that still builds forward motion.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "You share your real life",
    body: "Routine, goals, emotional pressure, hobbies, energy, career interests, and what actually makes life harder or better.",
  },
  {
    step: "02",
    title: "The AI reads patterns",
    body: "It looks for consistency drops, pressure cycles, energy rhythms, and the gap between ideal plans and real behavior.",
  },
  {
    step: "03",
    title: "Adaptive guidance is generated",
    body: "You get routines, roadmaps, recovery balance, skill strategy, and hobby-to-income pathways shaped around your reality.",
  },
  {
    step: "04",
    title: "Daily feedback keeps it alive",
    body: "Mood, stress, missed tasks, burnout signals, and changing goals feed the next version instead of breaking the system.",
  },
];

const memoryInsights = [
  "Your focus improves in the morning when the first block starts before scrolling.",
  "Coding or design work raises motivation more reliably than passive content consumption.",
  "Consistency drops after heavy emotional days, so recovery-first routines perform better.",
  "Shorter, clear routines work better than large ideal plans when energy is unstable.",
];

const hobbyRoadmap = [
  { label: "Beginner", detail: "Start with one repeatable practice habit." },
  { label: "Practice system", detail: "Turn interest into output with weekly reps." },
  { label: "Skill growth", detail: "Learn deliberately, track proof, and improve range." },
  { label: "Portfolio", detail: "Shape visible examples instead of hidden effort." },
  { label: "Income path", detail: "Test freelancing, offers, or leverage opportunities." },
];

const checkinSignals = [
  { label: "Mood", value: "Low but steady" },
  { label: "Stress", value: "High this week" },
  { label: "Energy", value: "Better before lunch" },
  { label: "Sleep", value: "Recovery needed" },
];

const analyticsCards = [
  { title: "Consistency", value: "78%", note: "Your strongest routines repeat when the first block is protected." },
  { title: "Emotional balance", value: "Stable", note: "Recovery improves when work intensity is lowered after stress spikes." },
  { title: "Skill growth", value: "Rising", note: "Creative practice and coding both respond well to short visible sessions." },
  { title: "Career direction", value: "Clarifying", note: "The system sees stronger traction when learning is tied to output." },
];

const demoModes = {
  student: {
    title: "Student Mode",
    persona: "Overwhelmed but ambitious",
    summary: "Balances classes, skill-building, emotional pressure, and a clearer future path.",
    plan: [
      "Morning focus block for classes before distractions",
      "Low-energy evening revision routine",
      "Weekly career/portfolio skill session",
      "Loneliness-aware recovery slots and lighter weekends",
    ],
  },
  employee: {
    title: "Employee Mode",
    persona: "Working but stretched thin",
    summary: "Protects work performance while rebuilding health, consistency, and future direction.",
    plan: [
      "Workday reset ritual before task switching",
      "Energy-based after-hours learning blocks",
      "Money, fitness, and relationship rhythm in one system",
      "Stress-trigger check-ins to reduce burnout spirals",
    ],
  },
  creator: {
    title: "Creator Mode",
    persona: "Talented but scattered",
    summary: "Turns creative potential into output, proof, and future leverage without exhausting the person behind it.",
    plan: [
      "Daily creation window with one visible output target",
      "Weekly portfolio growth loop",
      "Hobby-to-income experiments with low pressure",
      "Recovery rules for idea-heavy, emotionally expensive weeks",
    ],
  },
};

const journeys = [
  {
    title: "Student to direction",
    story: "A confused student moves from inconsistent study and low confidence into a stable routine, skill roadmap, and clearer career path.",
  },
  {
    title: "Employee to balance",
    story: "A stressed employee uses adaptive guidance to lower burnout, rebuild health habits, and make room for future growth.",
  },
  {
    title: "Creator to leverage",
    story: "A creative person turns hobbies into repeatable practice, visible proof, and beginner income experiments.",
  },
];

const mobileSectionLinks = [
  { id: "who", label: "Who it helps" },
  { id: "how", label: "How AI works" },
  { id: "memory", label: "AI memory" },
  { id: "income", label: "Income path" },
  { id: "checkin", label: "Check-ins" },
  { id: "analytics", label: "Insights" },
  { id: "demo", label: "Live demo" },
  { id: "journeys", label: "Stories" },
  { id: "trust", label: "Trust" },
];

const landingMetrics = [
  { label: "Life state", value: "Adaptive", note: "Plans shift with stress, energy, and reality." },
  { label: "Guidance depth", value: "Multi-layer", note: "Routine, roadmap, motivation, and recovery." },
  { label: "AI memory", value: "Pattern-aware", note: "It learns what works and what keeps collapsing." },
];

function Landing() {
  const [activeDemo, setActiveDemo] = useState("student");
  const [expandedMobileSection, setExpandedMobileSection] = useState("who");
  const demo = useMemo(() => demoModes[activeDemo], [activeDemo]);
  const toggleMobileSection = (section) => {
    setExpandedMobileSection((current) => (current === section ? "" : section));
  };
  const openMobileSection = (section) => {
    setExpandedMobileSection(section);
    if (typeof document !== "undefined") {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="landing-experience">
      <div className="landing-experience__orb landing-experience__orb--violet" />
      <div className="landing-experience__orb landing-experience__orb--cyan" />
      <div className="landing-experience__grain" />

      <nav className="landing-nav">
        <Link to="/" className="landing-brand">
          <span className="landing-brand__mark"><HiOutlineSparkles className="h-5 w-5" /></span>
          <div>
            <strong>Life Guidance Pro</strong>
            <small>AI Life Operating System</small>
          </div>
        </Link>

        <div className="landing-nav__links">
          <a href="#who">Who it helps</a>
          <a href="#how">How AI works</a>
          <a href="#demo">Live demo</a>
          <a href="#trust">Trust & safety</a>
        </div>

        <div className="landing-nav__actions">
          <Link to="/login" className="landing-button landing-button--ghost" onClick={() => trackEvent("landing_cta_clicked", { cta: "nav_login" })}>Log in</Link>
          <Link to="/login" className="landing-button landing-button--primary" onClick={() => trackEvent("landing_cta_clicked", { cta: "nav_start_planning" })}>Start Planning</Link>
        </div>
      </nav>

      <MotionSection
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="landing-hero"
      >
        <div className="landing-hero__copy">
          <p className="landing-eyebrow">Adaptive AI guidance for real life</p>
          <h1>Design a life that actually fits you.</h1>
          <p className="landing-hero__lead">
            Life Guidance Pro is an AI-powered life operating system that helps students, employees, creators, and overwhelmed people build routines, direction, momentum, and balance with intelligent adaptive planning.
          </p>
          <div className="landing-hero__actions">
            <Link to="/login" className="landing-button landing-button--primary" onClick={() => trackEvent("landing_cta_clicked", { cta: "hero_start_planning" })}>Start Planning</Link>
            <a href="#demo" className="landing-button landing-button--secondary" onClick={() => trackEvent("landing_cta_clicked", { cta: "hero_explore_demo" })}>Explore Demo</a>
            <a href="#how" className="landing-button landing-button--ghost" onClick={() => trackEvent("landing_cta_clicked", { cta: "hero_how_ai_works" })}>See How AI Works</a>
          </div>
          <div className="landing-metrics">
            {landingMetrics.map((metric) => (
              <article className="landing-metric-card" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <p>{metric.note}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="landing-hero__visual">
          <article className="landing-dashboard-preview">
            <div className="landing-dashboard-preview__head">
              <div>
                <p className="landing-eyebrow">AI roadmap preview</p>
                <h2>Today’s adaptive plan</h2>
              </div>
              <span className="landing-chip">Recovery-aware</span>
            </div>

            <div className="landing-dashboard-preview__timeline">
              <div className="landing-timeline-card">
                <span>07:30 - 09:00</span>
                <strong>Morning clarity block</strong>
                <p>Deep work before messages and social drift.</p>
              </div>
              <div className="landing-timeline-card landing-timeline-card--teal">
                <span>14:00 - 15:00</span>
                <strong>Skill growth sprint</strong>
                <p>One focused practice session tied to a career outcome.</p>
              </div>
              <div className="landing-timeline-card landing-timeline-card--violet">
                <span>20:30 - 21:00</span>
                <strong>Emotional recovery</strong>
                <p>Lower pressure. Short reflection and lighter close to the day.</p>
              </div>
            </div>

            <div className="landing-dashboard-preview__insights">
              <div className="landing-preview-note">
                <strong>AI sees a pattern</strong>
                <p>Your motivation rises when learning is attached to output, not just theory.</p>
              </div>
              <div className="landing-preview-note">
                <strong>Today’s adjustment</strong>
                <p>Stress is elevated, so the routine is lighter and more recovery-aware.</p>
              </div>
            </div>
          </article>
        </div>
      </MotionSection>

      <div className="landing-mobile-sections-nav" aria-label="Mobile section navigation">
        {mobileSectionLinks.map((section) => (
          <button
            key={section.id}
            type="button"
            className={expandedMobileSection === section.id ? "landing-mobile-sections-nav__chip is-active" : "landing-mobile-sections-nav__chip"}
            onClick={() => openMobileSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      <MotionSection id="who" className="landing-section">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Who this is for</p>
          <h2>Built for real people dealing with real pressure.</h2>
          <p className="landing-desktop-copy">The product meets people where they actually are: overwhelmed, ambitious, lonely, stressed, curious, or trying to rebuild momentum without burning out.</p>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "who" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("who")}
        >
          <span>See who this helps</span>
          <strong>{expandedMobileSection === "who" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "who" ? "is-open" : ""}`}>
        <p className="landing-mobile-summary">Students, employees, creators, and overwhelmed people get a plan that fits real pressure instead of ideal routines.</p>
        <div className="landing-audience-grid">
          {audienceCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="landing-audience-card">
                <div className="landing-audience-card__icon"><Icon className="h-5 w-5" /></div>
                <h3>{card.title}</h3>
                <p><strong>Struggle:</strong> {card.struggle}</p>
                <p><strong>AI help:</strong> {card.help}</p>
                <p><strong>Outcome:</strong> {card.outcome}</p>
              </article>
            );
          })}
        </div>
        </div>
      </MotionSection>

      <MotionSection id="how" className="landing-section landing-section--workflow">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">How the AI works</p>
          <h2>Not a static planner. A closed-loop guidance engine.</h2>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "how" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("how")}
        >
          <span>See the AI workflow</span>
          <strong>{expandedMobileSection === "how" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "how" ? "is-open" : ""}`}>
        <p className="landing-mobile-summary">You share what life really feels like, the AI reads patterns, then it keeps adapting the plan as your days change.</p>
        <div className="landing-workflow-grid">
          {workflowSteps.map((step) => (
            <article key={step.step} className="landing-workflow-card">
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
        </div>
      </MotionSection>

      <MotionSection id="memory" className="landing-section">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">AI memory & adaptive intelligence</p>
          <h2>The system remembers what helps and what keeps failing.</h2>
          <p className="landing-desktop-copy">It learns what improves focus, what creates stress, when motivation drops, and which habits actually survive in your real life.</p>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "memory" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("memory")}
        >
          <span>See AI memory examples</span>
          <strong>{expandedMobileSection === "memory" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "memory" ? "is-open" : ""}`}>
        <p className="landing-mobile-summary">The system notices what improves focus, what creates stress, and which routines actually survive your real week.</p>
        <div className="landing-memory-grid">
          {memoryInsights.map((insight) => (
            <article className="landing-memory-card" key={insight}>
              <HiOutlineCheckBadge className="h-5 w-5" />
              <p>{insight}</p>
            </article>
          ))}
        </div>
        </div>
      </MotionSection>

      <MotionSection id="income" className="landing-section landing-section--split">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Hobby to income engine</p>
          <h2>Turn curiosity into leverage, proof, and future opportunity.</h2>
          <p className="landing-desktop-copy">The AI helps identify strengths, shape learning loops, and build a path from hobby to visible skill to monetizable work.</p>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "income" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("income")}
        >
          <span>See the growth path</span>
          <strong>{expandedMobileSection === "income" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "income" ? "is-open" : ""}`}>
          <p className="landing-mobile-summary">A simple path from interest to practice, visible proof, and beginner income opportunities.</p>
          <div className="landing-roadmap">
            {hobbyRoadmap.map((item) => (
              <article className="landing-roadmap-step" key={item.label}>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection id="checkin" className="landing-section landing-section--split">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Daily AI check-ins</p>
          <h2>A routine that changes when life changes.</h2>
          <p className="landing-desktop-copy">Each day, users can share mood, stress, motivation, sleep, and energy. The AI responds by adjusting intensity, recovery, and expectations.</p>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "checkin" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("checkin")}
        >
          <span>See check-in adaptation</span>
          <strong>{expandedMobileSection === "checkin" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "checkin" ? "is-open" : ""}`}>
          <p className="landing-mobile-summary">Short daily updates help the AI lower pressure, protect recovery, and keep momentum realistic.</p>
          <div className="landing-checkin-card">
            <div className="landing-checkin-grid">
              {checkinSignals.map((signal) => (
                <article key={signal.label} className="landing-checkin-signal">
                  <span>{signal.label}</span>
                  <strong>{signal.value}</strong>
                </article>
              ))}
            </div>
            <div className="landing-checkin-note">
              <HiOutlineMoon className="h-5 w-5" />
              <p>Your energy is lower this week, so the system reduces workload intensity and preserves the most important blocks first.</p>
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="analytics" className="landing-section">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Life balance analytics</p>
          <h2>Watch consistency, emotional balance, creativity, learning, and direction evolve together.</h2>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "analytics" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("analytics")}
        >
          <span>See balance analytics</span>
          <strong>{expandedMobileSection === "analytics" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "analytics" ? "is-open" : ""}`}>
          <p className="landing-mobile-summary">See the few signals that matter most first: consistency, emotional balance, skill growth, and direction.</p>
          <div className="landing-analytics-grid">
            {analyticsCards.map((card) => (
              <article className="landing-analytics-card" key={card.title}>
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <p>{card.note}</p>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection id="demo" className="landing-section landing-section--demo">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Interactive live demo</p>
          <h2>See how the AI behaves before you sign up.</h2>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "demo" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("demo")}
        >
          <span>Open the live demo</span>
          <strong>{expandedMobileSection === "demo" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "demo" ? "is-open" : ""}`}>
          <p className="landing-mobile-summary">Try a sample student, employee, or creator plan before signing up.</p>
          <div className="landing-demo-shell">
            <div className="landing-demo-tabs">
              {Object.entries(demoModes).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={key === activeDemo ? "landing-demo-tab is-active" : "landing-demo-tab"}
                  onClick={() => {
                    setActiveDemo(key);
                    trackEvent("landing_demo_mode_selected", { mode: key });
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
            <article className="landing-demo-card">
              <div className="landing-demo-card__head">
                <div>
                  <span>{demo.title}</span>
                  <h3>{demo.persona}</h3>
                </div>
                <p>{demo.summary}</p>
              </div>
              <div className="landing-demo-card__plan">
                {demo.plan.map((item) => (
                  <div className="landing-demo-line" key={item}>
                    <HiOutlineArrowTrendingUp className="h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </MotionSection>

      <MotionSection id="journeys" className="landing-section">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Real user journeys</p>
          <h2>From confusion and pressure to steadier direction.</h2>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "journeys" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("journeys")}
        >
          <span>Read real journeys</span>
          <strong>{expandedMobileSection === "journeys" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "journeys" ? "is-open" : ""}`}>
          <p className="landing-mobile-summary">A few grounded examples of how the system helps different people rebuild direction and balance.</p>
          <div className="landing-journey-grid">
            {journeys.map((journey) => (
              <article className="landing-journey-card" key={journey.title}>
                <h3>{journey.title}</h3>
                <p>{journey.story}</p>
              </article>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection id="trust" className="landing-section landing-section--trust">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Trust & safety</p>
          <h2>Supportive, private, and under your control.</h2>
        </div>
        <button
          type="button"
          className={`landing-mobile-toggle ${expandedMobileSection === "trust" ? "is-open" : ""}`}
          onClick={() => toggleMobileSection("trust")}
        >
          <span>Read trust and safety</span>
          <strong>{expandedMobileSection === "trust" ? "Hide" : "Open"}</strong>
        </button>
        <div className={`landing-mobile-panel ${expandedMobileSection === "trust" ? "is-open" : ""}`}>
          <p className="landing-mobile-summary">Your plans stay editable, private, and under your control. The AI supports you without trying to replace your judgment.</p>
          <div className="landing-trust-grid">
            <article className="landing-trust-card">
              <HiOutlineUserGroup className="h-5 w-5" />
              <p>Your plans are editable, flexible, and designed to support your life, not trap you in one system.</p>
            </article>
            <article className="landing-trust-card">
              <HiOutlineCalendarDays className="h-5 w-5" />
              <p>The AI gives adaptive guidance, not therapy or emergency support. You stay in control of your routines and choices.</p>
            </article>
            <article className="landing-trust-card">
              <HiOutlineBolt className="h-5 w-5" />
              <p>The platform uses your inputs to shape routines, roadmaps, and consistency support around real-life conditions.</p>
            </article>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="landing-final-cta">
        <p className="landing-eyebrow">Start your system</p>
        <h2>You do not need to figure everything out alone.</h2>
        <p>Build a life system that adapts with you, understands your pressure, and helps turn confusion into direction.</p>
        <div className="landing-final-cta__actions">
          <Link to="/login" className="landing-button landing-button--primary" onClick={() => trackEvent("landing_cta_clicked", { cta: "final_start_ai_plan" })}>Start Your AI Plan</Link>
          <Link to="/login" className="landing-button landing-button--secondary" onClick={() => trackEvent("landing_cta_clicked", { cta: "final_create_profile" })}>Create Your Profile</Link>
          <Link to="/login" className="landing-button landing-button--ghost" onClick={() => trackEvent("landing_cta_clicked", { cta: "final_build_routine" })}>Build My Routine</Link>
        </div>
      </MotionSection>
    </div>
  );
}

export default Landing;
