# API package

The shared tRPC API layer. It defines the request context, procedures, and routers consumed by the server and client apps.

## Key files

- `src/index.ts` creates the tRPC instance and public and protected procedures.
- `src/context.ts` builds a request context and reads the current auth session.
- `src/routers/index.ts` registers the app router and exports `AppRouter`.
- `src/routers/todo.ts` contains the todo procedures.
- `tsdown.config.ts` and `package.json` define the package build.

Add a router under `src/routers/`, then register it in `src/routers/index.ts`. Add input validation beside the procedure with Zod. Remove its registration and imports before deleting a router. The package exports its root entry and wildcard `.ts` entries, so consumers use imports such as `@ludika/api/context` and `@ludika/api/routers/index`.

The package depends on `@ludika/auth`, `@ludika/db`, and `@ludika/env`. Keep database work in `@ludika/db` and authentication setup in `@ludika/auth`.

## Dependencies and commands


For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run build

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
