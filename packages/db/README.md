# Database package

The shared Drizzle database client, schema, and migrations for PostgreSQL.

## Key files

- `src/index.ts` creates the database connection from `DATABASE_URL` and exports `db` and `createDb`.
- `src/schema/` contains the Drizzle table definitions.
- `src/schema/index.ts` re-exports schema modules.
- Drizzle generates migration files under `src/migrations/`.
- `drizzle.config.ts` reads `apps/server/.env` and configures Drizzle Kit.
- `tsdown.config.ts` and `package.json` define the package build and database commands.

Add a table in `src/schema/`, export it from the relevant index file, then generate or apply the database change with the Drizzle commands in `package.json`. Treat migration files as generated history. Do not delete a migration that has been applied to a shared database. Remove consumers and schema exports before deleting a table definition.

The package exports its root entry and wildcard entries, so API code can import `@ludika/db` or `@ludika/db/schema/todo`. It requires `DATABASE_URL` in `apps/server/.env`.

## Dependencies and commands

For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run db:push
    bun run db:generate
    bun run db:migrate
    bun run db:studio
    bun run build

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
