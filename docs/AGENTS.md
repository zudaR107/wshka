# AGENTS.md

## Mission
Build Wshka: a minimal, fast wishlist app.
Core flow: create wishlist → share link → reserve gift.

## Current Status
`v1.1.0` shipped. Working on `v1.2.0` (M10): M10-I1–I5 complete,
M10-I6 bugfix batch in progress. See `docs/master-plan.md` for full roadmap.

## Shipped Features (as of v1.1.0 + M10-I1–I5)
- email/password auth with auto-login after registration
- multiple wishlists per user (create, rename, delete; last cannot be deleted)
- wishlist item CRUD with starring, multi-currency price display
- public share link (create, revoke, regenerate)
- reservation by authenticated non-owner; owner sees reserved state (no identity)
- reserver can cancel own reservation
- owner bio in settings; shown on share page to authenticated viewers
- self-reservation from dashboard and share page
- in-app notification system: bell badge, dropdown, `/notifications` page;
  types: item_updated, item_deleted, reservation_created, reservation_cancelled,
  owner_updated; polling every 30 s; cross-tab session sync
- dark theme, background parallax, English locale, multi-currency display
- Russian/English locale, light/dark theme, full CI/CD

## Stack
Next.js, TypeScript, PostgreSQL, Drizzle, Tailwind,
Vitest, Playwright, Docker Compose, Caddy.

## Architecture Rules
- Modular monolith; keep module boundaries clear:
  `auth`, `wishlist`, `item`, `share`, `reservation`, `ui`, `i18n`, `shared`
- Server-first rendering, minimal client code
- All user-facing text through i18n keys
- All colors and theme values through design tokens
- Prefer the smallest correct change

## Domain Invariants
- Multiple wishlists per user; last wishlist cannot be deleted
- Public access only through active share tokens
- Only authenticated non-owners can reserve items (owners can self-reserve)
- At most one active reservation per item
- Owners never see reserver identity
- Notification `shareToken` is a static snapshot — link regeneration revokes old links

## Routes
| Route | Access |
|---|---|
| `/` | Guest landing / owner dashboard |
| `/login`, `/register` | Public |
| `/reservations` | Auth — reserver's active reservations |
| `/settings` | Auth — account settings (email, bio, currency) |
| `/notifications` | Auth — in-app notification feed |
| `/share/[token]` | Public — read-only wishlist |
| `/roadmap`, `/privacy`, `/terms` | Public |
| `/healthz` | Public-safe health check |

## Workflow
- Small PRs only; `main` protected; merge through PR
- Conventional Commits with 50/72 discipline
- Update tests and docs when behavior changes
- See `docs/master-plan.md` for milestones and process rules

## Deployment
One VPS: Docker Compose with `caddy + app + postgres`,
HTTPS on `wshka.ru`, deploy via GitHub Actions + GHCR.
Dockerfile at `ops/Dockerfile`; tool configs at `config/`.
