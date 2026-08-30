# Ludika client

The client-facing Expo and React Native app. It runs Metro on port 8081 and calls the shared server through tRPC.

## Key files

- `app/` contains Expo Router routes. Folder names in parentheses group routes without adding a URL segment.
- `components/` contains client-only UI components.
- `contexts/` contains client context providers.
- `lib/auth-client.ts` configures the Better Auth client.
- `utils/trpc.ts` creates the tRPC client.
- `.env` must define `EXPO_PUBLIC_SERVER_URL`.
- `app.json`, `eas.json`, `metro.config.js`, and `global.css` hold Expo, build, Metro, and styling configuration.

## Make changes

Add a screen under `app/` when it needs a route. Add reusable client UI under `components/`. Use `@ludika/mobile-ui` for the shared provider wrapper and import HeroUI Native components directly from their granular package paths. When deleting a route or component, remove its imports and navigation links first. Do not edit generated Expo type files unless the Expo tooling requires it.

The app imports shared code from `@ludika/api`, `@ludika/env`, and `@ludika/mobile-ui`. A new public entry point in a package must be added to that package's exports before importing it here.

## Dependencies and commands

For ordinary single-workspace dependencies, run `bun add <package>` or `bun remove <package>` from this workspace:

    bun add <package>
    bun remove <package>

For catalog dependencies, add the version to the root `workspaces.catalog` and set `"<dependency>": "catalog:"` in this workspace's `package.json`, then run `bun install` from the repository root. For an internal package, a copyable example is `bun add @ludika/utils@workspace:*`.

Start the development client with `bun run dev`. Install a native development client with `bun run android` or `bun run ios`. The root `bun run dev:client` starts this app and the server. This workspace has no `build` script, so the root build does not build a native binary.
