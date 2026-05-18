# Life Guidance Pro Figma Redesign Execution Plan

This document is the continuation plan for the Figma redesign file:

- Figma file: `Life Guidance Pro Redesign`
- File URL: `https://www.figma.com/design/DY7j7ii1C5TpcjQnXMT48i`
- File key: `DY7j7ii1C5TpcjQnXMT48i`

The goal is to continue and complete the redesign once the Figma MCP Starter-plan rate limit resets.

## Redesign Intent

Use the current live app structure as the source of truth, but redesign the product into a premium, implementation-friendly AI SaaS experience with:

- dark futuristic UI
- calm wellness/productivity tone
- Linear + Apple + Arc + Notion influence
- glassmorphism and soft gradients
- reusable components
- mobile-first responsive layouts
- lower cognitive load
- realistic React/Vite implementation feasibility

This is not a random concept pass. The Figma file should map directly back to:

- landing page
- login / onboarding
- dashboard shell
- planner wizard
- AI result panel
- insights / analytics rail
- settings / profile
- mobile navigation and mobile dashboards

## Live App Architecture Reference

Use these files as the structural reference:

- `C:\Users\User\Downloads\projects\life-guidance-pro\src\App.jsx`
- `C:\Users\User\Downloads\projects\life-guidance-pro\src\pages\Landing.jsx`
- `C:\Users\User\Downloads\projects\life-guidance-pro\src\components\Login.jsx`
- `C:\Users\User\Downloads\projects\life-guidance-pro\src\components\Dashboard.jsx`
- `C:\Users\User\Downloads\projects\life-guidance-pro\src\components\dashboard\PlannerTab.jsx`
- `C:\Users\User\Downloads\projects\life-guidance-pro\src\components\dashboard\ResultPanel.jsx`

## Figma File Structure

Because the file is on the Starter plan, keep the file to **three pages**:

1. `00 System`
2. `10 Desktop`
3. `11 Mobile`

Do not split into more pages unless plan limits change.

## Page 1: 00 System

This page should contain both foundations and reusable components.

### Foundations

#### Color System

Use a dark adaptive palette:

- `bg0` `#08111F`
- `bg1` `#0D172A`
- `bg2` `#12213A`
- `surface` `#101B31`
- `surface2` `#13233F`
- `glass` `#182743`
- `border` `#284165`
- `text` `#F6FAFF`
- `text2` `#B6C6E3`
- `text3` `#7F93B7`
- `cyan` `#65E6FF`
- `blue` `#4F8CFF`
- `violet` `#8E7DFF`
- `teal` `#3DD7C0`
- `success` `#59E3AE`
- `warning` `#FFB45C`
- `danger` `#FF7A9E`

#### Typography

Use:

- display serif: `Instrument Serif`
- UI sans: `Inter`
- optional accent/meta: `DM Sans`

Suggested scale:

- Hero: `56 / 64`
- Display: `40 / 48`
- H2: `28 / 36`
- H3: `22 / 30`
- Body: `16 / 28`
- Meta: `13 / 18`

#### Surface Rules

- panel radius: `24–28`
- chip/button radius: `999`
- glass fill opacity: `0.78–0.9`
- border opacity: `0.35–0.55`
- strong shadow only on hero and key panels
- background blur on premium panels only

### Core Components

Create reusable components for:

- `Button / Primary`
- `Button / Secondary`
- `Button / Ghost`
- `Chip / Status`
- `Chip / Filter`
- `Metric Card`
- `Insight Card`
- `Panel / Standard`
- `Panel / AI Result`
- `Sidebar Item / Default`
- `Sidebar Item / Active`
- `Topbar Search`
- `Planner Step Card`
- `Accordion Section`
- `Result Section Card`
- `Check-in Signal Card`
- `Mobile Nav Chip`

## Page 2: 10 Desktop

This page should hold the desktop layouts.

### Frame Set 1: Landing Page

Create a full desktop landing page with these sections in order:

1. Hero
2. Who this is for
3. How AI works
4. AI memory
5. Hobby to income engine
6. Daily AI check-ins
7. Life balance analytics
8. Interactive demo
9. Real user journeys
10. Trust and safety
11. Final CTA

#### Hero Composition

Left:

- eyebrow
- large headline
- supporting copy
- 3 CTAs
- 3 metric cards

Right:

- adaptive roadmap preview
- 3 timeline cards
- 2 AI insight notes

#### Audience Section

Use a 3-column card grid for:

- Students
- Employees
- Freelancers
- Creators
- People feeling lost
- Burned-out individuals

#### How AI Works

Use a 5-step horizontal or 2x3 modular grid:

- user inputs
- pattern analysis
- adaptive plan generation
- daily feedback
- dynamic adaptation

#### AI Memory

Use stacked insight cards with high-value summaries, not long paragraphs.

#### Hobby to Income

Use a roadmap strip:

- Beginner
- Practice system
- Skill growth
- Portfolio
- Income path

#### Check-in Section

