# Shared UI lives in two platform packages, not one

Mobile and web have different component libraries (HeroUI Native + Uniwind versus
shadcn + Base UI) and cannot share rendering code, so we keep two UI packages -
`@ludika/mobile-ui` and `@ludika/ui` - rather than one universal package with
platform branches inside each component. `turbo boundaries` denies dependencies
between the `platform-mobile` and `platform-web` workspaces so the split cannot erode
quietly. The apps still share types, tRPC contracts and database schema; only UI is
split.

## Consequences

A concept needed on both platforms is implemented twice, once per package. That is
accepted: the alternative was a universal component library whose every member
carries a `Platform.OS` branch, which is harder to read and harder to test than two
honest implementations. Duplication _within_ a platform is still a defect, and
`bun run dupes` reports it.
