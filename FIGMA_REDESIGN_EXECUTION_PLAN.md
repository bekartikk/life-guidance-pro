# Life Guidance Pro Redesign System Spec

This document is the Figma-ready continuation pack for the Life Guidance Pro redesign while the live Figma MCP bridge is unavailable.

- Product: `Life Guidance Pro`
- Source of truth app: `https://life-guidance-pro.vercel.app`
- Existing Figma file: `Life Guidance Pro Redesign`
- Figma URL: `https://www.figma.com/design/DY7j7ii1C5TpcjQnXMT48i`
- Intended use: manual Figma implementation, implementation planning, design QA, and React/Tailwind mapping

This is not concept art. It is a production-grade UI system spec that preserves the current product structure:

- React + Vite frontend
- Firebase Auth + Firestore primary flow
- Supabase hybrid semantic memory layer
- adaptive AI dashboard, planner, check-ins, insights, and recommendation surfaces

## 1. Product Design Goal

Transform the product from a planner into an adaptive AI life operating system that feels:

- emotionally calm
- premium and futuristic
- practical rather than decorative
- intelligent and deeply personalized
- implementation-feasible in the current codebase

Primary design influences:

- Apple: restraint, spaciousness, polished surfaces
- Linear: sharp hierarchy, workflow clarity, dense information made readable
- Notion: calm structure, clear blocks, non-threatening layout rhythm
- Perplexity: intelligence-forward cards, clean signal grouping, useful summaries

## 2. Design Principles

1. Calm first:
   the UI should reduce emotional pressure rather than amplify it.

2. Intelligence visible, not noisy:
   adaptive guidance should appear as confident summaries, signals, and next actions, not walls of AI text.

3. One primary action per surface:
   each panel should have a clear job.

4. Dense but breathable:
   the dashboard can contain a lot of information, but spacing and grouping must prevent cognitive overload.

5. Mobile is guided, not compressed:
   mobile screens should prioritize one strong card or section at a time.

6. Component discipline:
   all major UI should be assembled from repeatable primitives, not one-off compositions.

## 3. Figma File Structure

Keep the file to these three pages:

1. `00 System`
2. `10 Desktop`
3. `11 Mobile`

Inside each page, use section labels and frame naming with the format:

- `Foundation / Colors`
- `Foundation / Typography`
- `Component / Sidebar Item / Active`
- `Desktop / Dashboard / Planner`
- `Mobile / Dashboard / Insights`

## 4. Foundations

### 4.1 Typography Scale

Use:

- `Instrument Serif` for emotional display moments only
- `Inter` for all product UI, forms, nav, cards, data, labels
- optional `DM Sans` only if needed for small meta tags; otherwise keep `Inter` everywhere

#### Type Roles

| Role | Font | Size / Line | Weight | Use |
|---|---|---:|---:|---|
| Display XL | Instrument Serif | 64 / 68 | 400 | landing hero desktop only |
| Display L | Instrument Serif | 48 / 54 | 400 | major hero, section openers |
| Heading 1 | Inter | 32 / 40 | 700 | dashboard hero titles, auth titles |
| Heading 2 | Inter | 24 / 32 | 700 | section titles, planner/result blocks |
| Heading 3 | Inter | 20 / 28 | 600 | card titles, surface headings |
| Heading 4 | Inter | 18 / 26 | 600 | sub-panels |
| Body L | Inter | 16 / 26 | 400 | core paragraphs |
| Body M | Inter | 15 / 24 | 400 | standard card body |
| Body S | Inter | 14 / 20 | 400 | compact UI text |
| Label L | Inter | 13 / 18 | 600 | buttons, chips, filter labels |
| Label S | Inter | 12 / 16 | 600 | eyebrow, meta, tab counters |
| Mono Meta | Inter | 12 / 16 | 500 | optional stats or machine-like tags |

#### Typography Rules

