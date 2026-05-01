"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { getTranslations, type I18nLocale, type I18nNamespace } from "@/modules/i18n/get-dictionary";

const LocaleContext = createContext<I18nLocale>("ru");

type LocaleProviderProps = {
  locale: I18nLocale;
  children: ReactNode;
};

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): I18nLocale {
  return useContext(LocaleContext);
}

export function useTranslations<TNamespace extends I18nNamespace>(namespace: TNamespace) {
  const locale = useContext(LocaleContext);
  return getTranslations(namespace, locale);
}
