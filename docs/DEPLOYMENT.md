# Deployment

The working root app targets ChatGPT Sites and Cloudflare D1. A separate adapter in `deploy/` targets Vercel and Render through standard Next.js, PostgreSQL and Better Auth. See [the adapter guide](../deploy/README.md) for exact setup, commands, environment variables and validation status.

Vercel/Render publication is pending database selection. The workspace already uses its single active free Render PostgreSQL instance for `phishguard-db`; no changes have been made to that database. Local Next.js builds hit an environment memory-inspection error, while TypeScript checks passed. Hosted build and database verification are still required.

Sites accounts and D1 data are not automatically migrated to the portable app. Provider secrets must remain outside Git. Do not disable TLS certificate validation for external PostgreSQL.