Use signal cards + one adaptive explanation panel.

#### Analytics Section

Use 4 metric cards + one mini trend/heatmap style block.

#### Demo Section

Tabbed demo shell:

- Student mode
- Employee mode
- Creator mode

#### Journeys Section

Use 3 story cards with progression structure:

- before
- what AI changed
- outcome

#### Trust Section

3 trust cards:

- user control
- supportive guidance only
- private adaptive planning

### Frame Set 2: Login / Onboarding

Create desktop auth/onboarding frame:

Left side:

- onboarding story
- trust signals
- 5 setup stages
- AI personality selector

Right side:

- auth card
- login/signup toggle
- email/password fields
- primary CTA
- Google CTA
- helper actions

### Frame Set 3: Dashboard Shell

Create the main dashboard shell:

#### Left Sidebar

Include grouped navigation matching the live product:

- Workspace
- Intelligence
- Memory

Required visible items:

- Planner
- Goals
- Habits
- Daily Progress
- Weekly Progress
- Review
- Monthly
- Career
- Income
- Routine
- AI Coach
- Insights
- History
- Profile
- Feedback
- Reminders
- Support
- Settings

#### Top Header

Include:

- page title
- description
- search
- quick add action
- streak chip
- focus mode
- user email
- logout

#### Hero Band

Two cards:

- adaptive life operating system summary
- AI guidance pulse

### Frame Set 4: Planner Workspace

Use the dashboard shell and show the planner tab active.

Center layout:

- step strip
- onboarding progress hero
- 4 accordion steps
- consent
- planner submit block

Right:

- result loading state
- or result empty state

Planner steps:

1. Reality & Routine
2. Pressure & Goals
3. Energy & Interests
4. Guidance Preferences

### Frame Set 5: Result Experience

Use the same shell with a generated result visible.

Result panel must include:

- title and saved timestamp
- sticky action toolbar
- reward summary strip
- summary cards:
  - Key shifts
  - Today’s focus
  - Next 7 days
  - Longer horizon
- daily check-in section
- recent wins section
- plan outline chips
- collapsible result section cards
- adjust this plan panel

### Frame Set 6: Insights / Analytics

Create a dedicated insight-heavy dashboard view:

- left nav active on `Insights`
- center:
  - behavioral pattern summaries
  - adaptive recommendation cards
  - burnout risk block
  - memory cards
  - future projections
- right rail:
  - progress widget
  - analytics chart
  - privacy/control card

### Frame Set 7: Profile / Settings

Create one desktop frame for profile and one for settings.

Profile:

- personal context
- routine style
- stress / vision / goals
- planner bridge CTA

Settings:

- account
- export
- privacy
- reminders
- delete data action

## Page 3: 11 Mobile

This page should hold mobile-first versions of the most important flows.

Create mobile frames at `390 x 844`.

### Required Mobile Frames

1. Landing hero
2. Landing progressive sections view
3. Login / onboarding
4. Dashboard shell with mobile chips
5. Planner mobile flow
6. Result mobile flow
7. Insights mobile rail collapsed into cards
8. Settings / profile mobile

### Mobile Rules

- reduce hero height
- reduce glow intensity
- use horizontal chip rails instead of dense grids
- one dominant card at a time
- planner sections must feel guided, not endless
- result sections must be readable with clear spacing
- keep thumb-friendly CTAs

### Mobile Navigation Pattern

Use:

- top app bar
- horizontal quick nav chip row
- collapsible/intelligent insight summaries

Do not make the right rail fully stack as a huge endless sidebar.

## Visual Principles

### Keep

- calm futuristic atmosphere
- dark glass UI
- blue / cyan / violet accents
- premium SaaS feel
- emotionally supportive tone

### Avoid

- random concept shapes
- extreme glow
- muddy purple overload
- large empty dead zones
- equal emphasis on every card
- unrealistic Dribbble-only layouts

## Figma Build Order Once MCP Limit Resets

1. Finish `00 System`
   - color blocks
   - type scale
   - reusable components
2. Build `10 Desktop`
   - landing
   - auth
   - dashboard shell
   - planner
   - results
   - insights
   - profile/settings
3. Build `11 Mobile`
   - landing mobile
   - auth mobile
   - dashboard mobile
   - planner mobile
   - result mobile
   - settings/profile mobile
4. Final polish
   - align spacing
   - align card radii
   - make CTAs consistent
   - verify component reuse

## Notes For Implementation Feasibility

The redesign should remain easy to map back to the current React/Vite codebase:

- avoid impossible layouts
- use consistent card and panel logic
- respect current route structure
- keep planner/result relationship intact
- keep dashboard shell realistic for responsive implementation

## Completion Standard

The Figma redesign is complete when:

- all major product flows exist in desktop and mobile form
- the file contains reusable system components
- the layouts clearly map to the live app
- the visual language is consistent across landing, onboarding, dashboard, planner, results, insights, and settings
- the result feels implementation-ready, not speculative

