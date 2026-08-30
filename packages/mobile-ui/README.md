# Mobile UI package

Shared provider setup for the client and driver apps. It wraps HeroUI Native with a `MobileUIProvider` that also provides the gesture-handler root view.

## Key files

- `src/index.tsx` exports the shared `MobileUIProvider` wrapper. Import HeroUI Native components directly from their granular package paths in app code.
- `src/uniwind-env.d.ts` contains Uniwind type support.
- `tsconfig.json` contains the package TypeScript settings.

Add a shared mobile component as a file under `src/` when both mobile apps should use it, then export it through `src/index.tsx`. Keep app-specific components in the owning app. Update the root export when adding a public entry point, and remove all imports before deleting one. Changes affect both Expo apps, so check both Metro projects after editing.

Both mobile apps import this package as `@ludika/mobile-ui`. It has no build script, but `bun run check-types` is available from this directory and Turbo runs it when that task is requested.

## Dependencies and commands

For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>
    bun run check-types

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.
