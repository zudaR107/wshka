import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "@/modules/i18n";
import { getLocale } from "@/modules/i18n/server";

export const metadata: Metadata = {
  robots: { index: false },
};

export default async function NotFound() {
  const locale = await getLocale();
  const messages = getTranslations("app", locale);
  const { code, title, description, backLabel } = messages.notFound;

  return (
    <div className="not-found-page">
      <p className="not-found-code" aria-hidden="true">{code}</p>
      <h1 className="not-found-title">{title}</h1>
      <p className="not-found-description">{description}</p>
      <Link href="/" className="ui-button">
        {backLabel}
      </Link>
    </div>
  );
}
