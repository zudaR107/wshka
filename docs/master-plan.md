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
- Must not become a social network

## Domain Contract

### Entities
| Entity | Purpose | Contract |
|---|---|---|
| `User` | Account owner or reserver | Unique `email`; password stored only as hash; optional `bio`; `preferredCurrency` |
| `Session` | Authenticated access | Required for owner actions and reservations |
| `Wishlist` | Container for items | Many per user; default created on registration; deleting the last one auto-creates a fresh default |
| `WishlistItem` | Single wish | Fields: `title`, `url?`, `note?`, `price?`, `currency`, `starred` |
| `ShareLink` | Public read-only access | Opaque token; one active per wishlist; revocable |
| `Reservation` | Item reservation | At most one active per item |
| `Notification` | In-app alert | Types: `item_updated`, `item_deleted`, `reservation_created`, `reservation_cancelled`, `owner_updated`; stores static `shareToken` snapshot |

### Domain Rules
- Reservation state is derived from active records, not denormalized flags.
- Public access requires an active share token.
- Owners see reserved status but never reserver identity.
- Owners may self-reserve their own items.
- Notification `shareToken` is a static snapshot taken at creation time; regenerating the share link revokes old notification deep-links.
- All text goes through i18n keys. All theme values go through design tokens.

## Access Contract
| Actor | Allowed Actions |
|---|---|
| Guest | View `/`, `/login`, `/register`, valid public share pages |
| Owner | Manage wishlists, items, share link; self-reserve and cancel own reservations; receive and view notifications |
| Authenticated non-owner | Reserve items via share page; view and cancel own reservations; receive and view notifications |

## Route Map
| Route | Access | Purpose |
|---|---|---|
| `/` | public + auth | Landing page (guest) / owner dashboard (authenticated) |
| `/login` | public | Login |
| `/register` | public | Registration |
| `/reservations` | auth | Current user's reservations |
| `/settings` | auth | Account settings (email, bio, preferred currency) |
| `/notifications` | auth | In-app notification feed |
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

### Shipped

| Version | Milestone | Status |
|---|---|---|
| v0.1.0–v0.7.0 | M0–M6: Repo scaffold, auth, wishlist CRUD, share links, reservations, Docker/CI/CD/VPS | ✅ shipped |
| v1.0.0 | M7–M8: UI redesign, auto-login, /app→/ routing merge, legal pages, project restructure | ✅ shipped |
| v1.0.1 | Patch: inline mutation state (no redirect), UX fixes, technical SEO, dashboard refactor, test coverage | ✅ shipped |
| v1.1.0 | M9: self-reservation, item starring, owner bio, multiple wishlists, UX bugfix batch | ✅ shipped |

---

### Milestone 10 — Look & Feel (`v1.2.0`)

Goal:
- deliver dark theme, background parallax, English locale, and multi-currency display
- no schema migrations required; all changes are frontend-only

Status:
- ✅ M10-I1–I5 complete; M10-I6–I11 complete (bugfix + QA batch on branch fix/bugfixes-v120)
- ✅ M10-I12–I22 complete

