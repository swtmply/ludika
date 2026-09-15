# Ludika context

The shared vocabulary for this repository. Every issue title, component name, table
name and test name uses the terms defined here.

If you need a concept that is not defined below, **add it here in the same commit**
that introduces it. A term that exists only in one person's head becomes two
components with two names doing one job, and no search finds the second one.

## Status

The structural vocabulary below is settled and taken from the code, and the domain
vocabulary is written. Two things are still open: an Order's states and its
relationship to a Driver, and whether Client, Driver and Admin are roles on a User or
entities of their own. Both are flagged where they belong below. Decide them there
first - a name invented in code is a name no search finds twice.

## Structural terms

**Workspace** - one directory under `apps/` or `packages/`, with its own
`package.json`. The unit that turbo tasks and boundary rules apply to.

**App** - a deployable in `apps/`. Four exist: `ludika-client`, `ludika-driver`
(Expo), `web` (Next.js), `server` (Hono).

**Client app** (`ludika-client`, scheme `ludika-client`) - the Expo app for the
person requesting service.

**Driver app** (`ludika-driver`, scheme `ludika-driver`) - the Expo app for the
person providing it.

**Shared package** - a workspace in `packages/`. Never depends on an app or on the
server. Tagged `role-shared`, `role-ui`, or both, in its `turbo.json`.

**Shared component** - a component exported from `@ludika/ui` or
`@ludika/mobile-ui` and listed in `docs/inventory.md`. Distinct from an
**app-local component**, which lives in one app's `components/` directory because it
carries that app's data or navigation.

**Promotion** - moving an app-local component into a shared package. Triggered by a
second caller wanting it. See the rule in `AGENTS.md`.

## Platform terms

**Mobile** - the two Expo apps. Styled with Uniwind (Tailwind v4 for React Native);
components come from HeroUI Native via `@ludika/mobile-ui`.

**Web** - the Next.js app. Styled with Tailwind v4; components come from shadcn and
Base UI via `@ludika/ui`.

Mobile and web share types, tRPC contracts and database schema. They deliberately
share **no** UI code: `turbo boundaries` denies a `platform-mobile` workspace from
depending on a `platform-web` one and the reverse.

## Persisted entities

Defined in `packages/db/src/schema`:

**User**, **Session**, **Account**, **Verification** - owned by Better Auth
(`schema/auth.ts`). Do not hand-edit; they follow the Better Auth schema.

**Todo** (`schema/todo.ts`) - the Better-T-Stack example entity. Not a Ludika
concept. Delete it once real entities land, and remove it from this file.

## Domain terms

Ludika is a **delivery marketplace**. A Client orders the delivery of Items, a Driver
accepts that Order and carries it out, and an Admin oversees both from the web
dashboard.

> **"Ludika" is a working name, not the final product name.** It is already baked
> into package names (`@ludika/*`), app slugs, and bundle identifiers
> (`com.knights.ludika.client` / `.driver`). Renaming later means touching all three
> plus the store listings.

**Client** - the party who places an Order for a delivery. Uses the client app.

**Driver** - the party who accepts an Order and performs the delivery. Uses the
driver app.

**Admin** - the party who oversees Clients, Drivers and Orders. Uses the web app.
No self-service admin signup is implied by this term.

A person acts as exactly **one** party. One human being both a Client and a Driver is
not supported today, but is expected to be wanted later - so do not build anything
that makes it structurally impossible.

Whether these three are roles on a User or entities of their own is **not decided**.
Until it is, no schema should assume either.

**Order** - what a Client creates to request a delivery, and the thing a Driver
accepts. One Order covers **exactly one pickup and one drop-off**, however many
Items it carries. Multi-stop and split-across-drivers deliveries are out of scope;
if they arrive later they are a new term, not a wider Order.

Use "Order" as both the noun and the act ("the Client orders"). Not Booking, Job,
Trip or Request.

Order's states and its relationship to a Driver are not modelled yet. Add them here
when they are decided, rather than naming them in code first.

**Pin** - a point on the map chosen as an Order's pickup or drop-off. An Order has
exactly two: one pickup Pin and one drop-off Pin. A Pin is where the delivery happens,
not the address text a Client types to find it.

**Item** - one thing carried under an Order. An Order carries one or more Items, and
they are never split across Drivers.

**Live feed** - the Client's view of an in-progress Order once it is placed: the
Driver's position and the Order's status as it changes. Read-only; it collects no
input and is not a step in placing the Order.