- no negative letter spacing
- no viewport-based font scaling
- use serif only for emotional or aspirational headers
- all dashboard/product surfaces stay in sans
- keep paragraph width between `44ch` and `68ch`

### 4.2 Spacing System

Base unit: `4`

Token scale:

- `space-1` = 4
- `space-2` = 8
- `space-3` = 12
- `space-4` = 16
- `space-5` = 20
- `space-6` = 24
- `space-7` = 28
- `space-8` = 32
- `space-10` = 40
- `space-12` = 48
- `space-16` = 64
- `space-20` = 80
- `space-24` = 96

Usage guidance:

- panel internal padding: `24` desktop, `20` tablet, `16` mobile
- major section gap: `32` desktop, `24` mobile
- card grid gap: `20` desktop, `16` mobile
- text stack gap:
  - title to body: `8`
  - eyebrow to title: `10`
  - label to field: `8`

### 4.3 Grid System

#### Desktop

- frame width: `1440`
- outer margins: `64`
- content max width: `1312`
- grid: `12 columns`
- gutter: `24`
- primary dashboard split:
  - left nav: `264`
  - center workspace: flexible, target `min 640`
  - right rail: `320`

#### Tablet

- frame width: `1024`
- outer margins: `32`
- grid: `8 columns`
- gutter: `20`

#### Mobile

- frame width: `390`
- safe content width: `358`
- outer margins: `16`
- grid: `4 columns`
- gutter: `12`

### 4.4 Radius System

- `radius-1` = 6
- `radius-2` = 8
- `radius-3` = 12
- `radius-4` = 16
- `radius-5` = 20
- `radius-6` = 24
- `radius-pill` = 999

Usage:

- button/input/chip: `8`
- small cards: `12`
- standard panels: `16`
- hero / premium shells: `20`
- modal / auth card / dashboard hero: `24`

### 4.5 Elevation + Shadow System

Use shadows sparingly. Depth comes from fill, border, blur, and contrast first.

- `shadow-none`
- `shadow-soft`:
  - `0 8 24 rgba(3, 8, 20, 0.18)`
- `shadow-panel`:
  - `0 18 48 rgba(3, 8, 20, 0.24)`
- `shadow-hero`:
  - `0 24 64 rgba(5, 16, 38, 0.32)`
- `shadow-glow-cyan`:
  - outer soft glow for focused AI cards only

Rules:

- avoid stacking multiple heavy shadows
- no hero-card-inside-hero-card nesting
- only one glow source per section

### 4.6 Motion Rules

Motion style: subtle, smooth, informational

- duration fast: `160ms`
- duration standard: `220ms`
- duration calm: `320ms`
- easing:
  - standard: `cubic-bezier(0.22, 1, 0.36, 1)`
  - fade: `ease-out`

Allowed motion:

- fade + 8px translate on cards
- tab/content crossfade
- expanding accordion height
- number shimmer / loading pulse
- bottom-nav chip active state

Avoid:

- bouncing
- dramatic scaling
- decorative looping animations
- blur-heavy transitions on low-end mobile

### 4.7 Dark Theme Tokens

#### Base Tokens

- `bg.app` = `#08111F`
- `bg.canvas` = `#0B1528`
- `bg.section` = `#0F1B31`
- `bg.panel` = `#13213B`
- `bg.panel-2` = `#162843`
- `bg.panel-3` = `#1A2D49`
- `bg.overlay` = `rgba(6, 12, 24, 0.72)`
- `bg.glass` = `rgba(19, 33, 59, 0.74)`

- `border.default` = `rgba(124, 156, 204, 0.20)`
- `border.strong` = `rgba(134, 176, 236, 0.34)`
- `border.focus` = `rgba(101, 230, 255, 0.62)`

- `text.primary` = `#F4F8FF`
- `text.secondary` = `#BCCBE7`
- `text.tertiary` = `#8093B7`
- `text.inverse` = `#07111E`

#### Accent Tokens

