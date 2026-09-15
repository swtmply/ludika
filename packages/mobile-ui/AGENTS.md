# @ludika/mobile-ui

Shared React Native UI for `ludika-client` and `ludika-driver`. HeroUI Native for
primitives, Uniwind for styling, Hugeicons for icons.

Anything added here is used by both apps. That is the whole point of the package, and
also the constraint: a component that only makes sense in one app does not belong
here.

## Adding a component

1. Create `src/components/<kebab-name>.tsx`, one component per file.
2. Add one line to `src/index.tsx` in the alphabetical block. Consumers import from
   the package root - Metro resolves that path today, and it keeps the two apps on one
   import.
3. Run `bun run inventory` from the repo root so `docs/inventory.md` lists it.
4. Run `bun run check-types` - this package typechecks on its own, so a broken import
   fails here before it reaches an app.

## Rules that keep this package shared

**No app imports.** Not `@/...`, not a path into `apps/`. This package cannot see the
apps, and `turbo boundaries` fails the build if it tries.

**No auth, tRPC or query client.** Those are per-app singletons. A component that
needs to talk to the server takes a function as a prop instead. `SignIn` and `SignUp`
show the shape: the component owns the form, validation, layout and toasts; the app
passes `onSubmit` and gets `{ error }` or a throw back.

**Every runtime dependency is a peer dependency.** The apps supply React Native,
Reanimated, HeroUI Native and the rest, so the package can never pull a second copy
of a native library into a build. Add new ones to both `peerDependencies` and
`devDependencies` in `package.json`.

**Styling is Uniwind `className`, not `StyleSheet`.** Use the theme tokens
(`bg-background`, `text-foreground`, `text-muted`) rather than literal colours, so
both themes work. Read a colour in JS with `useThemeColor` from `heroui-native/hooks`.

**`cn` comes from `heroui-native/utils`** on mobile. `@ludika/ui/lib/utils` is the web
one; it is not importable here.

## Theme

`MobileUIProvider` (in `src/index.tsx`) wraps `GestureHandlerRootView` and
`HeroUINativeProvider`. `AppThemeProvider` sits inside it and exposes `useAppTheme()`
for reading and toggling light/dark. Both apps mount them in `app/_layout.tsx`; do not
add a second provider inside a component.
