# DB Foundation

## Purpose
- `src/shared/db/client.ts`: PostgreSQL connection and Drizzle database entry point
- `src/shared/db/env.ts`: database-related environment parsing
- `drizzle.config.ts`: Drizzle CLI configuration
- `drizzle/`: generated SQL migrations and Drizzle metadata

## Schema Layout
- Module-owned schema files should live at `src/modules/<module>/db/schema.ts`
- The first schema files are expected in `src/modules/auth/db/schema.ts`
  and `src/modules/wishlist/db/schema.ts`
- Auth schema starts with `users` and `sessions` only; keep auth runtime logic
  out of the DB foundation layer

## Auth Schema Foundation
- `users`: auth identity record with unique `email` and stored `password_hash`
- `sessions`: opaque server-side session records keyed by `session_token`
  with `expires_at` and a foreign key to `users`

## Current State
- Auth runtime logic now builds on these tables inside the `auth` module.
- The next DB expansion is expected in `src/modules/wishlist/db/schema.ts` for
  `wishlists` and `wishlist_items`.

## Environment Contract
- `DATABASE_URL`: required PostgreSQL connection string
- `DATABASE_SSL`: optional boolean flag for SSL mode; default is `false`
