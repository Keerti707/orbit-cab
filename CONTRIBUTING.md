# Contributing to Orbit

1. Open an issue describing the problem or proposed behavior.
2. Fork the repository and create a focused branch.
3. Follow the README setup instructions.
4. Keep server authorization and input validation intact.
5. Run `pnpm typecheck`, `pnpm test`, and `pnpm build`.
6. Open a pull request describing the change, validation, and any remaining limitations.

Use descriptive commit messages. Avoid unrelated formatting changes. Include migrations when changing the schema, and never rewrite an applied migration. Do not commit credentials, personal ride records, database dumps, or build output.

For UI changes, include screenshots from desktop and mobile when available. Do not describe illustrative maps, sample fares, or cash records as live provider integrations.