Execution backlog:
1. ✅ Dark theme — CSS variable toggle, `localStorage` persistence, `prefers-color-scheme` default
2. ✅ Background parallax — subtle depth effect on the wallpaper pattern, CSS or JS-driven
3. ✅ English locale — `en/` i18n dictionary, locale switcher in header, browser auto-detect
4. ✅ Multiple currencies — currency per wish item, default currency preference in profile, locale-aware display formatting
5. ✅ Notification system — in-app alerts when a reserved item is updated or deleted; bell icon in nav with unread badge; `/notifications` page; `owner_updated` type for bio changes; static share token snapshots; scroll/highlight navigation; 30 s polling
6. ✅ M10-I6 Bugfixes — dashboard title line-height and underline on mobile; parallax GPU layer
7. ✅ M10-I7 Email truncation — long emails truncated with ellipsis on settings and share pages; custom tooltip on share page
8. ✅ M10-I8 Delete last wishlist — allow deleting the only remaining list; auto-create default "Мой список"
9. ✅ M10-I9 Mobile header overflow — reduce padding and gap at ≤ 479 px to eliminate horizontal scroll
10. ✅ M10-I10 Settings form state — migrate from URL params to useActionState; inline success/error feedback
11. ✅ M10-I11 Price input hint — fix inline layout (hint renders below field) and unreadable color in dark mode
12. ✅ M10-I12 Owner cancel reservation — owner can cancel a reservation made by another user on their own wish; reserver receives `reservation_cancelled` notification
13. ✅ M10-I13 Hide reservation status from owner — dashboard hides "reserved" status from the owner by default; opt-in toggle in settings; self-reservations always visible
14. ✅ M10-I14 Suppress self-reservation notifications — no notification sent when owner reserves or cancels their own wish
15. ✅ M10-I15 Reservations page status color — always blue (self-reserved style) instead of pink for cross-wishlist items
16. ✅ M10-I16 Share page cancel button style — red danger style (item-delete-btn) matching dashboard delete buttons
17. ✅ M10-I17 Standardize scroll-to-item — center alignment + highlight animation on new item creation, edit save, and notification nav; shared scrollAndHighlight() utility
18. ✅ M10-I18 Mobile background flicker on reservation — migrate wallpaper from `body::before` + CSS variables to real `<div.wallpaper-bg>` with direct `style.transform`; eliminates CSS cascade-invalidation that briefly destabilised the GPU compositing layer on mobile during RSC reconciliation
19. ✅ M10-I19 Share page stale on mobile — add `SharePageSync` client component; calls `router.refresh()` every 30 s so item additions and deletions appear without a manual reload
20. ✅ M10-I20 Notification dropdown misaligned on mobile — shift `right` offset on `.site-nav-dropdown--notifications` by gear-button-width + nav-gap; panel now right-aligned on both mobile and desktop
21. ✅ M10-I21 Notifications page mobile layout — column layout at ≤ 479 px; item name wraps; actions row aligned right; "go to" text links replaced with `notification-nav-btn` icon buttons (ExternalLinkIcon + hidden label on mobile)
22. ✅ M10-I22 Unique wishlist names — `createWishlist` and `renameWishlist` check for duplicate names (exact match after trim, per-user scope); return `"duplicate"` error code; inline error shown in create and rename forms via new i18n keys
23. ✅ M10-I23 Dashboard wishlist selection persisted — `WishlistManager` stores the selected wishlist id in `localStorage`; restored on mount so page reload lands on the last active wishlist

Recommended issue shape:
- `M10-I1 Dark theme — CSS variable toggle and system preference default`
- `M10-I2 Background parallax — depth effect on wallpaper pattern`
- `M10-I3 English locale — en/ dictionary, locale switcher, browser auto-detect`
- `M10-I4 Multiple currencies — per-item currency, default currency preference in profile, display formatting`
- `M10-I5 Notification system — in-app alerts on reserved item changes`
- `M10-I6 Bugfixes — post-notification-system bug fixes (mobile title, parallax GPU layer)`
- `M10-I7 Email truncation — ellipsis + styled tooltip on settings and share pages`
- `M10-I8 Delete last wishlist — allow deletion with auto-created default replacement`
- `M10-I9 Mobile header overflow — reduce padding/gap at ≤ 479 px`
- `M10-I10 Settings form state — useActionState, inline feedback, clean URL`
- `M10-I11 Price input hint — layout fix and dark-mode color`
- `M10-I12 Owner cancel reservation — cancel button on dashboard for others' reservations`
- `M10-I13 Hide reservations from owner — settings toggle, hidden by default`

Recommended PR order:
1. `M10-I1 Dark theme — CSS variable toggle and system preference default`
2. `M10-I2 Background parallax — depth effect on wallpaper pattern`
3. `M10-I3 English locale — en/ dictionary, locale switcher, browser auto-detect`
4. `M10-I4 Multiple currencies — per-item currency, default currency preference in profile, display formatting`
5. `M10-I5 Notification system — in-app alerts on reserved item changes`
6. `M10-I6–I11 Bugfix and QA batch — one shared PR on branch fix/bugfixes-v120`
7. `M10-I12 Owner cancel reservation`
8. `M10-I13 Hide reservations from owner`

Dependencies:
- `M10-I1` has no dependencies
- `M10-I2` has no dependencies
- `M10-I3` has no dependencies; locale switcher touches the header component
- `M10-I4` depends on the user profile (shipped in v1.1.0) for storing the default currency preference; depends on the item schema for the per-item currency field

Scope notes:
- Dark theme must not introduce client components in pages that are currently server-rendered; use a CSS class on `<html>` toggled by a small script tag or a client component at the layout boundary only. The theme toggle is placed inside the gear-icon dropdown in `NavLinks` (already a client component); no new client boundary is introduced.
- Background parallax must be lightweight — prefer CSS `background-attachment: fixed` or a minimal scroll listener; must not degrade performance on mobile; must work in both light and dark themes.
- English locale duplicates the Russian dictionary in `en/`; no machine translation, write natural English.
- Multiple currencies is display-only — no conversion rates, no external API.
  - Each wish item stores its own currency (e.g. a Wildberries item in ₽, an AliExpress item in $).
  - The user profile stores a preferred default currency (RUB by default) used when creating a new item.
  - Price formatting is locale-aware; displayed using `Intl.NumberFormat` with the item's own currency.
  - No currency conversion is performed at any point.