- `accent.cyan` = `#65E6FF`
- `accent.blue` = `#4F8CFF`
- `accent.violet` = `#8C7BFF`
- `accent.teal` = `#38D6C0`

#### Semantic Tokens

- `state.success` = `#59E3AE`
- `state.warning` = `#FFB45C`
- `state.danger` = `#FF7A9E`
- `state.info` = `#7BB9FF`

#### AI Semantic Tokens

- `ai.focus` = `#65E6FF`
- `ai.recovery` = `#6ED5B8`
- `ai.growth` = `#89A3FF`
- `ai.career` = `#FFB66B`
- `ai.memory` = `#A38DFF`
- `ai.burnout` = `#FF8FA8`

### 4.8 Glassmorphism Rules

Use glass only on:

- dashboard hero cards
- auth shell card
- selected adaptive insight cards
- top navigation/shell surfaces

Glass recipe:

- fill: `bg.glass`
- blur: `16`
- border: `1px border.default`
- shadow: `shadow-panel`

Avoid glass on:

- form-heavy inner cards
- dense tables
- charts where contrast matters
- every card in a list

### 4.9 AI Insight Card Styling System

There are four AI card classes:

1. `Signal Card`
   - compact
   - one label, one metric, one supporting sentence

2. `Interpretation Card`
   - “what the system sees”
   - one strong headline
   - one summary sentence
   - 2-3 bullets max

3. `Recommendation Card`
   - prioritized action
   - includes urgency/state chip
   - one CTA

4. `Memory Card`
   - references prior pattern or remembered behavior
   - contains “trigger”, “pattern”, “next move”

## 5. Reusable Component Specifications

### 5.1 Navbar

Desktop navbar:

- height: `72`
- left: brand mark + wordmark
- center: primary anchors on landing only
- right: secondary action + primary CTA
- sticky with slight glass effect on scroll

States:

- default
- scrolled
- auth context hidden links

Tailwind mapping:

- wrapper: `h-[72px] px-6 lg:px-10 flex items-center justify-between`
- shell: `backdrop-blur-xl bg-[rgba(11,21,40,.72)] border border-white/10`

### 5.2 Sidebar

Desktop dashboard sidebar:

- width expanded: `264`
- width collapsed: `88`
- top: brand, collapse button
- grouped sections:
  - Workspace
  - Intelligence
  - Memory
- footer: account/status area

Item anatomy:

- icon 18
- label
- optional badge
- active left glow rail or soft active pill

### 5.3 Mobile Navigation

Use two layers:

1. top app bar
2. bottom nav for 4 primary destinations:
   - Planner
   - Daily
   - Insights
   - Settings

Optional third layer:

- horizontal quick-chip rail for sub-views

Rules:

- no more than 4 bottom items
- bottom bar height: `72`
- icons + short labels only

### 5.4 Adaptive Insight Cards

Variants:

- `Today Focus`
- `Momentum`
- `Burnout Risk`
- `Recovery Suggestion`
- `Cognitive Load`
- `Weekly Pattern`
- `Memory Recall`

Structure:

- eyebrow
- title
- primary metric or sentence
- 1 supporting line
- optional CTA/link

### 5.5 Planner Cards

Used in:

- planner tab
- goal/habit builders
- routine setup

Anatomy:

- section number
- heading
- supporting sentence
- grouped fields
- sticky save/generate action at bottom for long flows

### 5.6 Recommendation Modules

Two types:

- inline recommendation strip
- stacked recommendation panel

Fields:

- recommendation title
- reasoning
- urgency/state chip
- next action

### 5.7 AI Conversation Surfaces

Use for result adjustment and AI coach follow-up.

Structure:

- assistant/user bubbles
- assistant surfaces are slightly elevated and wider
- user bubbles tighter and darker
- bottom composer bar sticky
- supporting context chips above composer

### 5.8 Onboarding Flows

Flow shell:

- left story panel
- right auth/setup card desktop
- full-stack vertical on mobile

Required modules:

- trust signals
- setup step list
- AI personality preview
- credential form
- helper actions

