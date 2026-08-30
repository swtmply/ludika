# Domain docs

How the engineering skills should consume this repository's domain documentation when exploring the codebase.

## Before exploring, read these

- `CONTEXT.md` at the repository root
- Relevant ADRs under `docs/adr/`

If these files do not exist, proceed without flagging their absence. The domain-modeling workflows create them when the project resolves terminology or architectural decisions.

## File structure

This repository uses a single-context layout:

```text
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-example-decision.md
│       └── 0002-another-decision.md
├── apps/
└── packages/
```

The apps and packages are technical boundaries within one domain context. They do not require separate `CONTEXT.md` files.

## Use the glossary's vocabulary

When output names a domain concept in an issue title, proposal, hypothesis, or test name, use the term defined in `CONTEXT.md`. Do not replace defined terms with synonyms that the glossary avoids.

If the required concept is absent, reconsider whether the project uses that language. If it represents a real gap, note it for the domain-modeling workflow.

## Flag ADR conflicts

If proposed work contradicts an existing ADR, identify the conflict instead of silently overriding the decision.