Acceptance targets:
- dark theme can be toggled manually; preference persists across sessions; `prefers-color-scheme: dark` is respected on first visit
- background wallpaper has a visible but subtle parallax depth effect on scroll; no jank on mobile
- all user-visible strings are available in English; switching locale changes the entire UI immediately
- owner can select a currency per item (₽, $, €, etc.) in the item form; existing items default to the profile's preferred currency at creation time
- owner can set a preferred default currency in profile settings; it pre-fills the currency field on new items
- all prices display with locale-aware formatting (symbol, separators) on dashboard, share page, and reservations page

Exit criteria:
- dark/light toggle works in all routes with no flash on load
- parallax effect is smooth on desktop; gracefully disabled or static on mobile if needed
- English locale covers 100% of i18n keys with no missing-key fallbacks
- `currency` field present on `WishlistItem` schema; migration generated via `npm run db:generate`
- `preferredCurrency` field present on `User` profile schema; migration generated via `npm run db:generate`
- per-item currency selector present in the item form (add and edit)
- preferred currency selector present in profile settings
- price formatting is consistent across dashboard, share page, and reservations page

Definition of small PRs for this milestone:
- dark theme PR only touches CSS variables, the theme toggle component, and layout wiring
- parallax PR only touches background rendering; does not touch theme logic or i18n
- locale PR only adds the `en/` dictionary, the switcher UI, and locale resolution logic; does not touch styles
- currency PR adds: `currency` column on items, `preferredCurrency` column on user profile, currency selector in item form, preferred currency picker in settings, and updated price formatting utility; does not touch locale or theme logic

Release note:
- `v1.2.0` delivers dark theme, background parallax, English language support, and multi-currency price display with per-item currency selection.

---

### Milestone 11 — Sharing & Backup (`v1.3.0`)

Goal:
- extend share capabilities with a QR code option
- give users data portability via JSON export/import
- allow attaching an image to each wishlist item

Status:
- planned

Execution backlog:
1. QR code for share links — browser-side generation, modal or inline display
2. Export / import wishlist — JSON download, JSON upload with item creation
3. Item image upload — local VPS storage, Caddy serving, `imageUrl` column

Recommended issue shape:
- `M11-I1 QR code for share links — browser-side generation and display`
- `M11-I2 Export / import wishlist — JSON download and upload`
- `M11-I3 Item image upload — VPS local storage, Caddy config, schema addition`

Recommended PR order:
1. `M11-I1 QR code for share links — browser-side generation and display`
2. `M11-I2 Export / import wishlist — JSON download and upload`
3. `M11-I3 Item image upload — VPS local storage, Caddy config, schema addition`

Dependencies:
- `M11-I1` has no dependencies
- `M11-I2` has no dependencies
- `M11-I3` has no dependencies on `M11-I1` or `M11-I2`; done last because it requires ops changes (Caddy config, VPS `/uploads` directory)

Scope notes:
- QR code must be generated entirely in the browser; no backend endpoint required. Use a small, well-maintained library (e.g. `qrcode`).
- Export format is a plain JSON array of items (title, url, note, price, priority). Import creates new items in the current wishlist; it does not overwrite or merge.
- Image upload is one image per item, stored at `/uploads/<uuid>.<ext>` on the VPS. Caddy serves the directory as static files. The `imageUrl` column stores the relative path. Max file size enforced at the Next.js API layer.
- Do not add S3 or CDN in this milestone — local VPS storage is the explicit target.

Acceptance targets:
- owner can open a QR code for an active share link and download or share it
- owner can download their wishlist as a JSON file and re-import it to restore items
- owner can upload one image per item; image is shown on the dashboard and the share page

Exit criteria:
- QR modal works without a server round-trip
- exported JSON is valid and round-trips through import without data loss
- uploaded images are served at a stable URL; Caddy config updated; `imageUrl` migration applied

Definition of small PRs for this milestone:
- QR PR only adds the client-side QR component and wires it to the share link block; does not touch the backend
- export/import PR only adds the download action and the upload/parse flow; does not touch image or QR logic
- image PR only adds the upload API route, the `imageUrl` migration, Caddy static-file config, and item card image rendering

Release note:
- `v1.3.0` adds QR code sharing, wishlist JSON export/import, and per-item image upload.

---

### Milestone 12 — Account Security (`v1.4.0`)

Goal:
- close the remaining auth gaps: email verification and password reset
- both features share the same email-sending infrastructure

Status:
- planned

Execution backlog:
1. Email infrastructure — choose and configure an SMTP or transactional email provider; add env contract
2. Email verification — send verification link on registration; unverified users see a banner
3. Password reset — «Forgot password» flow with a time-limited token sent to email

Recommended issue shape:
- `M12-I1 Email infrastructure — provider setup, env contract, send utility`
- `M12-I2 Email verification — send link on registration, verification endpoint, unverified banner`
- `M12-I3 Password reset — forgot-password form, token generation, reset endpoint`

