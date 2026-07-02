import { memo, useMemo, useState } from "react";
import {
  HiOutlineArrowDownTray,
  HiOutlineClipboardDocument,
  HiOutlineShare,
  HiOutlineSparkles,
} from "react-icons/hi2";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "../ui/index.js";
import { GridLayout, PanelLayout, SectionHeader } from "../layout/index.js";
import { cn } from "../../lib/cn.js";

function toDisplayText(value, fallback = "Unavailable") {
  if (value == null) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    const joined = value
      .map((item) => toDisplayText(item, ""))
      .filter(Boolean)
      .join(", ");
    return joined || fallback;
  }
  if (typeof value === "object") {
    return value.label || value.title || value.name || value.summary || value.detail || fallback;
  }
  return fallback;
}

function formatLabel(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function buildWeeklyLabel(progress) {
  const summary = progress.lastWeekSummary;
  if (!summary) return "Start your first check-in";
  return `${summary.positiveDays || 0}/7 positive days`;
}

function splitPlanSections(text) {
  const source = String(text || "").trim();
  if (!source) return [];

  const matches = [...source.matchAll(/(^|\n)(\d+\.\s+[^\n]+)\n/g)];
  if (matches.length === 0) {
    return [{ heading: "Full plan", body: source }];
  }

  return matches.map((match, index) => {
    const heading = match[2].trim();
    const start = match.index + match[1].length + heading.length + 1;
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    return {
      heading,
      body: source.slice(start, end).trim(),
    };
  });
}

function getSectionSentence(section) {
  const body = String(section?.body || "").replace(/\s+/g, " ").trim();
  if (!body) return "This part of the plan will fill in once the AI returns more detail.";
  const sentence = body.match(/.*?[.!?](\s|$)/)?.[0]?.trim();
  return sentence || body;
}

function getSectionPreview(section) {
  const sentence = getSectionSentence(section);
  const words = sentence.split(/\s+/);
  if (words.length <= 18) return sentence;
  return `${words.slice(0, 18).join(" ")}...`;
}

function pickSection(sections, matcher, fallbackIndex) {
  return (
    sections.find((section) => matcher(section.heading.toLowerCase(), String(section.body || "").toLowerCase())) ||
    sections[fallbackIndex] ||
    sections[0] ||
    null
  );
}

function renderSectionBody(body) {
  const lines = String(body || "").split("\n").map((line) => line.trimEnd());
  const blocks = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      blocks.push({ type: "list", items: bulletBuffer });
      bulletBuffer = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets();
      return;
    }

    if (/^[-*â€¢]\s+/.test(trimmed)) {
      bulletBuffer.push(trimmed.replace(/^[-*â€¢]\s+/, ""));
      return;
    }

    flushBullets();
    if (/^(today|this week|next week|note|warning|remember)\s*:/i.test(trimmed)) {
      blocks.push({ type: "callout", text: trimmed });
      return;
    }

    blocks.push({ type: "paragraph", text: trimmed });
  });

  flushBullets();

  return blocks.map((block, index) => {
    if (block.type === "list") {
      return (
        <ul className="result-rich-list" key={`list-${index}`}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }

    if (block.type === "callout") {
      return (
        <blockquote className="result-rich-callout" key={`callout-${index}`}>
          {block.text}
        </blockquote>
      );
    }

    return (
      <p className="result-rich-paragraph" key={`paragraph-${index}`}>
        {block.text}
      </p>
    );
  });
}

