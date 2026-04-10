import { app } from "@/modules/i18n/dictionaries/ru/app";
import { common } from "@/modules/i18n/dictionaries/ru/common";
import { metadata } from "@/modules/i18n/dictionaries/ru/metadata";

const dictionaries = {
  ru: {
    app,
    common,
    metadata,
  },
} as const;

export const defaultLocale = "ru";

export type I18nLocale = keyof typeof dictionaries;
export type I18nNamespace = keyof (typeof dictionaries)[typeof defaultLocale];

export function getTranslations<TNamespace extends I18nNamespace>(namespace: TNamespace) {
  return dictionaries[defaultLocale][namespace];
}
