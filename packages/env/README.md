# Environment package

Typed environment validation for server, Next.js, and Expo code. It keeps variable names and validation rules in one place.

## Key files

- `src/server.ts` validates server variables, including `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `CORS_ORIGIN`.
- `src/web.ts` validates `NEXT_PUBLIC_SERVER_URL`.
- `src/native.ts` validates `EXPO_PUBLIC_SERVER_URL`.
- `tsdown.config.ts` and `package.json` define the package build.

When adding or renaming a variable, update the schema and `runtimeEnv` mapping in the same file. Then update the matching app `.env` file and all consumers. When deleting a variable, remove its reads first. The package exports `@ludika/env/server`, `@ludika/env/web`, and `@ludika/env/native`. Do not put secrets in this package or commit local environment files.

## Dependencies and commands


For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run build

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
