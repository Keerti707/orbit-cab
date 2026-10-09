# Orbit — portable deployment

This directory is the Node.js hosting adapter for Vercel and Render. It reuses Orbit's UI and ride workflow with standard Next.js, PostgreSQL and Better Auth. The root project remains the working Sites/Cloudflare version.

## Stack

Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Lucide React, Drizzle ORM, PostgreSQL (`pg`), and Better Auth 1.7.

## Local setup

1. Run `npm ci` from this directory.
2. Copy `.env.example` to `.env.local` and configure a **dedicated PostgreSQL database**, a random secret of at least 32 characters, and `BETTER_AUTH_URL=http://localhost:3000`.
3. Run `node --env-file=.env.local scripts/migrate.mjs` to create authentication and Orbit tables.
4. Run `npm run dev` and open `http://localhost:3000`.

Use email/password sign-up on `/sign-in`. Passwords must contain at least 12 characters. Better Auth manages password hashing and sessions; authentication rate limits use database storage. Email verification, password reset and social sign-in are not configured.

## Vercel

Import `Keerti707/orbit-cab`, set **Root Directory** to `deploy`, and use the Next.js framework preset. Configure server-only `DATABASE_URL`, `BETTER_AUTH_SECRET`, and the stable production `BETTER_AUTH_URL`. Apply migrations to the chosen database before users sign up. The build does not apply migrations or require database credentials.

## Render

Use the root `render.yaml` Blueprint or a Node web service with Root Directory `deploy`, build command `npm ci && npm run build`, and start command `npm run db:migrate && npm start`. Use the same server-only environment variables. Next.js binds to `0.0.0.0` and respects Render's `PORT`.

Use an internal database URL for a Render-hosted database in the same region/workspace, and a TLS-enabled external URL for Vercel. Keep certificate verification enabled. Use a small application pool to limit connections.

## Validation and status

TypeScript checking passed. Local production builds were attempted with both Turbopack and webpack but hit an environment-level `uv_resident_set_memory` error. A hosted production build and PostgreSQL migrations/end-to-end authentication tests remain pending.

Render rejected a second free database because this workspace already has `phishguard-db`. No changes were made to that database. Do not use its credentials or migrate its tables without the owner's explicit approval. Provision a dedicated database or arrange approved isolation before enabling this adapter.

## Database behavior

`db/001_orbit.sql` contains idempotent Orbit tables, foreign keys, input checks, and partial unique indexes for active rider/driver assignments. The migration script also applies Better Auth's schema and takes a PostgreSQL advisory lock to serialize concurrent startup migrations.

This adapter does not import existing Sites users or D1 ride history. Its accounts and database start separately. The map, sample fares, manual driver queue, polling, cash records, and educational driver roles retain the limitations described in the root README.
