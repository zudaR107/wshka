import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "@/modules/i18n";

export const metadata: Metadata = {
  robots: { index: false },
};

const messages = getTranslations("app");

export default function NotFound() {
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