### 5.9 Authentication Surfaces

Card width desktop: `480–520`

Use:

- segmented login/signup switch
- primary form stack
- social auth button
- helper link row
- success/error message strip

### 5.10 Charts and Data Widgets

Charts must be lightweight visually.

Rules:

- use minimal axes
- avoid dense legends
- rely on 1-2 accent colors max
- all widgets need a textual takeaway, not only graphs

Preferred widgets:

- trend sparkline
- compact bar series
- heat strip
- radial progress
- stat delta card

### 5.11 Workspace Mode Selectors

Modes:

- Focus
- Recovery
- Growth
- Career

Component:

- segmented pills desktop
- scrollable chip rail mobile
- active mode also controls subtle tint on adjacent AI panels

### 5.12 Burnout / Risk Indicators

Represent with:

- small meter
- risk label
- one sentence recommendation

Levels:

- Low
- Watch
- Elevated
- Recovery Needed

Do not use alarming red overload everywhere. Reserve danger tone for true high-risk states.

### 5.13 Semantic Memory Surfaces

This is where Supabase-backed semantic memory shows up visually.

Modules:

- memory timeline card
- “remembered pattern” card
- prior recommendation recall card
- behavioral similarity summary card

Anatomy:

- source label
- memory summary
- relevance reason
- optional time anchor

## 6. Desktop Screen Structures

### 6.1 Landing Page

#### Section Order

1. Navbar
2. Hero
3. Audience fit
4. How AI works
5. AI memory engine
6. Hobby to income system
7. Daily check-ins
8. Adaptive analytics
9. Interactive mode demo
10. Outcome journeys
11. Trust and privacy
12. Final CTA
13. Footer

#### Hero Layout

Desktop split: `6 / 6`

Left:

- eyebrow
- H1
- supporting copy
- primary CTA
- secondary CTA
- tertiary ghost CTA
- 3 metrics in row

Right:

- adaptive roadmap mock panel
- stacked intelligence notes
- progress line
- one burnout/risk chip

Spacing:

- hero top padding `96`
- hero bottom padding `72`
- copy stack gap `20`
- CTA gap `12`
- metric card gap `16`

#### Audience Fit

- 3-column grid desktop
- 2-column tablet
- 1-column mobile

Each card:

- icon
- title
- struggle sentence
- support sentence
- outcome sentence

#### How AI Works

Use 4-step or 5-step progressive strip with numbered cards.

Layout:

- horizontal connected modules desktop
- stacked numbered cards mobile

#### AI Memory Section

Layout:

- left explanation block
- right stacked memory cards

Include:

- remembered routines
- burnout cycles
- successful days
- emotional triggers

#### Hobby to Income Section

Use a horizontal roadmap rail.

Each stage:

- label
- summary
- connector line

#### Daily Check-ins Section

Use:

- left phone-style check-in preview
- right explanation and adaptive support card

#### Analytics Section

Layout:

- 4 stat cards on top
- one wide intelligence chart card below
- one textual “what changed” card beside or beneath

#### Interactive Demo

Tabs:

- Student
- Employee
- Creator

Each tab shows:

- persona summary
- sample plan
- adaptive notes

#### Trust and Privacy

3 cards:

- private memory
- user control
- supportive guidance only

#### Tailwind Mapping

- page shell: `bg-[var(--bg-app)] text-[var(--text-primary)]`
- content width: `max-w-[1312px] mx-auto px-4 md:px-8 xl:px-16`
- desktop grids:
  - `grid grid-cols-12 gap-6`
  - `col-span-6`, `col-span-4`, etc.

### 6.2 Onboarding

Screen purpose:

- introduce product
- build trust
- prepare user mentally for AI profile setup

Desktop split:

- left narrative column `5`
- right auth/setup card `7`

Sections:

- onboarding hero statement
- trust signal list
- setup journey card
- AI personality selector
- create account CTA

### 6.3 Auth Flow

Screen purpose:

