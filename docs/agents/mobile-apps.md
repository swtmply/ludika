# Working in the Expo apps

Applies to `apps/ludika-client` and `apps/ludika-driver`. Both app-level
`AGENTS.md` files point here, so this file is the single copy of the rules.

## The two apps are near-identical clones right now

Both were generated from the same template, so most files under `app/` are still
byte-identical between them. That is a starting state, not a design: as the client
and driver flows diverge, these files should diverge too.

`bun run dupes` lists what is still duplicated. When you touch one of those files,
decide which it is:

- **Genuinely shared UI** - promote it to `@ludika/mobile-ui` and import it in both.
- **About to diverge** - edit only the app you are working in, and let the report
  show one fewer duplicate.

Do not "fix" a duplicate by copying your change into the other app.

## What belongs in the app, not the package

Anything tied to this app's identity or runtime:

- `app/**` - expo-router routes and layouts. Route files stay per app.
- `lib/auth-client.ts` - reads this app's `scheme` from `expoConfig`, so the deep
  link and the SecureStore prefix are app-specific.
- `lib/server-config.ts` - reads this app's `EXPO_PUBLIC_*` env.
- `utils/trpc.ts` - the tRPC client and the `QueryClient` singleton.
- `components/` - components carrying this app's data or navigation.

Those three `lib`/`utils` files are identical between the apps today and are listed
in the duplicate detector's `IGNORE` list with that reason. Leave them per app.

## Wiring a shared form

`@ludika/mobile-ui` components never import the auth client. Pass a submit function
and return `{ error }` on failure:

```tsx
<SignIn
  onSubmit={async ({ email, password }) => {
    const { error } = await authClient.signIn.email({ email, password });
    return { error: error?.message ?? null };
  }}
  onSuccess={() => queryClient.refetchQueries()}
/>
```

The component owns validation, layout, the spinner and the toasts. The app owns the
network call. Follow this shape for any new shared component that needs the server.

## Styling

Uniwind `className`, Tailwind v4 syntax, theme tokens (`bg-background`,
`text-foreground`, `text-muted`) rather than literal colours. `global.css` in each
app defines the tokens. `cn` comes from `heroui-native/utils`.

## Providers

`app/_layout.tsx` mounts, outside in: `QueryClientProvider`, `MobileUIProvider`,
`KeyboardProvider`, `AppThemeProvider`. Both `MobileUIProvider` and
`AppThemeProvider` come from `@ludika/mobile-ui`. Do not mount either one again
further down the tree.

## Running and building

```bash
bun run dev:client        # client app + server
bun run dev:driver        # driver app + server
bun run dev:mobile        # both apps + server
bun run build:eas:dev     # EAS development build, both apps
bun run build:eas:preview # EAS preview build, both apps
```

`bun run check-types` covers both apps. Neither app has tests yet; there is no test
task to run.
