import { app as ruApp } from "@/modules/i18n/dictionaries/ru/app";
import { common as ruCommon } from "@/modules/i18n/dictionaries/ru/common";
import { metadata as ruMetadata } from "@/modules/i18n/dictionaries/ru/metadata";
import { app as enApp } from "@/modules/i18n/dictionaries/en/app";
import { common as enCommon } from "@/modules/i18n/dictionaries/en/common";
import { metadata as enMetadata } from "@/modules/i18n/dictionaries/en/metadata";

const dictionaries = {
  ru: { app: ruApp, common: ruCommon, metadata: ruMetadata },
  en: { app: enApp, common: enCommon, metadata: enMetadata },
} as const;

export const defaultLocale = "ru" as const;
export const locales = ["ru", "en"] as const;

export type I18nLocale = (typeof locales)[number];
export type I18nNamespace = keyof (typeof dictionaries)[typeof defaultLocale];

export function getTranslations<TNamespace extends I18nNamespace>(
  namespace: TNamespace,
  locale: I18nLocale = defaultLocale,
) {
  return dictionaries[locale][namespace];
}
