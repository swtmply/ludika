# @ludika/ui

Shared web UI for `apps/web`. shadcn components over Base UI primitives, Tailwind v4,
Hugeicons for icons.

## Adding a component

Prefer the registry over hand-writing one. Run `shadcn add` **from this directory**,
not from `apps/web` and not from the repo root:

```bash
cd packages/ui && bunx --bun shadcn@latest add <component>
```

Both this package and `apps/web` have a `components.json`, and they resolve the `ui`
alias differently. Running the command from the wrong directory is how a shared
primitive ends up copied into the app.

Then:

1. Check the file landed in `src/components/`.
2. Run `bun run inventory` from the repo root so `docs/inventory.md` lists it.
3. Run `bun run check-types`.

Hand-written components follow the same layout: one file per component in
`src/components/`, kebab-case filename, named exports.

## Rules that keep this package shared

**No app imports and no Next.js-only APIs.** No `next/navigation`, no `next/headers`,
no route handlers. Components take data and callbacks as props; the app does the
routing and fetching. `turbo boundaries` denies a dependency on any app.

**Exports are per-file, not a barrel.** Consumers import
`@ludika/ui/components/button`. There is deliberately no `src/index.ts`: a single
barrel file becomes a permanent merge conflict once several people add components on
parallel branches.

**Styling is Tailwind classes plus `cva` variants.** Use `cn` from
`@ludika/ui/lib/utils` to merge. Use the CSS variables in `src/styles/globals.css`
rather than literal colours, so dark mode works without a second code path.

**Client components need `"use client"`.** Anything with state, effects or event
handlers. Leave it off otherwise so it can render on the server.
