---
description: Life Guidance Pro project coding standards and development workflow.
applyTo: "**"
---

# Life Guidance Pro – AI Workspace Instructions

## Project Stack

- React + Vite
- Firebase Authentication
- Firestore
- Node.js / Express backend
- CSS modules and custom styles
- Vitest for unit testing
- Playwright for E2E testing

---

## Coding Principles

- Prefer reusable components over duplicated code.
- Never rewrite working features without a clear reason.
- Keep files modular.
- Prefer hooks for reusable logic.
- Follow existing project structure before creating new folders.
- Keep components small and focused.

---

## Architecture

When adding new features:

- Reuse existing UI components whenever possible.
- Reuse Loading components.
- Reuse Feedback components.
- Reuse existing hooks.
- Avoid duplicate business logic.

---

## Performance

Prefer:

- useMemo
- useCallback
- lazy loading
- React.memo where appropriate

Avoid unnecessary rerenders.

---

## Security

Never expose:

- Firebase Admin keys
- API secrets
- Service account credentials

Always validate server requests.

Never bypass authentication.

---

## Testing

Before considering a task complete always run:

npm run lint

npm run build

When appropriate also run:

npm run test

npm run test:e2e

Do not mark work complete if lint or build fails.

---

## Git Workflow

Always work using feature branches.

Workflow:

main
↓

feature/task-xxx

↓

Commit

↓

Push

↓

Pull Request

↓

Merge

↓

Delete branch

Never commit directly to main.

---

## Pull Requests

Each PR should include:

- Summary
- Files changed
- Validation
- Notes

---

## Code Style

Prefer readable code.

Use descriptive variable names.

Avoid large functions.

Comment only when necessary.

Keep imports organized.

---

## Existing Project Context

The project already contains:

- reusable loading components
- reusable feedback components
- DashboardShell
- DashboardTabRouter
- Firebase authentication middleware
- Firestore security rules
- Vitest setup
- Playwright setup

Always integrate with existing systems instead of recreating them.

---

## AI Behaviour

Before writing code:

1. Understand existing implementation.
2. Search for reusable components.
3. Minimize code duplication.
4. Preserve production stability.
5. Explain major architectural decisions.

When unsure, prefer consistency with the existing codebase over introducing a new pattern.