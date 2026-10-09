# Deployment

## Current hosting

The current application targets Cloudflare Workers through Vinext and the Sites integration. D1 is enabled as the `DB` binding. The live Site is private and uses Sites-owned sign-in. Publishing provisions the database and applies committed migrations.

## Vercel and Render

These deployments are pending. Do not import the current build into these platforms and assume the API will work: `cloudflare:workers` and the trusted Sites identity boundary are platform dependencies.

A portable deployment needs:

1. A standard Next.js build and start command.
2. Managed authentication such as Better Auth or Clerk, replacing the Sites identity helper and sign-in URLs.
3. A PostgreSQL adapter and migrations, replacing D1/SQLite-specific access.
4. Server-only database and authentication environment variables.
5. A successful account creation → booking → driver acceptance → completion → review test on the target host.

No Render or Vercel configuration is included that falsely claims compatibility with this Worker build. Provider secrets belong in hosting settings, not source files. Preserve TLS validation for external PostgreSQL connections.

For free hosting, review the provider's current database lifetime, sleeping and quota limits before provisioning. Do not enable paid resources without an explicit budget.
