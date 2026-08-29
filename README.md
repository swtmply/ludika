# Ludika

Ludika is a Bun workspace monorepo. It contains two Expo mobile apps, a Hono and tRPC server, a Next.js web app, and shared TypeScript packages.

## Start after cloning

Clone the repository and move into it:

```bash
git clone <repository-url>
cd ludika
```

Install Bun 1.3.14 before installing project dependencies.

Windows PowerShell:

```powershell
iex "& {$(irm https://bun.com/install.ps1)} -Version 1.3.14"
```

macOS or Linux:

```bash
curl -fsSL https://bun.com/install | bash -s "bun-v1.3.14"
```

Open a new terminal if your shell does not find Bun, then check the version:

```bash
bun --version
# 1.3.14
```

Install all workspace dependencies from the repository root:

```bash
bun install
```

Create local environment files before starting an app. Do not commit real credentials.

`apps/server/.env` must define:

```dotenv
DATABASE_URL=<postgres-connection-string>
BETTER_AUTH_SECRET=<at-least-32-character-secret>
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001
```

`apps/web/.env` must define:

```dotenv
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

Each mobile app needs its own `EXPO_PUBLIC_SERVER_URL` in `apps/ludika-client/.env` and `apps/ludika-driver/.env`. Use a server address reachable from the phone or emulator, for example `http://192.168.1.4:3000`.

## Find your way around

The `apps/` directory contains runnable products. The `packages/` directory contains code shared by those products.

```text
apps/
  ludika-client/   Expo app for clients
  ludika-driver/   Expo app for drivers
  server/          Hono and tRPC API server
  web/             Next.js web app

packages/
  api/             tRPC router and API context
  auth/            Better Auth setup
  config/          Shared TypeScript configuration
  db/              Drizzle database client and schema
  env/             Typed server, web, and native environment variables
  mobile-ui/       Shared HeroUI Native provider and exports
  ui/              Shared web UI components and styles
```

Each workspace has its own README with file locations, dependency commands, and editing guidance:

- [ludika-client](apps/ludika-client/README.md)
- [ludika-driver](apps/ludika-driver/README.md)
- [server](apps/server/README.md)
- [web](apps/web/README.md)
- [api](packages/api/README.md)
- [auth](packages/auth/README.md)
- [config](packages/config/README.md)
- [db](packages/db/README.md)
- [env](packages/env/README.md)
- [mobile-ui](packages/mobile-ui/README.md)
- [ui](packages/ui/README.md)

## Run the project

These are the only root scripts maintained for day-to-day development:

```bash
bun run dev          # Run every workspace with a dev script
bun run build        # Build every workspace with a build script
bun run dev:client   # Run the client mobile app and server
bun run dev:driver   # Run the driver mobile app and server
bun run dev:mobile   # Run both mobile apps and server
bun run dev:web      # Run the web app and server
```

The mobile commands start Metro. Install or rebuild an Expo development client from the relevant mobile app directory when needed. See the mobile app READMEs for those commands.

## Add a shared dependency

There are two ways to share a dependency. Keep the distinction clear.

### Create an internal workspace package

1. Create `packages/<name>` with a `package.json` named `@ludika/<name>`, a `src/` directory, and an `exports` map that matches the package's public entry points. Copy the small structure of a nearby package when choosing TypeScript settings.
2. Run `bun install` from the repository root so Bun registers the new workspace.
3. From the consuming workspace, add it with the workspace protocol. For example:

```bash
bun add @ludika/utils@workspace:*
```

4. Import only from the package's declared exports, for example `@ludika/<name>` or `@ludika/<name>/feature`. Add an export before using a new entry point.

### Share an external dependency version

Put the version in the root `workspaces.catalog` in `package.json`. In each consuming workspace, add `"<dependency>": "catalog:"` to the appropriate dependency section in that workspace's `package.json`.

Run the install from the repository root:

```bash
bun install
```

Repeat the manifest entry for each consumer. Change the version once in the root catalog, then run `bun install` again.

For a dependency used by only one workspace, run `bun add <package>` from that workspace. Never add an app or package dependency from the repository root just because the root has a `package.json`.

## Make changes safely

Edit code in the workspace that owns it. Add a new file next to the related feature, update the owning workspace's exports when a package file is public, and remove imports before deleting a file. Keep generated output such as `dist/` and `.next/` out of source changes. Update `bun.lock` when dependency manifests change.

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@ludika/ui/components/button";
```

## Commit messages

Use the affected workspace name in parentheses:

```text
feat(web): add account settings page
fix(api): validate todo input
chore(ludika-client): update Expo config
```

Use `feat` for a user-facing capability, `fix` for a correction, and `chore` for maintenance. The `app` part in `feat(app)`, `fix(app)`, and `chore(app)` means the affected app or package, such as `web`, `server`, `api`, or `ui`.
