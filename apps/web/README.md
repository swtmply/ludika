# Web

The Next.js web app. It runs on port 3001 and talks to the server through tRPC.

## Key files

- `src/app/` contains layouts, pages, and route folders.
- `src/components/` contains web UI used by more than one route.
- `src/lib/auth-client.ts` configures the Better Auth client.
- `src/utils/trpc.ts` creates the tRPC client.
- `src/index.css` contains app-wide CSS.
- `.env` must define `NEXT_PUBLIC_SERVER_URL`.
- `next.config.ts`, `components.json`, and `postcss.config.mjs` hold framework and styling configuration.

Add a route under `src/app/`, or a reusable web component under `src/components/`. Remove imports and links before deleting a page or component. Shared web primitives belong in `packages/ui`, not in an app route. Update `@ludika/ui` exports before importing a new package entry point.

The app imports `@ludika/api`, `@ludika/env/web`, and `@ludika/ui`. The root `bun run dev:web` starts this app and the server. From here, `bun run dev`, `bun run build`, and `bun run start` run the local Next.js commands.

## Dependencies and commands

For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run dev
    bun run build
    bun run start

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
