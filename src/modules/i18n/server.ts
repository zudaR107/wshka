import { cookies } from "next/headers";
import { type I18nLocale, locales, defaultLocale } from "@/modules/i18n/get-dictionary";

export async function getLocale(): Promise<I18nLocale> {
  try {
    const store = await cookies();
    const value = store.get("locale")?.value;
    return locales.includes(value as I18nLocale) ? (value as I18nLocale) : defaultLocale;
  } catch {
    return defaultLocale;
  }
}
