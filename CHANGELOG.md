# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog, and this project follows SemVer.

## [Unreleased]

### Planned
- Milestone 3: wishlist core.

## [0.3.0] - 2026-04-11

### Added
- Auth schema foundation with `users` and `sessions` tables.
- Password hashing, verification, and email normalization helpers.
- Email registration flow with server-side validation and duplicate email handling.
- Login and logout flow with server-side session creation and removal.
- HTTP-only session cookie handling for auth flow.
- Minimal server-side session guards for `/app` and `/app/reservations`.
- Auth coverage across helpers, flows, guards, and minimal e2e checks.

## [0.2.0] - 2026-04-10

### Added
- Next.js app shell and route skeleton.
- App-level CI baseline with install, typecheck, build, and smoke checks.
- Modular source boundaries for `app`, `modules`, and `shared`.
- PostgreSQL and Drizzle foundation.
- Russian i18n foundation.
- Light theme UI foundation.

## [0.1.0] - 2026-04-10

### Added
- Repository scaffold.
- PR and issue templates.
- Baseline PR validation workflow.
- Minimal documentation foundation.
