---
name: pr
description: Open a pull request, with a description a reviewer can act on.
disable-model-invocation: true
argument-hint: "The issue number, if there is one"
---

# PR

The diff already states what changed, line by line. A description earns its place by
carrying what the diff cannot: why the change exists, which approach it picked over
which alternative, and what it might break.

Write it from the change itself, show it to the developer, then open the PR.

## Process

### 1. Establish the range

The base is `main`. Get the range with `git merge-base --fork-point main HEAD`, falling
back to `git merge-base main HEAD`.

On `main` with no branch, there is nothing to open: say so and stop.

**Done when** the range is known and `git log <base>..HEAD --oneline` lists at least
one commit.

### 2. Read the change

Read all of it, not a sample:

- `git diff <base>...HEAD` and `git log <base>..HEAD` for the change itself.
- The issue, if the developer named one or a commit references it. Fetch it per
  `docs/agents/issue-tracker.md`. It holds the Why, and a PR whose Why is reconstructed
  from the diff usually restates the What in different words.
- `CONTEXT.md` for the terms to name things by, and `docs/adr/` for a decision this
  change turns on or contradicts.

**Done when** every commit in the range is accounted for, and either the motivating
issue or ADR has been read, or you have established that none exists.

### 3. Draft the body

Write the risk line and the four sections below to `.git/pr-body.md`. That path is
inside `.git`, so it is never committed and needs no cleanup rule.

Confirm `bun run check` passes first. CI runs the same set, so a failing check means
the PR opens red.

**Done when** the file opens with a risk line and holds all four sections.

### 4. Show it, then open

Print the body and wait for the developer to approve or amend it. Opening a PR is
outward-facing and names them as the author: they read it first, every time.

On approval, push the branch if it has no upstream, then:

```bash
gh pr create --base main --title "<conventional-commit subject>" --body-file .git/pr-body.md
```

Title follows the repo's commit convention: `type(scope): lowercase subject`. Reuse the
subject of the single commit when the range has one; write one covering the range when
it has several.

**Done when** `gh` has returned the PR URL, and it has been reported to the developer.

## The body

### Risk line

One line, first thing in the body, before the Overview. A reviewer decides how much
attention to spend from this line alone.

```md
> **Risk: medium** - rewires the auth forms in both mobile apps, unverified on device.
```

A PR takes the level of its **riskiest** change, never the average of its files. A
hundred lines of docs beside one migration is high.

| Level | When |
| --- | --- |
| **high** | Auth, payments, or `packages/db` schema and migrations. A behaviour change in a shared package that more than one app consumes. Anything unverified on a real device or in a browser. |
| **medium** | A behaviour change inside one app. A shared package change that is mechanical or type-only. A dependency or toolchain version bump. |
| **low** | Configuration, tooling, documentation, formatting. No runtime behaviour changes. |

Add one clause saying what earned the level. "Risk: high" alone tells a reviewer
nothing they can act on.

### Overview

Two sentences at most. A reviewer reads this to decide whether they are the right
person to review it, so lead with the part of the system it touches.

### What

The change, grouped by concern, at the altitude of "a shared component moved into
`@ludika/mobile-ui`" rather than "edited `container.tsx`". One bullet per concern, and
every commit in the range lands under one of them.

Deletions and moves count as changes, and reviewers miss them most often. Name them.

### Why

The problem that made this necessary, and what it cost to leave alone. Cite the issue,
the ADR, or the `CONTEXT.md` term that motivated it.

When nothing motivated it beyond the developer's judgement, write that: "no issue,
noticed while working on X". An honest absence tells a reviewer more than a Why
reverse-engineered from the diff.

### How

The approach, and the alternative it beat. This is the section a reviewer argues with,
so give them something arguable: the seam chosen, the pattern followed, the dependency
deliberately not added.

Skip it when the change had no real choice in it. A `How` on a one-line version bump is
sediment.

Where the change is high risk, close `How` with a line naming what a reviewer should
exercise by hand. This repo has no automated tests, so `bun run check` proves types and
boundaries and never behaviour.
