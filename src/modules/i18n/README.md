# i18n Foundation

## Default Locale
- `ru` is the default locale for the current foundation.

## Structure
- `src/modules/i18n/server.ts`: centralized access to locale dictionaries
- `src/modules/i18n/dictionaries/ru/*`: namespace-based dictionaries for Russian

## Namespaces
- `common`: shared short labels
- `metadata`: application metadata strings
- `app`: current app shell route text

## Growth Rule
- Add future locales by mirroring the same namespace files, for example
  `src/modules/i18n/dictionaries/en/*`, without changing the `getTranslations`
  call sites.