- log in or sign up with zero friction

Right card content:

- auth mode segmented switch
- title + helper copy
- email field
- password field
- primary submit
- Google sign-in
- password reset action
- message strip

### 6.4 Dashboard

Three-column shell:

- left sidebar: `264`
- center workspace: flexible
- right intelligence rail: `320`

#### Center Hierarchy

1. top header
2. hero summary band
3. workspace panel
4. tab-specific content

#### Right Rail Hierarchy

1. life state card
2. AI intelligence rail
3. adaptive history surface
4. progress widget
5. analytics chart
6. memory engine card
7. future projection card
8. privacy/control card

### 6.5 Planner Workspace

Keep current structure:

- left/center form
- right result surface

Planner form composition:

- section intro banner
- 4 guided sections
- save/continue CTA

Result state variants:

- empty
- loading
- result ready

### 6.6 Adaptive Intelligence Hub

This is the “Insights” heavy dashboard mode.

Sections:

- today’s AI focus
- momentum score
- burnout risk
- recovery suggestion
- cognitive load
- weekly pattern
- semantic memory recap
- adaptive recommendation history

### 6.7 Memory / History Timeline

Screen purpose:

- show saved plans
- show semantic memory recalls
- show behavioral evolution

Layout:

- left timeline/list
- right detail card

### 6.8 Analytics Surfaces

Use a dedicated screen with:

- productivity trend
- mood/energy trend
- stress accumulation
- recovery improvement
- momentum history
- behavioral summary callouts

### 6.9 Settings / Profile

Profile:

- personal identity and role
- goals and interests
- routine style
- stress and long-term vision

Settings:

- reminders
- account
- export
- privacy
- delete data

### 6.10 AI Recommendation Center

Dedicated recommendation screen:

- pinned highest-priority recommendation
- grouped modules:
  - Recovery
  - Focus
  - Growth
  - Career
- recommendation history
- “why this is suggested” explanatory drawer/card

## 7. Mobile Redesign Specs

### 7.1 Global Mobile Rules

- frame: `390 x 844`
- fixed top bar
- fixed bottom nav
- chip rail optional below top bar
- max one dominant pane visible at a time
- avoid 3-column density
- convert right rail into sequential cards

### 7.2 Mobile Landing

Order:

- hero
- CTA
- mobile section dock
- one collapsible section at a time
- trust CTA footer

Rules:

- hero headline max 4 lines
- only one visual mock surface above fold
- metric cards scroll horizontally or stack 1-by-1

### 7.3 Mobile Onboarding/Auth

Stack order:

1. back link
2. product story
3. trust items
4. personality preview
5. auth card

Use tighter spacing:

- outer padding `16`
- card padding `16`
- section gap `20`

### 7.4 Mobile Dashboard

Hierarchy:

1. top app bar
2. quick summary hero
3. quick chip nav
4. active content card
5. adaptive insight cards
6. bottom nav

Rules:

- planner remains primary default
- charts deferred unless opened from daily/insights
- use skeletons in slow surfaces

### 7.5 Mobile Planner

Structure:

- sticky progress indicator
- accordion sections
- sticky CTA footer
- result panel appears below or in separate slide-up panel

### 7.6 Mobile Result

Sections:

- summary header
- key shifts
- today’s focus
- next 7 days
- longer horizon
- daily check-in
- adjust plan

Each section collapsible after first read.

### 7.7 Mobile Insights

Transform right rail into:

- one stacked card feed
- no side rail behavior
- cards ordered by urgency:
  - focus
  - burnout
  - recovery
  - momentum
  - memory
  - projections

### 7.8 Mobile Settings/Profile

Use grouped sections with sticky save button on profile edits.

## 8. Responsive Behavior Rules

### Breakpoints

- mobile: `< 640`
- tablet: `640–1023`
- desktop: `1024+`
- wide desktop: `1280+`

### Transform Rules

