import type { Metadata } from "next";
import { requireCurrentUser } from "@/modules/auth/server/current-user";
import { getUserProfile } from "@/modules/auth/server/update-bio";
import { getTranslations } from "@/modules/i18n";
import { getLocale } from "@/modules/i18n/server";
import { parseCurrency } from "@/shared/lib/currency";
import { SettingsForm } from "./_form";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getTranslations("app", locale);
  return {
    title: m.settings.title,
    robots: { index: false },
  };
}

export default async function SettingsPage() {
  const [user, locale] = await Promise.all([requireCurrentUser(), getLocale()]);
  const profile = await getUserProfile(user.id);

  const common = getTranslations("common", locale);
  const messages = getTranslations("app", locale);

  const preferredCurrency = parseCurrency(profile?.preferredCurrency);

  return (
    <div className="content-page">
      <div className="content-page-header">
        <p className="page-brand-label">{common.brand}</p>
        <h1 className="content-page-title">{messages.settings.title}</h1>
        <p className="content-page-description">{messages.settings.description}</p>
      </div>

      {/* Account section */}
      <section className="settings-section">
        <p className="content-section-label">{messages.settings.accountSection}</p>
        <div className="settings-field-row">
          <span className="settings-field-label">{messages.settings.emailLabel}</span>
          <span className="settings-field-value" title={user.email}>{user.email}</span>
        </div>
      </section>

      <SettingsForm
        defaultBio={profile?.bio ?? ""}
        defaultCurrency={preferredCurrency}
      />
    </div>
  );
}
