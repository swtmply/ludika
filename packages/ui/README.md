# UI package

Shared web UI primitives, utility functions, and styles for the Next.js app.

## Key files

- `src/components/` contains shared React components, including shadcn-based primitives.
- `src/lib/utils.ts` exports the `cn` class-name helper.
- New shared hooks belong in `src/hooks/`.
- `src/styles/globals.css` contains shared Tailwind and design styles.
- `components.json`, `postcss.config.mjs`, and `tsconfig.json` configure the UI tooling.

Add a component under `src/components/`, a hook under `src/hooks/`, or a utility under `src/lib/`, following the existing wildcard export patterns. A new file matching an existing pattern does not need a `package.json` export change. Change `package.json` only when you add a new public entry-point pattern. Remove imports before deleting a component, hook, or utility. For a generated shadcn component, run the shadcn command from this directory and review the result before committing it.

The web app imports paths such as `@ludika/ui/components/button`, `@ludika/ui/lib/utils`, and `@ludika/ui/globals.css`. This package has no build script, so use `bun run check-types` here and test visual changes in `apps/web`.

## Dependencies and commands


For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run check-types

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
