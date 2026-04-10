import type { Metadata } from "next";
import type { ReactNode } from "react";
import { defaultLocale, getTranslations } from "@/modules/i18n";
import "./globals.css";

const metadataMessages = getTranslations("metadata");

export const metadata: Metadata = {
  title: metadataMessages.title,
  description: metadataMessages.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
