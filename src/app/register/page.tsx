import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/server/current-user";
import { getTranslations } from "@/modules/i18n";
import { getLocale } from "@/modules/i18n/server";
import { RegisterForm } from "./register-form";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getTranslations("app", locale);
  return {
    title: m.register.title,
    robots: { index: false },
  };
}

export default async function RegisterPage() {
  const [currentUser, locale] = await Promise.all([getCurrentUser(), getLocale()]);

  if (currentUser) {
    redirect("/");
  }

  const common = getTranslations("common", locale);
  const messages = getTranslations("app", locale);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <p className="auth-card-logo">{common.brand}</p>
          <h1 className="auth-card-title">{messages.register.title}</h1>
          <p className="auth-card-description">{messages.register.description}</p>
        </div>

        <RegisterForm />

        <p className="auth-card-footer">
          {messages.register.loginHint}{" "}
          <Link href="/login" className="auth-card-footer-link">
            {messages.register.loginLinkLabel}
          </Link>
        </p>
      </div>
    </div>
  );
}
