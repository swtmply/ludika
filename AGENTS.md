# Ludika

Bun workspace monorepo. Two Expo apps, a Hono + tRPC server, a Next.js web app, shared packages.

## Where code lives

| Workspace                                  | What it is                  | UI comes from                                |
| ------------------------------------------ | --------------------------- | -------------------------------------------- |
| `apps/ludika-client`, `apps/ludika-driver` | Expo + expo-router          | `@ludika/mobile-ui` (HeroUI Native, Uniwind) |
| `apps/web`                                 | Next.js                     | `@ludika/ui` (shadcn, Base UI, Tailwind v4)  |
| `apps/server`                              | Hono + tRPC                 | n/a                                          |
| `packages/api`                             | tRPC routers                | n/a                                          |
| `packages/db`                              | Drizzle schema + migrations | n/a                                          |
| `packages/auth`                            | Better Auth server config   | n/a                                          |
| `packages/env`                             | Validated env, per target   | n/a                                          |

Icons are Hugeicons everywhere: `@hugeicons/react-native` on mobile, `@hugeicons/react` on web.

## Before you create a component

1. **Read `docs/inventory.md`** - every shared component, hook and helper, with its
   import path. It is generated; run `bun run inventory` after adding one.
2. If something there fits, use it. If it nearly fits, extend it **in its package**.
   Never copy a shared component into an app to tweak it.
3. Put it in a package, not an app, when any of these are true: a second app would
   want it; it has no app-specific data or navigation in it; its name is generic
   (`Container`, `Button`, `EmptyState`). Otherwise it is app-local, and moves to a
   package the moment a second caller appears.
4. Never import from another app, and never reach into another package's `src/`.
   `turbo boundaries` enforces both.

`bun run dupes` reports files duplicated across workspaces. Run it if you suspect
you just rebuilt something that already existed.

## Naming

Use the terms defined in `CONTEXT.md`. If the concept you need is not there, add it
there first - a component named after a term nobody else uses is a duplicate that no
search will find.

## Checks

Run `bun run check` before handing work back. It is the same set CI runs on a PR:

| Command                | Checks                                                 |
| ---------------------- | ------------------------------------------------------ |
| `bun run format:check` | oxfmt formatting                                       |
| `bun run lint`         | oxlint, repo-wide (there is no per-package lint task)  |
| `bun run check-types`  | `tsc` in every workspace, via turbo                    |
| `bun run boundaries`   | dependency and import rules between workspaces         |
| `bun run dupes`        | cross-workspace duplication (report only, never fails) |

Adding a dependency used by two or more workspaces? Put it in the root
`workspaces.catalog` and reference it as `"catalog:"`, so versions cannot drift.

## Agent skills

Skills live in `.claude/skills` (mirrored to `.agents/skills`). Those with
`disable-model-invocation: true` only run when a human types `/<name>` - notably
`/pr`, `/implement`, `/to-spec`, `/to-tickets`, `/triage`, `/ask-matt`.

`/pr` writes the PR description (overview, what, why, how, risk) from the diff and the
linked issue, then opens it. There is no PR template; the skill is the template.

### Issue tracker

Issues are tracked in this repository's GitHub Issues. See `docs/agents/issue-tracker.md`.

### Triage labels

Triage uses the five default label names. See `docs/agents/triage-labels.md`.

### Domain docs

Domain documentation uses the single-context layout. See `docs/agents/domain.md`.
