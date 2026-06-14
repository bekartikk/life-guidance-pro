import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineAcademicCap,
  HiOutlineArrowTrendingUp,
  HiOutlineBolt,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineCheckBadge,
  HiOutlineHeart,
  HiOutlineMoon,
  HiOutlinePlayCircle,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { trackEvent } from "../utils/analytics";
import "../styles/landing-experience.css";

const audienceCards = [
  {
    title: "Students",
    icon: HiOutlineAcademicCap,
    struggle: "Assignments, study sessions, exam pressure, and unclear priorities.",
    help: "The AI builds a calm study rhythm with assignments, exams, and recovery in one plan.",
    outcome: "More clarity before class, fewer missed tasks, and steadier progress.",
  },
  {
    title: "Employees",
    icon: HiOutlineBriefcase,
    struggle: "Meetings, deep work, energy dips, work goals, and after-hours pressure.",
    help: "The workspace protects focus time while balancing recovery and growth.",
    outcome: "A calmer workweek with sharper priorities and less burnout drift.",
  },
  {
    title: "Freelancers",
    icon: HiOutlineRocketLaunch,
    struggle: "Clients, projects, revenue goals, creative focus, and unstable schedules.",
    help: "The AI connects project work, admin, outreach, and recovery into one rhythm.",
    outcome: "More consistent delivery and a cleaner path to sustainable revenue.",
  },
  {
    title: "Entrepreneurs",
    icon: HiOutlineSparkles,
    struggle: "Business goals, growth metrics, planning cycles, and decision fatigue.",
    help: "The platform keeps priorities, experiments, and personal capacity aligned.",
    outcome: "Better weekly direction with fewer scattered initiatives.",
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Understand",
    body: "Mood, energy, goals, pressure, schedule, and patterns become one clear life context.",
  },
  {
    step: "02",
    title: "Plan",
    body: "The AI creates realistic daily timelines, task priorities, habits, and recovery space.",
  },
  {
    step: "03",
    title: "Execute",
    body: "Checklists, focus blocks, reminders, and AI coaching keep the day moving without overwhelm.",
  },
  {
    step: "04",
    title: "Improve",
    body: "Weekly patterns, momentum, and recommendations evolve as your real behavior changes.",
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
  { label: "Momentum", value: "87%", note: "Your week is moving in the right direction." },
  { label: "Focus time", value: "4h 20m", note: "Protected blocks are prioritized first." },
  { label: "Goal progress", value: "68%", note: "Personal goals stay connected to daily work." },
];

const heroSignals = [
  { icon: HiOutlineBolt, label: "Behavioral learning", tone: "teal" },
  { icon: HiOutlineHeart, label: "Emotion-aware guidance", tone: "violet" },
  { icon: HiOutlineArrowTrendingUp, label: "Long-term growth", tone: "amber" },
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
          <Link to="/login" className="landing-button landing-button--primary" onClick={() => trackEvent("landing_cta_clicked", { cta: "nav_start_planning" })}>Get Started Free</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero__copy">
          <p className="landing-eyebrow">Adaptive AI productivity coach</p>
          <h1>Plan Smarter. Live Better. Achieve More.</h1>
          <p className="landing-hero__lead">
            Life Guidance Pro is your friendly AI life companion for planning days, tracking goals, building habits, and understanding the patterns behind your best weeks.
          </p>
          <div className="landing-hero__actions">
            <Link to="/login" className="landing-button landing-button--primary" onClick={() => trackEvent("landing_cta_clicked", { cta: "hero_start_planning" })}>Get Started Free</Link>
            <a href="#demo" className="landing-button landing-button--secondary" onClick={() => trackEvent("landing_cta_clicked", { cta: "hero_explore_demo" })}>
              <HiOutlinePlayCircle className="h-4 w-4" />
              Watch Demo
            </a>
          </div>
          <div className="landing-social-proof" aria-label="User social proof">
            <div className="landing-social-proof__avatars">
              <span>AK</span>
              <span>JS</span>
              <span>MN</span>
              <span>RL</span>
            </div>
            <p>Trusted by students, employees, freelancers, and founders planning calmer weeks.</p>
          </div>
          <div className="landing-hero__signals">
            {heroSignals.map((signal) => {
              const Icon = signal.icon;
              return (
                <span key={signal.label} className={`landing-signal-pill landing-signal-pill--${signal.tone}`}>
                  <Icon className="h-4 w-4" />
                  {signal.label}
                </span>
              );
            })}
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
          <div className="landing-student-illustration" aria-hidden="true">
            <div className="landing-student-illustration__halo" />
            <div className="landing-student-illustration__person">
              <span className="landing-student-illustration__head" />
              <span className="landing-student-illustration__hair" />
              <span className="landing-student-illustration__body" />
              <span className="landing-student-illustration__arm landing-student-illustration__arm--left" />
              <span className="landing-student-illustration__arm landing-student-illustration__arm--right" />
              <span className="landing-student-illustration__tablet" />
            </div>
            <div className="landing-floating-note landing-floating-note--top">Today: 4 focus blocks</div>
            <div className="landing-floating-note landing-floating-note--bottom">AI Coach: lighter evening</div>
          </div>
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
      </section>

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

      <section id="who" className="landing-section">
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
      </section>

      <section id="how" className="landing-section landing-section--workflow">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Features</p>
          <h2>Understand, plan, execute, and improve with one calm system.</h2>
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
      </section>

      <section id="memory" className="landing-section">
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
      </section>

      <section id="income" className="landing-section landing-section--split">
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
      </section>

      <section id="checkin" className="landing-section landing-section--split">
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
      </section>

      <section id="analytics" className="landing-section">
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
      </section>

      <section id="demo" className="landing-section landing-section--demo">
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
      </section>

      <section id="journeys" className="landing-section">
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
      </section>

      <section id="trust" className="landing-section landing-section--trust">
        <div className="landing-section__intro">
          <p className="landing-eyebrow">Privacy first</p>
          <h2>Your life data stays protected while your AI coach gets smarter.</h2>
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
          <div className="landing-privacy-banner">
            <div className="landing-privacy-banner__shield">
              <HiOutlineShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <span>Secure adaptive memory</span>
              <h3>Private by design, useful by default.</h3>
              <p>Your routines, check-ins, goals, and recommendations are used to improve your planning experience while keeping your personal system under your control.</p>
            </div>
          </div>
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
      </section>

      <section className="landing-final-cta">
        <p className="landing-eyebrow">Start your system</p>
        <h2>You do not need to figure everything out alone.</h2>
        <p>Build a life system that adapts with you, understands your pressure, and helps turn confusion into direction.</p>
        <div className="landing-final-cta__actions">
          <Link to="/login" className="landing-button landing-button--primary" onClick={() => trackEvent("landing_cta_clicked", { cta: "final_start_ai_plan" })}>Start Your AI Plan</Link>
          <Link to="/login" className="landing-button landing-button--secondary" onClick={() => trackEvent("landing_cta_clicked", { cta: "final_create_profile" })}>Create Your Profile</Link>
          <Link to="/login" className="landing-button landing-button--ghost" onClick={() => trackEvent("landing_cta_clicked", { cta: "final_build_routine" })}>Build My Routine</Link>
        </div>
      </section>
    </div>
  );
}

export default Landing;