function ResultPanel({
  currentPlan,
  aiMeta,
  currentPlanFeedback,
  adjustmentRequest,
  checkinNote,
  checkinFields,
  isAdjusting,
  isSubmittingCheckin,
  progress,
  recentRewards,
  todayCheckin,
  behavioralInsights,
  formatDate,
  onAdjustChange,
  onAdjust,
  onCheckin,
  onCheckinFieldChange,
  onCheckinNoteChange,
  onRegenerate,
  onRate,
}) {
  const sections = useMemo(() => splitPlanSections(currentPlan?.result), [currentPlan?.result]);
  const safeBehavioralInsights = behavioralInsights && typeof behavioralInsights === "object" ? behavioralInsights : {};
  const [expandedState, setExpandedState] = useState(() => ({
    planId: null,
    headings: new Set(),
  }));
  const [actionMessage, setActionMessage] = useState("");

  const summaryCards = useMemo(() => {
    const keyShift = pickSection(sections, (heading) => heading.includes("assessment") || heading.includes("state") || heading.includes("shift"), 0);
    const todayFocus = pickSection(sections, (heading, body) => heading.includes("routine") || heading.includes("today") || body.includes("today"), 1);
    const nextWeek = pickSection(sections, (heading, body) => heading.includes("7") || heading.includes("week") || body.includes("next 7"), 2);
    const longerHorizon = pickSection(
      sections,
      (heading, body) => heading.includes("30") || heading.includes("roadmap") || heading.includes("month") || body.includes("longer"),
      sections.length - 1,
    );

    return [
      { label: "Key shifts", section: keyShift },
      { label: "Today's focus", section: todayFocus },
      { label: "Next 7 days", section: nextWeek },
      { label: "Longer horizon", section: longerHorizon },
    ].filter((item) => item.section);
  }, [sections]);

  const planChangeCard = useMemo(() => {
    const recommendation = aiMeta?.recommendations?.[0] || null;
    if (!recommendation && !aiMeta?.adaptiveState && !aiMeta?.personality) {
      return null;
    }

    return {
      title: toDisplayText(recommendation?.title, "Why the plan changed"),
      detail:
        toDisplayText(recommendation?.why, "") ||
        toDisplayText(recommendation?.detail, "") ||
        "The adaptive engine used your recent energy, stress, and momentum signals to keep the roadmap realistic.",
      meta: [
        toDisplayText(aiMeta?.adaptiveState?.intensityLabel, ""),
        toDisplayText(aiMeta?.personality?.label, ""),
        toDisplayText(aiMeta?.roadmapIntelligence?.activeMode, ""),
      ].filter((item) => item && item !== "Unavailable"),
    };
  }, [aiMeta]);

  const memoryExplanationCard = useMemo(() => {
    const semanticMemory = aiMeta?.semanticMemory;
    const memorySummary = aiMeta?.memorySummary;
    const bullets = Array.isArray(semanticMemory?.bullets)
      ? semanticMemory.bullets
      : Array.isArray(memorySummary?.signals)
        ? memorySummary.signals
        : [];

    if (!semanticMemory?.headline && !memorySummary?.headline && bullets.length === 0) {
      return null;
    }

    return {
      title: "Why the AI remembered this",
      headline: toDisplayText(
        semanticMemory?.headline,
        toDisplayText(memorySummary?.headline, "The adaptive layer is carrying forward a pattern that still looks relevant."),
      ),
      bullets: bullets.slice(0, 3).map((item) => toDisplayText(item, "Adaptive continuity signal")).filter(Boolean),
    };
  }, [aiMeta]);

  if (!currentPlan) {
    return null;
  }

  const activeExpandedSections =
    expandedState.planId === currentPlan.id
      ? expandedState.headings
      : new Set(sections[0]?.heading ? [sections[0].heading] : []);

  function toggleSection(heading) {
    setExpandedState((current) => {
      const baseHeadings =
        current.planId === currentPlan.id
          ? current.headings
          : new Set(sections[0]?.heading ? [sections[0].heading] : []);
      const next = new Set(baseHeadings);
      if (next.has(heading)) {
        next.delete(heading);
      } else {
        next.add(heading);
      }
      return {
        planId: currentPlan.id,
        headings: next,
      };
    });
  }

  async function handleCopyPlan() {
    try {
      await navigator.clipboard.writeText(currentPlan.result || "");
      setActionMessage("Plan copied to clipboard.");
    } catch {
      setActionMessage("Could not copy the plan on this device.");
    }
  }

  async function handleSharePlan() {
    const sharePayload = {
      title: currentPlan.title,
      text: currentPlan.result,
    };

    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
        setActionMessage("Plan shared.");
        return;
      }
      await navigator.clipboard.writeText(`${currentPlan.title}\n\n${currentPlan.result}`);
      setActionMessage("Share is not available here, so the plan was copied instead.");
    } catch {
      setActionMessage("Share was cancelled.");
    }
  }

  function handleExportPlan() {
    const blob = new Blob([currentPlan.result || ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentPlan.title || "life-guidance-plan"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setActionMessage("Plan export started.");
  }

  return (
    <section className="result-panel" id="result-panel">
      <Card className="result-panel-shell" tone="elevated">
        <CardHeader className="result-header">
          <SectionHeader
            eyebrow="Latest result"
            title={currentPlan.title}
            description={`Saved ${formatDate(currentPlan.createdAt)}`}
            actions={(
              <div className="result-actions">
                <Button className="secondary-button" variant="secondary" type="button" onClick={onRegenerate}>Regenerate</Button>
                <Button className="secondary-button" variant="secondary" type="button" onClick={onRate}>Rate this plan</Button>
              </div>
            )}
          />
        </CardHeader>

        <CardContent className="grid gap-6">
          <Card className="result-toolbar" tone="soft">
            <CardContent className="result-toolbar-shell">
              <div className="result-toolbar__title">
                <Badge tone="info"><HiOutlineSparkles className="h-4 w-4" /> AI roadmap</Badge>
                <p>Use the quick actions to save, share, or revisit this plan without losing momentum.</p>
              </div>
              <div className="result-toolbar__actions">
                <Button className="secondary-button" variant="secondary" type="button" onClick={handleCopyPlan}><HiOutlineClipboardDocument className="h-4 w-4" /> Copy</Button>
                <Button className="secondary-button" variant="secondary" type="button" onClick={handleSharePlan}><HiOutlineShare className="h-4 w-4" /> Share</Button>
                <Button className="secondary-button" variant="secondary" type="button" onClick={handleExportPlan}><HiOutlineArrowDownTray className="h-4 w-4" /> Export</Button>
              </div>
            </CardContent>
          </Card>

          {actionMessage ? <Badge className="feedback-badge" tone="info">{actionMessage}</Badge> : null}

          <GridLayout className="reward-summary">
            <Card tone="soft">
              <CardContent>
                <span>Momentum Points</span>
                <strong>{progress.momentumPoints}</strong>
              </CardContent>
            </Card>
            <Card tone="soft">
              <CardContent>
                <span>Active Streak</span>
                <strong>{progress.activeStreak} days</strong>
              </CardContent>
            </Card>
            <Card tone="soft">
              <CardContent>
                <span>This Week</span>
                <strong>{buildWeeklyLabel(progress)}</strong>
              </CardContent>
            </Card>
            <Card tone="soft">
              <CardContent>
                <span>Latest Badge</span>
                <strong>{progress.latestBadge ? formatLabel(progress.latestBadge) : "Not yet"}</strong>
              </CardContent>
            </Card>
          </GridLayout>

          {summaryCards.length > 0 && (
            <GridLayout className="result-summary-grid">
              {summaryCards.map((item) => (
                <Card className="result-summary-card" key={`${item.label}-${item.section.heading}`} tone="soft">
                  <CardContent>
                    <span>{item.label}</span>
                    <strong>{item.section.heading.replace(/^\d+\.\s*/, "")}</strong>
                    <p>{getSectionPreview(item.section)}</p>
                  </CardContent>
                </Card>
              ))}
            </GridLayout>
          )}

          {planChangeCard ? (
            <Card className="result-plan-change-card" tone="soft">
              <CardHeader className="result-plan-change-card__head">
                <span>Why the plan changed</span>
                <div className="result-plan-change-card__chips">
                  {planChangeCard.meta.map((item, index) => (
                    <Badge className="badge-chip" tone="info" key={`${item}-${index}`}>{item}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <strong>{planChangeCard.title}</strong>
                <p>{planChangeCard.detail}</p>
              </CardContent>
            </Card>
          ) : null}

          {memoryExplanationCard ? (
            <Card className="result-plan-change-card result-memory-explanation-card" tone="soft">
              <CardHeader className="result-plan-change-card__head">
                <span>{memoryExplanationCard.title}</span>
                <Badge className="badge-chip" tone="info">Continuity layer</Badge>
              </CardHeader>
              <CardContent>
                <strong>{memoryExplanationCard.headline}</strong>
                {memoryExplanationCard.bullets.length ? (
                  <ul className="result-rich-list">
                    {memoryExplanationCard.bullets.map((item, index) => (
                      <li key={`${item}-${index}`}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>The memory layer is still turning repeated check-ins and recommendations into a stable explanation.</p>
                )}
              </CardContent>
            </Card>
          ) : null}

          <Card className="checkin-panel" tone="elevated">
            <CardHeader>
              <CardTitle>Today&apos;s check-in</CardTitle>
              <CardDescription>Reward effort, not perfection. Give the AI enough emotional context to adapt tomorrow realistically.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              <GridLayout className="result-summary-grid result-summary-grid--compact">
                {(Array.isArray(safeBehavioralInsights.summaryCards) ? safeBehavioralInsights.summaryCards : []).slice(0, 2).map((item, index) => (
                  <Card className="result-summary-card" key={`checkin-${toDisplayText(item?.label, "summary")}-${index}`} tone="soft">
                    <CardContent>
                      <span>{toDisplayText(item?.label, "Summary")}</span>
                      <strong>{toDisplayText(item?.value, "Waiting for data")}</strong>
                      <p>{toDisplayText(item?.detail, "The AI will add more context as your check-ins build up.")}</p>
                    </CardContent>
                  </Card>
                ))}
              </GridLayout>
              <div className="checkin-actions">
                <Button type="button" variant="secondary" onClick={() => onCheckin("completed")} disabled={isSubmittingCheckin}>Completed</Button>
                <Button type="button" variant="secondary" onClick={() => onCheckin("partial")} disabled={isSubmittingCheckin}>Partial</Button>
                <Button type="button" variant="secondary" onClick={() => onCheckin("difficult")} disabled={isSubmittingCheckin}>Difficult but tried</Button>
                <Button type="button" variant="secondary" onClick={() => onCheckin("missed")} disabled={isSubmittingCheckin}>Missed</Button>
              </div>
              <div className="two-column">
                <label>
                  Mood
                  <select className="ds-input ds-focus-ring" name="mood" value={checkinFields.mood} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Very low</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Okay</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Strong</option>
                  </select>
                </label>
                <label>
                  Energy
                  <select className="ds-input ds-focus-ring" name="energy" value={checkinFields.energy} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Empty</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Medium</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - High</option>
                  </select>
                </label>
              </div>
              <div className="two-column">
                <label>
                  Focus
                  <select className="ds-input ds-focus-ring" name="focus" value={checkinFields.focus} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Scattered</option>
                    <option value="2">2 - Weak</option>
                    <option value="3">3 - Mixed</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Deep</option>
                  </select>
                </label>
                <label>
                  Loneliness
                  <select className="ds-input ds-focus-ring" name="loneliness" value={checkinFields.loneliness} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Grounded</option>
                    <option value="2">2 - Mild</option>
                    <option value="3">3 - Present</option>
                    <option value="4">4 - Heavy</option>
                    <option value="5">5 - Intense</option>
                  </select>
                </label>
              </div>
              <div className="two-column">
                <label>
                  Stress
                  <select className="ds-input ds-focus-ring" name="stress" value={checkinFields.stress} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Light</option>
                    <option value="2">2 - Manageable</option>
                    <option value="3">3 - Present</option>
                    <option value="4">4 - Heavy</option>
                    <option value="5">5 - Overloaded</option>
                  </select>
                </label>
                <label>
                  Motivation
                  <select className="ds-input ds-focus-ring" name="motivation" value={checkinFields.motivation} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Flat</option>
                    <option value="2">2 - Fragile</option>
                    <option value="3">3 - Mixed</option>
                    <option value="4">4 - Ready</option>
                    <option value="5">5 - Strong</option>
                  </select>
                </label>
              </div>
              <div className="two-column">
                <label>
                  Sleep quality
                  <select className="ds-input ds-focus-ring" name="sleepQuality" value={checkinFields.sleepQuality} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Broken</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Okay</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Restored</option>
                  </select>
                </label>
                <label>
                  Happiness
                  <select className="ds-input ds-focus-ring" name="happiness" value={checkinFields.happiness} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Very low</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Steady</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - High</option>
                  </select>
                </label>
              </div>
              <div className="two-column">
                <label>
                  Productivity
                  <select className="ds-input ds-focus-ring" name="productivity" value={checkinFields.productivity} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="1">1 - Stalled</option>
                    <option value="2">2 - Low</option>
                    <option value="3">3 - Some progress</option>
                    <option value="4">4 - Strong</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </label>
                <label>
                  Emotional state
                  <select className="ds-input ds-focus-ring" name="emotionalState" value={checkinFields.emotionalState} onChange={onCheckinFieldChange}>
                    <option value="">Choose</option>
                    <option value="calm">Calm</option>
                    <option value="uncertain">Uncertain</option>
                    <option value="drained">Drained</option>
                    <option value="hopeful">Hopeful</option>
                    <option value="anxious">Anxious</option>
                  </select>
                </label>
              </div>
              <div className="two-column">
                <label>
                  Pressure right now
                  <Input
                    name="pressureLevel"
                    value={checkinFields.pressureLevel}
                    onChange={onCheckinFieldChange}
                    placeholder="Exams, deadlines, finances, family..."
                  />
                </label>
                <label>
                  Personal issue
                  <Input
                    name="personalIssue"
                    value={checkinFields.personalIssue}
                    onChange={onCheckinFieldChange}
                    placeholder="Optional context the AI should respect"
                  />
                </label>
              </div>
              <label>
                What made today difficult?
                <Input
                  name="difficultyReason"
                  value={checkinFields.difficultyReason}
                  onChange={onCheckinFieldChange}
                  placeholder="Time pressure, low energy, loneliness, unclear plan..."
                />
              </label>
              <label>
                Micro-win worth remembering
                <Input
                  name="wins"
                  value={checkinFields.wins}
                  onChange={onCheckinFieldChange}
                  placeholder="A small win, recovery choice, or proof that you still showed up"
                />
              </label>
              <label>
                Reflection for the AI memory
                <Textarea
                  name="reflection"
                  value={checkinFields.reflection}
                  onChange={onCheckinFieldChange}
                  placeholder="What pattern should the AI remember about today?"
                />
              </label>
              <Textarea value={checkinNote} onChange={onCheckinNoteChange} placeholder="Optional note about what helped, what got in the way, or what you want to remember." />
              {todayCheckin ? <Badge className="feedback-badge" tone="info">Today&apos;s status: {formatLabel(todayCheckin.status)}</Badge> : null}
            </CardContent>
          </Card>

          <Card className="reward-events" tone="soft">
            <CardHeader>
              <CardTitle>Recent wins</CardTitle>
              <CardDescription>Small progress counts. These rewards build momentum over time.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentRewards.length === 0 ? (
                <p className="muted-text">Your latest rewards will appear here after a check-in, plan, or feedback action.</p>
              ) : (
                <div className="reward-event-list">
                  {recentRewards.map((reward) => (
                    <Card className="reward-event-card" key={reward.id} tone="soft">
                      <CardContent>
                        <strong>{formatLabel(reward.badge || reward.milestone || reward.reason)}</strong>
                        <span>{reward.points ? `+${reward.points} points` : "Unlocked"}</span>
                        <span>{formatDate(reward.createdAt)}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="result-outline" tone="soft">
            <CardHeader>
              <CardTitle>Plan outline</CardTitle>
              <CardDescription>Open only the sections you need right now so the roadmap feels calmer to scan.</CardDescription>
            </CardHeader>
            <CardContent className="result-outline-chips">
              {sections.map((section) => (
                <Button
                  key={section.heading}
                  type="button"
                  variant="ghost"
                  onClick={() => toggleSection(section.heading)}
                  className={cn("badge-chip result-toggle-chip", {
                    "is-open": activeExpandedSections.has(section.heading),
                  })}
                >
                  {section.heading}
                </Button>
              ))}
            </CardContent>
          </Card>

          <PanelLayout className="result-sections">
            {sections.map((section) => (
              <Card
                className="result-section-card"
                key={section.heading}
                id={section.heading.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}
                tone="soft"
              >
                <button
                  type="button"
                  className="result-section-toggle"
                  onClick={() => toggleSection(section.heading)}
                  aria-expanded={activeExpandedSections.has(section.heading)}
                >
                  <div className="result-section-heading">
                    <h3>{section.heading}</h3>
                    <p>{getSectionPreview(section)}</p>
                  </div>
                  <span>{activeExpandedSections.has(section.heading) ? "Hide" : "Open"}</span>
                </button>
                {activeExpandedSections.has(section.heading) ? (
                  <CardContent className="result-section-body">
                    {renderSectionBody(section.body)}
                  </CardContent>
                ) : null}
              </Card>
            ))}
          </PanelLayout>

          <Card className="adjust-panel" tone="elevated">
            <CardHeader>
              <CardTitle>Need changes?</CardTitle>
              <CardDescription>If this routine feels hard, write what is difficult. The planner can make it easier, more career-focused, calmer, or more realistic.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea value={adjustmentRequest} onChange={onAdjustChange} placeholder="Example: I cannot wake up at 6 AM. Start my day at 8:30 AM and give me a softer evening routine." />
            </CardContent>
            <CardFooter className="adjust-panel-actions">
              <Button className="secondary-button" variant="secondary" type="button" onClick={onAdjust} disabled={isAdjusting}>{isAdjusting ? "Adjusting your plan..." : "Adjust this plan"}</Button>
              {currentPlanFeedback ? <Badge className="feedback-badge" tone="info">You already rated this plan {currentPlanFeedback.rating}/5.</Badge> : null}
            </CardFooter>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
}

export default memo(ResultPanel);
