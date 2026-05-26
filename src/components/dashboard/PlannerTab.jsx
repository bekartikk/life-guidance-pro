import { useMemo, useState } from "react";
import { HiOutlineCheckCircle, HiOutlineChevronDown, HiOutlineSparkles } from "react-icons/hi2";
import { Badge, Button, Card, CardContent, Input, Textarea } from "../ui/index.js";
import { GridLayout, PanelLayout, SectionHeader } from "../layout/index.js";
import { cn } from "../../lib/cn.js";

function countCompletedPlannerFields(form) {
  const keys = [
    "currentRoutine",
    "workOrStudy",
    "personalChallenges",
    "futureConfusion",
    "goals",
    "hobbies",
    "happinessSources",
    "knownObstacles",
    "skillsToBuild",
  ];
  return keys.filter((key) => String(form[key] || "").trim()).length;
}

const FLOW_SECTIONS = [
  {
    id: "reality",
    step: "Step 1",
    title: "Reality & Routine",
    body: "Start from the shape of your real days so the planner works with life instead of fantasy.",
    fields: ["wakeTime", "sleepTime", "currentRoutine", "workOrStudy"],
  },
  {
    id: "pressure",
    step: "Step 2",
    title: "Pressure & Goals",
    body: "Make the pressure visible, then show what you actually want the next phase to move toward.",
    fields: ["personalChallenges", "futureConfusion", "goals"],
  },
  {
    id: "energy",
    step: "Step 3",
    title: "Energy & Interests",
    body: "Protect your energy, joys, and emerging strengths so the plan still feels human.",
    fields: ["hobbies", "happinessSources", "lonelyMoments", "knownObstacles", "skillsToBuild"],
  },
  {
    id: "guidance",
    step: "Step 4",
    title: "Guidance Preferences",
    body: "Tune the AI voice, time horizon, and structure so the output feels motivating rather than heavy.",
    fields: ["planDuration", "roadmapFocus", "professionalHelp", "flexibilityLevel", "energyLevel", "preferredTone"],
  },
];

function getSectionCompletion(form, section) {
  const required = section.fields.filter((field) => !["wakeTime", "sleepTime", "lonelyMoments"].includes(field));
  const completed = required.filter((field) => String(form[field] || "").trim()).length;
  return {
    completed,
    total: required.length,
    percent: required.length ? Math.round((completed / required.length) * 100) : 100,
  };
}

function PlannerAccordionSection({
  section,
  isOpen,
  completion,
  onToggle,
  children,
}) {
  return (
    <Card
      className={cn("form-section form-section-guided form-section-accordion", {
        "is-open": isOpen,
      })}
      tone={isOpen ? "elevated" : "soft"}
    >
      <button
        type="button"
        className="planner-accordion-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="planner-accordion-meta">
          <Badge tone="info">{section.step}</Badge>
          <strong>{section.title}</strong>
          <p>{section.body}</p>
        </div>
        <div className="planner-accordion-status">
          <div className="planner-mini-progress">
            <strong>{completion.percent}%</strong>
            <span>{completion.completed}/{completion.total} ready</span>
          </div>
          <HiOutlineChevronDown className={`planner-accordion-chevron${isOpen ? " is-open" : ""}`} />
        </div>
      </button>

      <div className={`planner-accordion-panel${isOpen ? " is-open" : ""}`}>
        <Card className="section-intent-card" tone="soft">
          <strong>What this step unlocks</strong>
          <p>{section.body}</p>
        </Card>
        {children}
      </div>
    </Card>
  );
}

