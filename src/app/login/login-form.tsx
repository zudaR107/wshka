"use client";

import { useActionState, useEffect, useRef } from "react";
import { useTranslations } from "@/modules/i18n";
import { PasswordInput } from "@/shared/ui/password-input";
import { loginAction, type LoginState } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const messages = useTranslations("app");

  function getErrorMessage(code: string): string {
    switch (code) {
      case "invalid-input":
        return messages.login.errors.invalidInput;
      case "invalid-credentials":
        return messages.login.errors.invalidCredentials;
      default:
        return messages.login.errors.unknown;
    }
  }

  const [state, action] = useActionState<LoginState, FormData>(loginAction, null);
  const err = state?.error ?? null;
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (err) emailRef.current?.focus();
  }, [state]);

  return (
    <form key={state?.key ?? 0} action={action} className="ui-form" style={{ maxWidth: "none" }} noValidate>
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <div className="ui-field">
        <label className="ui-label" htmlFor="email">
          {messages.login.emailLabel}
        </label>
        <input
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={err ? "ui-input ui-input-error" : "ui-input"}
          maxLength={320}
          defaultValue={state?.values?.email ?? ""}
        />
      </div>
      <div className="ui-field">
        <label className="ui-label" htmlFor="password">
          {messages.login.passwordLabel}
        </label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          error={!!err}
        />
        {err ? (
          <p className="ui-note ui-note-error">{getErrorMessage(err)}</p>
        ) : null}
      </div>
      <button type="submit" className="ui-button ui-button-full">
        {messages.login.submitLabel}
      </button>
    </form>
  );
}
