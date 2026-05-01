import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "@/modules/i18n";
import { getLocale } from "@/modules/i18n/server";
import { LocaleProvider } from "@/modules/i18n/locale-provider";
import { getCurrentUser } from "@/modules/auth/server/current-user";
import { Header } from "@/shared/ui/header";
import { Footer } from "@/shared/ui/footer";
import { CookieBanner } from "@/shared/ui/cookie-banner";
import { WallpaperParallax } from "@/shared/ui/wallpaper-parallax";
import { logoutAction } from "@/app/auth-actions";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getTranslations("metadata", locale);

  return {
    metadataBase: new URL("https://wshka.ru"),
    title: {
      default: m.title,
      template: "%s | WSHKA",
    },
    description: m.description,
    openGraph: {
      type: "website",
      locale: locale === "en" ? "en_US" : "ru_RU",
      siteName: "WSHKA",
    },
    twitter: {
      card: "summary",
    },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme'),p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if((s||p)==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <LocaleProvider locale={locale}>
          <WallpaperParallax />
          <div className="app-layout">
            <Header user={user} onLogout={logoutAction} />
            <main className="app-main">{children}</main>
            <Footer />
            <CookieBanner />
          </div>
        </LocaleProvider>
      </body>
    </html>
  );
}
