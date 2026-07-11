# Git Commits

Use Conventional Commits format for all commits:

```
<type>(<scope>): <short summary>
```

Types: feat, fix, refactor, test, docs, chore, style, perf

Rules:
- Commit in small, logical chunks — one concern per commit.
- No vague messages like "fix stuff" or "update code".

# Angular Development

Follow the Angular and TypeScript best practices below:

@ANGULAR.md

Always scaffold new components, services, directives, pipes, and guards using Angular CLI schematics (`ng generate` / `ng g`, e.g. `ng g c features/photos/photo-card`) rather than hand-writing files from scratch.

# Project Structure

- Organize by feature, not by type: `src/app/{core,shared,features}`
  - `core/` — app-wide singletons: root-registered state, root-level providers, things instantiated once for the whole app
  - `shared/` — reusable, presentational building blocks used by 2+ features (UI wrapper components, pipes, directives with no feature-specific logic)
  - `features/<feature-name>/` — one folder per domain feature, colocating that feature's components, NgRx slice files, and routes
- Do NOT create type-based subfolders (`components/`, `services/`, `directives/`) inside a feature or at the app root — colocate a component's `.ts`/`.html`/`.scss`/`.spec.ts` together
