# Architecture

The browser renders the Orbit dashboard in `app/orbit.tsx`. Same-origin GET and POST requests to `/api/orbit` retrieve account-owned records and perform profile or ride actions. The route authenticates the visitor through the Sites identity helper before reading or writing D1 through Drizzle.

## Data model

`profiles` stores the Site-scoped account ID, display name, phone, account mode, and avatar URL. `rides` stores rider and optional driver IDs, route labels, vehicle class, estimated fare and distance, status, creation time, review, and cash-payment record.

Names and phone numbers are included in a ride response for the relevant rider and driver. Unrelated account details are not returned to the client, though the current implementation scans the profile table to enrich results. Replace that scan with bounded joins for larger datasets.

## Boundaries

- Identity headers are trustworthy only behind the Sites authentication boundary. Never accept client-provided identity headers on a public Node server.
- User-owned read and write checks live in the server route; hiding a UI button is not authorization.
- The server recalculates sample fares and validates locations, vehicle classes, and state changes.
- The client polls every six seconds. The map is a visual illustration and does not calculate navigation.
- Driver selection is manual and self-selected roles are intended for testing.

## Persistence and migration

Schema declarations are in `db/schema.ts`; migrations are in `drizzle/`. Generate a new migration after changing a schema. Do not edit migrations that have already been applied to a hosted database. Local preview state and production state are separate.

## Production hardening

Introduce foreign keys, unique constraints or transactional locking for active rides, request idempotency, pagination, bounded relationship queries, commercial driver verification, structured error handling, and shared rate limiting before deploying a real dispatch service. Cash confirmation must not be presented as payment-provider settlement.
