"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/modules/i18n";
import { CurrencySelect } from "@/shared/ui/currency-select";
import { type CurrencyCode } from "@/shared/lib/currency";
import { saveSettingsAction, type SaveSettingsState } from "./actions";

type SettingsFormProps = {
  defaultBio: string;
  defaultCurrency: CurrencyCode;
  defaultShowReservations: boolean;
};

export function SettingsForm({ defaultBio, defaultCurrency, defaultShowReservations }: SettingsFormProps) {
  const messages = useTranslations("app");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);
  const [showReservations, setShowReservations] = useState(defaultShowReservations);
  const [savedRecently, setSavedRecently] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, formAction] = useActionState<SaveSettingsState, FormData>(
    saveSettingsAction,
    null,
  );

  // Sync currency/reservations when server re-delivers fresh props after router.refresh().
  useEffect(() => {
    setCurrency(defaultCurrency);
  }, [defaultCurrency]);

  useEffect(() => {
    setShowReservations(defaultShowReservations);
  }, [defaultShowReservations]);

  // On any result: show transient button state, then reset after 2.5 s.
  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      startTransition(() => router.refresh());
    }
    setSavedRecently(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSavedRecently(false), 2500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state?.key]);

  return (
    <form action={formAction}>
      {/* Bio section */}
      <section className="settings-section">
        <p className="content-section-label">{messages.settings.bioSection}</p>
        <div className="settings-bio-field">
          <textarea
            id="bio"
            name="bio"
            aria-label={messages.settings.bioLabel}
            className="settings-bio-textarea"
            maxLength={500}
            rows={4}
            defaultValue={defaultBio}
            placeholder={messages.settings.bioPlaceholder}
          />
          <p className="ui-note">{messages.settings.bioHint}</p>
        </div>
      </section>

      {/* Currency section */}
      <section className="settings-section" style={{ marginTop: "var(--space-6)" }}>
        <p className="content-section-label">{messages.settings.currencySection}</p>
        <div className="settings-bio-field">
          <CurrencySelect
            name="preferredCurrency"
            value={currency}
            onChange={setCurrency}
            label={messages.settings.currencyLabel}
          />
          <p className="ui-note">{messages.settings.currencyHint}</p>
        </div>
      </section>

      {/* Reservations visibility section */}
      <section className="settings-section" style={{ marginTop: "var(--space-6)" }}>
        <p className="content-section-label">{messages.settings.reservationsSection}</p>
        <div className="settings-bio-field">
          <label className="settings-toggle-label">
            <input
              type="checkbox"
              name="showReservationsOnDashboard"
              value="true"
              checked={showReservations}
              onChange={(e) => setShowReservations(e.target.checked)}
              className="settings-toggle-input"
            />
            <span className="settings-toggle-track" />
            {messages.settings.showReservationsLabel}
          </label>
          <p className="ui-note">{messages.settings.showReservationsHint}</p>
        </div>
      </section>

      <button
        type="submit"
        data-testid="settings-save-btn"
        className={[
          "ui-button settings-bio-submit",
          savedRecently && state?.status === "success" ? "ui-button-success" : "",
          savedRecently && state?.status === "error" ? "ui-button-error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {savedRecently && state?.status === "success"
          ? messages.settings.bioSavedLabel
          : savedRecently && state?.status === "error"
            ? messages.settings.bioErrorLabel
            : messages.settings.bioSaveLabel}
      </button>
    </form>
  );
}
