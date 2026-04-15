# Wshka Master Plan

## Product
Wshka is a minimal, fast wishlist app with one core social flow:
create a wishlist → share it by link → let another person reserve a gift.

## Product Decisions
- Product name: `Wshka`
- Primary language: Russian first
- Theme strategy: light theme first
- Deployment target: one remote VPS with a domain
- Performance target: fast SSR-first with minimal client JS
- Architecture: modular monolith, easy to extend
- Workflow: PR-only, SemVer, Conventional Commits

## v1.0.0 Scope

Included:
- email/password registration and login (auto-login after registration)
- one wishlist per user in UI
- wishlist item CRUD (title, url, note, price)
- public share link (create, revoke, regenerate)
- item reservation by another authenticated user
- owner sees reservation status without reserver identity
- reserver can cancel their own reservation
- Russian locale, light theme
- full CI/CD, Docker Compose, Caddy, GHCR, VPS deploy

Excluded from v1.0.0:
- images, dark mode, English locale
- email verification, password reset
- multiple wishlists in UI, notifications, comments

## Domain Contract

### Entities
| Entity | Purpose | Contract |
|---|---|---|
| `User` | Account owner or reserver | Unique `email`; password stored only as hash |
| `Session` | Authenticated access | Required for owner actions and reservations |
| `Wishlist` | Container for items | Schema supports many per user; UI exposes one |
| `WishlistItem` | Single wish | Fields: `title`, `url?`, `note?`, `price?` |
| `ShareLink` | Public read-only access | Opaque token; one active per wishlist; revocable |
| `Reservation` | Item reservation | At most one active per item; owner cannot reserve own items |

### Domain Rules
- One wishlist per user in v1.0.0 is a product rule, not a schema limitation.
- Reservation state is derived from active records, not denormalized flags.
- Public access requires an active share token.
- Owners see reserved status but never reserver identity.
- All text goes through i18n keys. All theme values go through design tokens.

## Access Contract
| Actor | Allowed Actions |
|---|---|
| Guest | View `/`, `/login`, `/register`, valid public share pages |
| Owner | Manage wishlist, items, share link; see reserved state |
| Authenticated non-owner | Reserve items via share page, view and cancel own reservations |

## Route Map
| Route | Access | Purpose |
|---|---|---|
| `/` | public + auth | Landing page (guest) / owner dashboard (authenticated) |
| `/login` | public | Login |
| `/register` | public | Registration |
| `/reservations` | auth | Current user's reservations |
| `/share/[token]` | public | Public read-only wishlist |
| `/roadmap` | public | Product roadmap |
| `/privacy` | public | Privacy policy |
| `/terms` | public | Terms of use |
| `/healthz` | public-safe | Health check for deploy verification |

## Architecture
- Modular monolith, server-first rendering, minimal client state
- Module boundaries: `auth`, `wishlist`, `item`, `share`, `reservation`, `ui`, `i18n`, `shared`
- PostgreSQL + Drizzle, Tailwind + design tokens

## Process Rules
- Work through PRs only; `main` is protected
- Conventional Commits with 50/72 discipline
- SemVer releases, maintained `CHANGELOG.md`
- Docs updated when behavior, env, or delivery process changes

## Definition Of Done
- Single focused change, relevant tests updated, CI green
- No unrelated edits, no hidden scope creep
- Docs updated when behavior or delivery process changes
- DB changes include migrations; UI changes include verification note

---

## Milestones

| Milestone | Version | Status | Summary |
|---|---|---|---|
| M0 — Repo Foundation | v0.1.0 | ✅ complete | Scaffold, PR templates, CI baseline, branch protection |
| M1 — App Foundation | v0.2.0 | ✅ complete | App shell, route skeleton, DB, i18n, light theme |
| M2 — Auth Core | v0.3.0 | ✅ complete | Registration, login, logout, sessions, route guards |
| M3 — Wishlist Core | v0.4.0 | ✅ complete | Wishlist schema, owner dashboard, item CRUD |
| M4 — Share Links | v0.5.0 | ✅ complete | Opaque share tokens, public read-only wishlist |
| M5 — Reservations | v0.6.0 | ✅ complete | Reserve/cancel flow, privacy rules, reserver page |
| M6 — Delivery & Ops | v0.7.0 | ✅ complete | Docker, Compose, Caddy, GHCR, VPS deploy, CI/CD |
| M7 — MVP Hardening | v1.0.0 | ✅ complete | e2e coverage, auth hardening, UI redesign, release rehearsal |

---

## Milestone 8 — v1.1.0 (planned)

Goal: expand the product with the most impactful quality-of-life features.

### Scope

**Multiple wishlists**
- Owner can create, name, switch, and archive multiple wishlists
- Each wishlist gets its own share link
- Navigation updated to support multi-wishlist UI

**Item prioritization**
- Owner marks items as high / medium / low priority
- Priority is visible to reservers on the public share page
- Default sort: high priority first

**Account profile data**
- Optional profile fields: height, weight, clothing size, shoe size
- Shown to authenticated users on the public share page
- Helps gift-givers choose the right size or variant without asking

### Issue shape (proposed)
- `M8-I1 Multiple wishlists — schema and data access`
- `M8-I2 Multiple wishlists — owner UI`
- `M8-I3 Multiple wishlists — share and reservation wiring`
- `M8-I4 Item prioritization — schema, helpers, UI`
- `M8-I5 Account profile data — schema, edit UI, share page display`
- `M8-I6 Test coverage and docs update`

---

## Future Ideas (not yet versioned)

| Idea | Notes |
|---|---|
| **Self-reservation** | Owner marks an item as "I'll get this myself" — removes from gift pool without deleting |
| **Marketplace image parsing** | Paste a product URL → auto-fetch title, image, price from Wildberries / Ozon / etc. |
| **Email notifications** | Notify owner when an item is reserved or reservation is cancelled |
| **English locale** | Full i18n for `en` |
| **Dark theme** | System-aware or manual toggle |
| **Password reset** | Forgot-password flow with email link |
| **Email verification** | Confirm email after registration |
| **Multiple currencies** | ₽ / $ / € with locale-aware formatting |
| **Comments on items** | Reserver leaves a note for the owner |
| **Tags and categories** | Group items within a wishlist |
| **Public user profiles** | Optional public profile page with wishlists index |
