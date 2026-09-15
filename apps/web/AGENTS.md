<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# apps/web

Next.js app. UI comes from `@ludika/ui` (shadcn + Base UI + Tailwind v4); check
`docs/inventory.md` before building a component, and read `packages/ui/AGENTS.md`
before adding one to the shared package.

Keep app-local components in `src/components/` only while they carry this app's data
or routing. Anything generic belongs in `@ludika/ui` - see the promotion rule in the
root `AGENTS.md`.

Run `shadcn add` from `packages/ui`, not from here: both directories have a
`components.json` and they resolve the `ui` alias to different places.
