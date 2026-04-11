# UI Foundation

## Theme Scope
- Light theme only for now.

## Tokens
- Theme tokens live in `src/app/globals.css` as CSS custom properties.
- Current token groups: colors, typography, spacing, radii, focus states.

## Foundation Blocks
- `PageShell`: base page container and surface composition.
- `LinkCard`: neutral interactive card for route-level navigation.

## Current Usage
- The current auth screens reuse the same token-driven primitives for forms,
  buttons, inputs, and status messages in `src/app/globals.css`.
- The owner dashboard now reuses the same primitives for wishlist summary,
  empty states, item create/update forms, delete controls, and status messages.

## Growth Rule
- Add future theme tokens by extending the same custom property contract.
- Keep new primitives small and driven by real reuse in the app shell.
