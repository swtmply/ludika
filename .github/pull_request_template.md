## What and why

<!-- One or two sentences. Link the issue: Closes #123 -->

## Reuse check

<!-- The one thing per-package CI cannot verify for you. Tick both. -->

- [ ] I checked `docs/inventory.md` before creating any component, and reused or
      extended what was already there.
- [ ] Anything generic I added lives in `@ludika/ui` or `@ludika/mobile-ui`, not in an
      app. If I left something app-local that a second app might want, I said why below.

## Vocabulary

- [ ] New domain concepts use the terms in `CONTEXT.md`, or I added the term there in
      this PR.

## Checks

- [ ] `bun run check` passes locally.
- [ ] I read the duplication report in the CI job summary and the findings are either
      pre-existing or deliberate.

## Notes for the reviewer

<!-- Anything deliberate that looks wrong at first glance. Delete if none. -->
