# Ludika context

The shared vocabulary for this repository. Every issue title, component name, table
name and test name uses the terms defined here.

If you need a concept that is not defined below, **add it here in the same commit**
that introduces it. A term that exists only in one person's head becomes two
components with two names doing one job, and no search finds the second one.

## Status

The structural vocabulary below is settled and taken from the code. The **domain
vocabulary is not yet written** - see the placeholder section, which is the next
thing to fill in. Until it exists, agents and humans will invent their own names for
Ludika's domain concepts, and those names will not match each other.

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

Ludika is a **delivery marketplace**. A Client books the delivery of items, a Driver
accepts that booking and carries it out, and an Admin oversees both from the web
dashboard.

> **"Ludika" is a working name, not the final product name.** It is already baked
> into package names (`@ludika/*`), app slugs, and bundle identifiers
> (`com.knights.ludika.client` / `.driver`). Renaming later means touching all three
> plus the store listings.

**Client** - the party who books a delivery. Uses the client app.

**Driver** - the party who accepts a booking and performs the delivery. Uses the
driver app.

**Admin** - the party who oversees Clients, Drivers and bookings. Uses the web app.
No self-service admin signup is implied by this term.

A person acts as exactly **one** party. One human being both a Client and a Driver is
not supported today, but is expected to be wanted later - so do not build anything
that makes it structurally impossible.

Whether these three are roles on a User or entities of their own is **not decided**.
Until it is, no schema should assume either.

**Booking** - what a Client creates to request a delivery, and the thing a Driver
accepts. One Booking covers **exactly one pickup and one drop-off**, however many
items it carries. Multi-stop and split-across-drivers deliveries are out of scope;
if they arrive later they are a new term, not a wider Booking.

Use "Booking" as both the noun and the act ("the Client books"). Not Order, Job,
Trip or Request.

Booking's states and its relationship to a Driver are not modelled yet. Add them here
when they are decided, rather than naming them in code first.
