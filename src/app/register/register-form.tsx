"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "@/modules/i18n";
import { PasswordInput } from "@/shared/ui/password-input";
import { registerAction, type RegisterState } from "./actions";

const MIN_PASSWORD_LENGTH = 8;

export function RegisterForm() {
  const messages = useTranslations("app");
  const errs = messages.register.errors;

  const [state, action] = useActionState<RegisterState, FormData>(registerAction, null);
  const err = state?.error ?? null;

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordWrapperRef = useRef<HTMLDivElement>(null);
  const confirmWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!err) return;
    if (err === "invalid-email" || err === "email-taken") {
      emailRef.current?.focus();
    } else if (err === "password-too-short") {
      passwordWrapperRef.current?.querySelector("input")?.focus();
    } else if (err === "passwords-dont-match") {
      confirmWrapperRef.current?.querySelector("input")?.focus();
    }
  }, [state]);

  return (
    <form key={state?.key ?? 0} action={action} className="ui-form" style={{ maxWidth: "none" }} noValidate>
      <div className="ui-field">
        <label className="ui-label" htmlFor="email">
          {messages.register.emailLabel}
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={err === "invalid-email" || err === "email-taken" ? "ui-input ui-input-error" : "ui-input"}
          maxLength={320}
          defaultValue={state?.values?.email ?? ""}
        />
        {err === "invalid-email" ? (
          <p className="ui-note ui-note-error">{errs.invalidEmail}</p>
        ) : err === "email-taken" ? (
          <p className="ui-note ui-note-error">{errs.emailTaken}</p>
        ) : null}
      </div>
      <div className="ui-field">
        <label className="ui-label" htmlFor="password">
          {messages.register.passwordLabel}
        </label>
        <div ref={passwordWrapperRef}>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            error={err === "password-too-short"}
          />
        </div>
        {err === "password-too-short" ? (
          <p className="ui-note ui-note-error">{errs.passwordTooShort}</p>
        ) : (
          <p className="ui-note">{messages.register.minPasswordHint}</p>
        )}
      </div>
      <div className="ui-field">
        <label className="ui-label" htmlFor="confirmPassword">
          {messages.register.confirmPasswordLabel}
        </label>
        <div ref={confirmWrapperRef}>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            error={err === "passwords-dont-match"}
          />
        </div>
        {err === "passwords-dont-match" ? (
          <p className="ui-note ui-note-error">{errs.passwordMismatch}</p>
        ) : null}
      </div>
      <div className="ui-consent">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          className="ui-consent-checkbox"
          defaultChecked={state?.values?.consent ?? false}
        />
        <label htmlFor="consent" className="ui-consent-label">
          {messages.register.consentPrefix}{" "}
          <Link href="/privacy" className="ui-consent-link" target="_blank">
            {messages.register.consentLinkLabel}
          </Link>{" "}
          {messages.register.consentSuffix}
        </label>
      </div>
      {err === "consent-required" || err === "unknown" ? (
        <p className="ui-note ui-note-error">
          {err === "consent-required" ? errs.consentRequired : errs.unknown}
        </p>
      ) : null}
      <button type="submit" className="ui-button ui-button-full">
        {messages.register.submitLabel}
      </button>
    </form>
  );
}
