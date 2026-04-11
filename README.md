# Wishka

Minimal, fast wishlist app.

## Status
Milestone 3 complete. Owner wishlist core is in place.

## Core Idea
Create a wishlist, share it by link, and let another person reserve an item.

## Planned Stack
- Next.js
- TypeScript
- PostgreSQL
- Drizzle
- Tailwind
- Radix
- Vitest
- Playwright
- Docker Compose
- Caddy

## Project Rules
- `v1.0.0` stays minimal: email/password auth, one wishlist per user in UI, item CRUD, public share link, reservation flow, Russian UI, and light theme.
- Releases follow SemVer.
- Commits follow Conventional Commits.
- `main` is protected and updated only through PRs.

## Current Focus
- Milestone 4: share links.

## Current Capabilities
- Email/password registration.
- Email/password login and logout.
- Server-side sessions with HTTP-only auth cookie.
- Server-side protection for `/app` and `/app/reservations`.
- Automatic current wishlist bootstrap for authenticated owners.
- Server-rendered owner dashboard with empty state and item list.
- Owner-side wishlist item create, update, and delete flows.
- Wishlist core coverage across focused unit and integration-like tests.

## Project Docs
- Product and delivery plan: `master-plan.md`
- Agent guidance: `AGENTS.md`

## License
MIT