Recommended PR order:
1. `M12-I1 Email infrastructure — provider setup, env contract, send utility`
2. `M12-I2 Email verification — send link on registration, verification endpoint, unverified banner`
3. `M12-I3 Password reset — forgot-password form, token generation, reset endpoint`

Dependencies:
- `M12-I1` has no dependencies; must land first
- `M12-I2` depends on `M12-I1`
- `M12-I3` depends on `M12-I1`

Scope notes:
- The email provider is a new external dependency; document it in `docs/runtime-environment.md` and add the required env vars to all `.env.*` templates.
- Verification is non-blocking: unverified users can still create wishlists and reserve items, but see a persistent banner prompting them to verify.
- Password reset tokens must be single-use, time-limited (e.g. 1 hour), and stored hashed. Expire on use.
- Do not add email notifications (reservation events) in this milestone — that is a future idea.

Acceptance targets:
- a transactional email is sent on registration with a verification link
- clicking the link marks the user as verified and dismisses the banner
- unverified users see a banner on every page until they verify
- owner can request a password reset from `/login`; an email arrives with a link; the link allows setting a new password exactly once

Exit criteria:
- `EMAIL_*` env vars documented and validated at startup
- `emailVerifiedAt` column migration applied
- password reset token table (or column) migration applied
- verification and reset flows work end-to-end in a production-like environment
- tokens are invalidated after use and after expiry

Definition of small PRs for this milestone:
- infrastructure PR only adds the send utility, env vars, and startup validation; sends no emails from product code
- verification PR only adds the verification email on registration, the `/verify-email` endpoint, and the unverified banner
- reset PR only adds the forgot-password form, token generation, the `/reset-password` endpoint, and token cleanup

Release note:
- `v1.4.0` adds email verification and password reset, closing the core account security gaps.

---

### Milestone 13 — Enrichment (`v1.5.0`)

Goal:
- add light usability improvements that stay within the core wishlist scope
- must not introduce public profiles or social discovery features

Status:
- planned

Execution backlog:
1. Tags / categories for items — owner tags items; filter by tag on dashboard and share page
2. Reserver note to owner — short private note attached to a reservation; shown to owner after the occasion

Recommended issue shape:
- `M13-I1 Tags / categories — schema, tag management UI, filter on dashboard and share page`
- `M13-I2 Reserver note — note field on reservation, display to owner`

Recommended PR order:
1. `M13-I1 Tags / categories — schema, tag management UI, filter on dashboard and share page`
2. `M13-I2 Reserver note — note field on reservation, display to owner`

Dependencies:
- `M13-I1` has no dependencies
- `M13-I2` has no dependencies on `M13-I1`

Scope notes:
- Tags are owner-defined free-text labels per item (e.g. «Книги», «Одежда»). No global tag taxonomy; no tag discovery across users.
- Tag filter is applied client-side or via query param; no dedicated tag pages.
- Reserver note is private — visible only to the item owner, never to other reservers. Timing of reveal (e.g. shown after a configurable date) is a future enhancement; in this milestone the note is shown immediately.
- Do not add comment threads, reactions, or any social surface in this milestone.

Acceptance targets:
- owner can add one or more tags to each item; tags appear on the item card
- dashboard and share page offer a filter by tag; selecting a tag shows only matching items
- reserver can type a short note when reserving an item; the note is shown to the owner on the dashboard

Exit criteria:
- `tags` column (or join table) migration applied; filter works correctly with zero, one, and multiple tags active
- `note` column on `reservations` migration applied; note is shown to owner and hidden from all other actors

Definition of small PRs for this milestone:
- tags PR only adds the schema change, tag input UI on the item form, and the tag filter component; does not touch reservations
- note PR only adds the `note` field to the reservation form and the owner-side display; does not touch tags

Release note:
- `v1.5.0` adds item tags with filtering and a private reserver-to-owner note on each reservation.

---

## Future Ideas (no milestone)

| Idea | Notes |
|---|---|
| **Marketplace image parsing** | Parse a product URL → auto-fill title, price, image from Wildberries / Ozon / etc. Fragile; far future. |
| **Email notifications (opt-in)** | Notify owner when an item is reserved or reservation is cancelled. Requires M12 email infrastructure. |
| **OAuth login** | GitHub, Google, Yandex. Needs account-merging logic if the same person registered by email first. |
| **S3-compatible image storage** | Replace VPS local uploads with Yandex Object Storage or MinIO when scale demands it. |
| **Size / measurement fields in profile** | Structured fields (height, weight, clothing size, shoe size) — after «О себе» bio lands in M9-I4. |
| **Export / import via QR** | Encode a small wishlist into a QR code. Limited by QR data capacity. |
