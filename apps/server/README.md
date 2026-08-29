# Server

The Hono API server. It exposes Better Auth at `/api/auth/*`, tRPC at `/trpc/*`, and a health response at `/` on port 3000.

## Key files

- `src/index.ts` creates the Hono app, CORS middleware, auth route, and tRPC route.
- `package.json` contains the server `dev` and `build` commands.
- `.env` must define `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `CORS_ORIGIN`.
- `tsconfig.json` extends `@ludika/config/tsconfig.base.json`.

Most API procedures belong in `packages/api`. Edit `src/index.ts` only for server transport, middleware, or route wiring. Remove a route or middleware registration when deleting its implementation. Keep secrets out of source and commits.

The server imports `@ludika/api`, `@ludika/auth`, `@ludika/db`, and `@ludika/env/server`. Import new package entry points only after adding them to the package's `exports` map.

## Dependencies and commands

For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run dev
    bun run build

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