- desktop 3-column dashboard -> tablet 2-column -> mobile stacked
- landing multi-card rows -> horizontal scroll or single-column stack
- right rail -> stacked insight sequence
- sidebar -> slide-over or condensed chip nav on tablet/mobile

### Priority Rules

If space is tight, preserve in this order:

1. primary action
2. current state summary
3. active working surface
4. secondary insights
5. historical/reference content

## 9. Tailwind Implementation Mapping

### Shell Tokens

Implement token mapping in Tailwind or CSS variables:

```css
:root {
  --bg-app: #08111F;
  --bg-panel: #13213B;
  --bg-glass: rgba(19, 33, 59, 0.74);
  --border-default: rgba(124, 156, 204, 0.20);
  --text-primary: #F4F8FF;
  --text-secondary: #BCCBE7;
  --accent-cyan: #65E6FF;
  --accent-violet: #8C7BFF;
  --state-danger: #FF7A9E;
}
```

### Common Tailwind Recipes

Panel:

```txt
rounded-2xl border border-white/10 bg-[rgba(19,33,59,.74)] backdrop-blur-xl shadow-[0_18px_48px_rgba(3,8,20,.24)]
```

Standard card:

```txt
rounded-2xl bg-slate-900/70 border border-white/10 p-5
```

Hero shell:

```txt
rounded-[24px] border border-cyan-300/15 bg-[linear-gradient(135deg,rgba(19,33,59,.92),rgba(11,21,40,.92))] shadow-[0_24px_64px_rgba(5,16,38,.32)]
```

Active chip:

```txt
inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-[13px] font-semibold text-cyan-100
```

### Component Hierarchy Mapping

- `Dashboard shell`
  - `Sidebar`
  - `Header`
  - `Hero summary`
  - `PlannerBoard`
  - `ResultPanel`
  - `AdaptiveIntelligenceRail`
  - `AdaptiveHistorySurface`
  - `ProgressWidget`
  - `AnalyticsChart`

- `Landing`
  - `Navbar`
  - `Hero`
  - `Audience cards`
  - `Workflow steps`
  - `Memory section`
  - `Income roadmap`
  - `Check-in section`
  - `Analytics section`
  - `Demo tabs`
  - `Trust cards`

## 10. Interaction Notes

### Dashboard

- sidebar hover = subtle fill only
- active nav = stronger fill + icon tint
- AI cards can expand inline, not modal by default
- quick add opens centered modal desktop, bottom sheet mobile

### Planner

- opening a section should scroll it into comfortable view
- generation state uses calm pulse and staged skeletons
- result cards can collapse but summary cards stay visible

### AI Recommendations

- recommendation cards should expose:
  - why
  - urgency
  - what to do next

### Memory Surfaces

- memory entries should never look like error logs
- they should read like helpful remembered patterns

## 11. Figma Build Order

1. `00 System / Foundations`
2. `00 System / Components`
3. `10 Desktop / Dashboard Shell`
4. `10 Desktop / Planner + Result`
5. `10 Desktop / Landing`
6. `10 Desktop / Auth + Onboarding`
7. `10 Desktop / Insights + Memory + Analytics`
8. `10 Desktop / Settings + Recommendation Center`
9. `11 Mobile / Dashboard`
10. `11 Mobile / Planner`
11. `11 Mobile / Result`
12. `11 Mobile / Landing + Auth + Settings`

## 12. Completion Standard

The redesign spec is complete when:

- every major surface has a defined layout
- every major repeated surface has a reusable component spec
- spacing, type, and color decisions are unambiguous
- mobile behavior is explicit rather than implied
- Tailwind/component mapping is clear enough for direct implementation
- the output still respects the existing app architecture and product identity

## 13. Immediate Implementation Priorities

If design-to-code work starts before full Figma reconstruction, prioritize these surfaces first:

1. Dashboard shell
2. Planner workspace
3. Result panel
4. AI insight rail
5. Mobile dashboard shell
6. Auth/onboarding shell
7. Landing page cleanup