function PlannerTab({
  form,
  consentChecked,
  isLoading,
  onChange,
  onConsentChange,
  onQuickFocus,
  onReset,
  onSubmit,
  onUseProfile,
}) {
  const completedCount = countCompletedPlannerFields(form);
  const progressPercent = Math.round((completedCount / 9) * 100);
  const [expandedSection, setExpandedSection] = useState("reality");

  const completionMap = useMemo(() => {
    return Object.fromEntries(
      FLOW_SECTIONS.map((section) => [section.id, getSectionCompletion(form, section)]),
    );
  }, [form]);

  return (
    <form className="planner-form" onSubmit={onSubmit}>
      <SectionHeader
        eyebrow="Planner"
        title="Build a new plan"
        description="One guided step at a time. Keep the setup honest, compact, and easy to finish."
        className="form-header"
        actions={(
          <Button className="link-button" variant="ghost" type="button" onClick={onReset}>
            Start fresh
          </Button>
        )}
      />

      <PanelLayout className="planner-flow-shell">
        <GridLayout className="planner-step-strip planner-step-strip--compact">
          {FLOW_SECTIONS.map((section) => {
            const completion = completionMap[section.id];
            const isActive = expandedSection === section.id;
            const isComplete = completion.percent === 100;

            return (
              <Button
                key={section.id}
                type="button"
                variant="ghost"
                className={cn("planner-step-card planner-step-card--interactive", {
                  "is-active": isActive,
                  "is-complete": isComplete,
                })}
                onClick={() => setExpandedSection(section.id)}
              >
                <Badge tone={isComplete ? "success" : "info"}>{section.step}</Badge>
                <strong>{section.title}</strong>
                <p>{completion.completed}/{completion.total} prompts ready</p>
                {isComplete ? <HiOutlineCheckCircle className="planner-step-card__icon" /> : null}
              </Button>
            );
          })}
        </GridLayout>

        <Card className="planner-progress-panel planner-progress-panel--hero" tone="elevated">
          <CardContent className="planner-progress-shell">
            <div className="planner-progress-copy">
              <Badge tone="info">AI onboarding</Badge>
              <strong>{progressPercent}% ready</strong>
              <p>{completedCount}/9 core prompts completed. A fuller setup gives the planner more reality to work with.</p>
            </div>
            <GridLayout className="planner-progress-meters">
              <Card className="planner-meter-card" tone="soft">
                <small>Fastest route</small>
                <strong>Reality -&gt; pressure -&gt; support</strong>
              </Card>
              <Card className="planner-meter-card" tone="soft">
                <small>Output style</small>
                <strong>{form.planDuration.replace("-", " ")} / {form.roadmapFocus.replace("-", " ")}</strong>
              </Card>
            </GridLayout>
          </CardContent>
        </Card>
      </PanelLayout>

      <div className="quick-options">
        <Button type="button" variant="secondary" onClick={() => onQuickFocus("career", "1-week")}>Job roadmap</Button>
        <Button type="button" variant="secondary" onClick={() => onQuickFocus("hobbies", "1-month")}>Hobbies to income</Button>
        <Button type="button" variant="secondary" onClick={() => onQuickFocus("mental-energy", "1-week")}>Motivation reset</Button>
      </div>

      <PlannerAccordionSection
        section={FLOW_SECTIONS[0]}
        isOpen={expandedSection === "reality"}
        completion={completionMap.reality}
        onToggle={() => setExpandedSection(expandedSection === "reality" ? "" : "reality")}
      >
        <div className="two-column">
          <label>Wake time<Input name="wakeTime" value={form.wakeTime} onChange={onChange} placeholder="Example: 7:00 AM" /></label>
          <label>Sleep time<Input name="sleepTime" value={form.sleepTime} onChange={onChange} placeholder="Example: 11:30 PM" /></label>
        </div>
        <label>Daily routine<Textarea name="currentRoutine" value={form.currentRoutine} onChange={onChange} placeholder="What happens in your normal day from morning to night?" /></label>
        <label>Work, study, or earning situation<Textarea name="workOrStudy" value={form.workOrStudy} onChange={onChange} placeholder="What do you do now for study, job, business, freelancing, or income?" /></label>
      </PlannerAccordionSection>

      <PlannerAccordionSection
        section={FLOW_SECTIONS[1]}
        isOpen={expandedSection === "pressure"}
        completion={completionMap.pressure}
        onToggle={() => setExpandedSection(expandedSection === "pressure" ? "" : "pressure")}
      >
        <label>Personal issues or stress points<Textarea name="personalChallenges" value={form.personalChallenges} onChange={onChange} placeholder="What is making life heavy, confusing, lonely, or stuck?" /></label>
        <label>Future confusion<Textarea name="futureConfusion" value={form.futureConfusion} onChange={onChange} placeholder="Career, job, family pressure, money, skills, confidence, anything." /></label>
        <label>Goals<Textarea name="goals" value={form.goals} onChange={onChange} placeholder="What would you like to improve in the next 3 to 12 months?" /></label>
      </PlannerAccordionSection>

      <PlannerAccordionSection
        section={FLOW_SECTIONS[2]}
        isOpen={expandedSection === "energy"}
        completion={completionMap.energy}
        onToggle={() => setExpandedSection(expandedSection === "energy" ? "" : "energy")}
      >
        <div className="two-column">
          <label>Hobbies and interests<Textarea name="hobbies" value={form.hobbies} onChange={onChange} placeholder="Music, games, fitness, art, reading, coding, cooking..." /></label>
          <label>What makes you happy<Textarea name="happinessSources" value={form.happinessSources} onChange={onChange} placeholder="People, places, activities, memories, small comforts..." /></label>
        </div>
        <label>When do you feel alone?<Textarea name="lonelyMoments" value={form.lonelyMoments} onChange={onChange} placeholder="Evening, weekends, after scrolling, after work, while studying..." /></label>
        <label>What may make this routine hard to follow?<Textarea name="knownObstacles" value={form.knownObstacles} onChange={onChange} placeholder="Late sleep, family duties, college timing, low motivation, phone use, travel, money limits..." /></label>
        <label>Skills or interests you may want to turn into future scope<Textarea name="skillsToBuild" value={form.skillsToBuild} onChange={onChange} placeholder="Example: sketching, music, coding, teaching, fitness, public speaking, content creation..." /></label>
      </PlannerAccordionSection>

      <PlannerAccordionSection
        section={FLOW_SECTIONS[3]}
        isOpen={expandedSection === "guidance"}
        completion={completionMap.guidance}
        onToggle={() => setExpandedSection(expandedSection === "guidance" ? "" : "guidance")}
      >
        <div className="two-column">
          <label>Plan length<select className="ds-input ds-focus-ring" name="planDuration" value={form.planDuration} onChange={onChange}><option value="1-week">Full 1 week plan</option><option value="1-month">1 month plan</option><option value="3-months">3 month roadmap</option></select></label>
          <label>Main focus<select className="ds-input ds-focus-ring" name="roadmapFocus" value={form.roadmapFocus} onChange={onChange}><option value="balanced">Balanced life, study/work, happiness</option><option value="career">Career and job roadmap</option><option value="study">Study and skill improvement</option><option value="mental-energy">Motivation, loneliness, and energy</option><option value="hobbies">Hobbies into future opportunities</option></select></label>
          <label>Career help<select className="ds-input ds-focus-ring" name="professionalHelp" value={form.professionalHelp} onChange={onChange}><option value="roadmap">Give me a roadmap</option><option value="ask-first">Ask what profession I want first</option><option value="explore-options">Suggest future scopes from my hobbies</option><option value="professional-support">Tell me when to take professional help</option></select></label>
          <label>Routine style<select className="ds-input ds-focus-ring" name="flexibilityLevel" value={form.flexibilityLevel} onChange={onChange}><option value="flexible">Flexible and easy to adjust</option><option value="structured">Structured with clear time blocks</option><option value="low-pressure">Low pressure for difficult days</option></select></label>
          <label>Energy level<select className="ds-input ds-focus-ring" name="energyLevel" value={form.energyLevel} onChange={onChange}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
          <label>Guidance style<select className="ds-input ds-focus-ring" name="preferredTone" value={form.preferredTone} onChange={onChange}><option value="gentle">Gentle</option><option value="direct">Direct</option><option value="motivational">Motivational</option><option value="mentor">Mentor style</option></select></label>
        </div>
      </PlannerAccordionSection>

      <Card className="planner-consent-shell" tone="soft">
        <CardContent className="grid gap-5">
          <label className="consent-box">
            <input type="checkbox" checked={consentChecked} onChange={onConsentChange} />
            <span>I understand this planner is not therapy, medical care, legal advice, or emergency support, and I agree to save my plan history in the app.</span>
          </label>

          <div className="planner-submit-shell">
            <div className="planner-submit-copy">
              <span><HiOutlineSparkles className="h-4 w-4" /> AI plan output</span>
              <strong>{isLoading ? "The guidance engine is shaping your roadmap..." : "Ready to generate your adaptive roadmap"}</strong>
              <p>We’ll turn your routine, pressure, energy, and preferences into a plan you can actually follow.</p>
            </div>
            <div className="action-row">
              <Button className="primary-button" type="submit" disabled={isLoading}>{isLoading ? "Creating your plan..." : "Create my guidance plan"}</Button>
              <Button className="secondary-button" variant="secondary" type="button" onClick={onUseProfile}>Use saved profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

export default PlannerTab;
