import { Badge, Card, CardContent, CardHeader, CardTitle } from "../ui/index.js";
import { GridLayout, PanelLayout, SectionHeader } from "../layout/index.js";

function PersonalizationTab({ insights, profile, plans, checkins, behavioralInsights, adaptiveWorkspace }) {
  return (
    <section className="goals-panel in-workspace">
      <SectionHeader
        eyebrow="Personalization Engine"
        title="Turn history into sharper future guidance"
        description="This is the first personalization layer: it reads your profile, planning history, and check-ins to spot the style that seems to fit you best."
        className="form-header"
      />

      <GridLayout className="summary-card">
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Saved plans</span><span className="stat-value">{plans.length}</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Check-ins used</span><span className="stat-value">{checkins.length}</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Preferred tone</span><span className="stat-value">{insights.preferredTone}</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Best current focus</span><span className="stat-value">{insights.bestFocus}</span></CardContent></Card>
        <Card className="summary-stat" tone="soft"><CardContent><span className="stat-label">Life state</span><span className="stat-value">{behavioralInsights.lifeState.label}</span></CardContent></Card>
      </GridLayout>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Workspace modes" description="The AI shifts how it guides you based on pressure, momentum, and direction." />
          </CardHeader>
          <CardContent className="goal-list">
            {adaptiveWorkspace.workspaceModes.map((mode) => (
              <Card className={`goal-card${mode.active ? " completed" : ""}`} key={mode.id} tone="soft">
                <CardContent>
                  <strong>{mode.label}</strong>
                  <Badge className="goal-meta" tone={mode.active ? "success" : "info"}>{mode.active ? "Active now" : "Standby mode"}</Badge>
                  <p>{mode.summary}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="AI insight feed" description="This is the living feed that explains what the system is noticing and why plans are shifting." />
          </CardHeader>
          <CardContent className="goal-list">
            {adaptiveWorkspace.insightFeed.map((item) => (
              <Card className="goal-card" key={item.id} tone="soft">
                <CardContent>
                  <strong>{item.title}</strong>
                  <span className="goal-meta">{item.kind}</span>
                  <p>{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </PanelLayout>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="What the app is learning" description="These are gentle heuristics, not rigid labels." />
          </CardHeader>
          <CardContent className="goal-list">
            <Card className="goal-card" tone="soft"><CardContent><strong>Routine style fit</strong><p>{insights.routineStyle}</p></CardContent></Card>
            <Card className="goal-card" tone="soft"><CardContent><strong>Low-energy fallback</strong><p>{insights.lowEnergyPattern}</p></CardContent></Card>
            <Card className="goal-card" tone="soft"><CardContent><strong>Recommended next planning move</strong><p>{insights.nextMove}</p></CardContent></Card>
            <Card className="goal-card" tone="soft"><CardContent><strong>Best check-in window so far</strong><p>{insights.bestDayWindow}</p></CardContent></Card>
          </CardContent>
        </Card>

        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Behavioral profile" description="How the AI is adapting its coaching style and predictions." />
          </CardHeader>
          <CardContent className="goal-list">
            <Card className="goal-card" tone="soft">
              <CardContent>
                <strong>Current life state</strong>
                <span className="goal-meta">{behavioralInsights.lifeState.label}</span>
                <p>{behavioralInsights.lifeState.summary}</p>
              </CardContent>
            </Card>
            <Card className="goal-card" tone="soft">
              <CardContent>
                <strong>Coaching mode</strong>
                <span className="goal-meta">{behavioralInsights.personalityMode.active}</span>
                <p>{behavioralInsights.personalityMode.reason}</p>
              </CardContent>
            </Card>
            <Card className="goal-card" tone="soft">
              <CardContent>
                <strong>Burnout risk</strong>
                <span className="goal-meta">{behavioralInsights.burnoutRisk.score}% · {behavioralInsights.burnoutRisk.label}</span>
                <p>{behavioralInsights.burnoutRisk.summary}</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </PanelLayout>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="AI memory engine" description="Long-term patterns the system is starting to remember about you." />
          </CardHeader>
          <CardContent className="goal-list">
            {behavioralInsights.memoryCards.map((item) => (
              <Card className="goal-card" key={item.label} tone="soft">
                <CardContent>
                  <strong>{item.label}</strong>
                  <span className="goal-meta">{item.value}</span>
                  <p>{item.detail}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Profile signals in use" description="These fields are still shaping future recommendations underneath the behavioral layer." />
          </CardHeader>
          <CardContent className="goal-list">
            <Card className="goal-card" tone="soft"><CardContent><strong>Main goal</strong><span className="goal-meta">{profile.mainGoal || "Not saved yet"}</span></CardContent></Card>
            <Card className="goal-card" tone="soft"><CardContent><strong>Interests</strong><span className="goal-meta">{profile.interests || "Not saved yet"}</span></CardContent></Card>
            <Card className="goal-card" tone="soft"><CardContent><strong>Working style</strong><span className="goal-meta">{profile.workingStyle || "Not saved yet"}</span></CardContent></Card>
            <Card className="goal-card" tone="soft"><CardContent><strong>Long-term vision</strong><span className="goal-meta">{profile.longTermVision || "Not saved yet"}</span></CardContent></Card>
          </CardContent>
        </Card>
      </PanelLayout>

      <PanelLayout className="split-progress-grid">
        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Neglected life-area detection" description="The AI should notice what is quietly going missing before it hurts the bigger system." />
          </CardHeader>
          <CardContent className="goal-list">
            {behavioralInsights.neglectedAreas.length === 0 ? (
              <Card className="goal-card" tone="soft">
                <CardContent>
                  <strong>No major neglected area detected</strong>
                  <p>Your recent data does not show one severe blind spot. Keep checking in so the model stays honest.</p>
                </CardContent>
              </Card>
            ) : (
              behavioralInsights.neglectedAreas.map((item) => (
                <Card className="goal-card" key={item.area} tone="soft">
                  <CardContent>
                    <strong>{item.area}</strong>
                    <p>{item.reason}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="section-card" tone="soft">
          <CardHeader className="section-card-header">
            <SectionHeader title="Long-term projection" description="Early future reads that help the user understand where the current system is heading." />
          </CardHeader>
          <CardContent className="goal-list">
            {behavioralInsights.futureProjection.map((item) => (
              <Card key={item} className="goal-card" tone="soft">
                <CardContent>
                  <strong>Projected outcome</strong>
                  <p>{item}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="goal-card" tone="soft">
              <CardContent>
                <strong>Micro-wins the AI respects</strong>
                <p>{behavioralInsights.microWins[0] || "The system will start highlighting small wins as more daily evidence appears."}</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </PanelLayout>

      <Card className="section-card" tone="soft">
        <CardHeader className="section-card-header">
          <SectionHeader title="Privacy and trust" description="Behavioral memory should remain private, editable, and always under user control." />
        </CardHeader>
        <CardContent className="goal-list">
          <Card className="goal-card" tone="soft">
            <CardContent>
              <strong>Private memory only</strong>
              <p>Your emotional memory, routines, and behavioral trends stay inside your workspace and are meant only to improve guidance quality.</p>
            </CardContent>
          </Card>
          <Card className="goal-card" tone="soft">
            <CardContent>
              <strong>Adaptive, not punitive</strong>
              <p>The system is designed to reduce shame-based productivity pressure by simplifying routines when life becomes heavy.</p>
            </CardContent>
          </Card>
          <Card className="goal-card" tone="soft">
            <CardContent>
              <strong>Future-ready architecture</strong>
              <p>
                Cache provider: {adaptiveWorkspace.orchestration.cache.provider} ({adaptiveWorkspace.orchestration.cache.status}) ·
                Vector memory: {adaptiveWorkspace.orchestration.vectorMemory.provider} ({adaptiveWorkspace.orchestration.vectorMemory.status})
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </section>
  );
}

export default PersonalizationTab;
