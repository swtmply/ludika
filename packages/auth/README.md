# Auth package

The shared Better Auth configuration. It connects Better Auth to the Drizzle database and enables the Expo plugin for the mobile apps.

## Key files

- `src/index.ts` creates and exports `auth`, and exports `createAuth`.
- `tsdown.config.ts` and `package.json` define the package build.
- `tsconfig.json` extends `@ludika/config/tsconfig.base.json`.

Edit `src/index.ts` when changing providers, trusted origins, cookies, or auth options. Keep server secrets in `apps/server/.env`. If you change an exported function or add a public entry file, update the package exports and its consumers. Remove imports and configuration references before deleting code.

The server imports `@ludika/auth`. App auth clients live in each app and use the server URL, so a server auth change may need checks in web and mobile sign-in flows.

## Dependencies and commands


For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run build

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
