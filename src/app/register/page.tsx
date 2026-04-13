import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/modules/auth/server/current-user";
import { MIN_PASSWORD_LENGTH } from "@/modules/auth/server/register-input";
import { getTranslations } from "@/modules/i18n";
import { PageShell } from "@/shared/ui/page-shell";

const common = getTranslations("common");
const messages = getTranslations("app");

type RegisterPageProps = {
  searchParams?: Promise<{
    status?: string;
    error?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/app");
  }

  const params = searchParams ? await searchParams : undefined;
  const status = params?.status;
  const errorCode = params?.error;

  return (
    <PageShell
      eyebrow={common.routeSkeleton}
      title={messages.register.title}
      description={messages.register.description}
    >
      {status === "success" ? (
        <div className="ui-message ui-message-success space-y-3">
          <p>{messages.register.successMessage}</p>
          <Link href="/login" className="ui-button ui-button-secondary inline-flex">
            {messages.register.successLinkLabel}
          </Link>
        </div>
      ) : null}
      {errorCode ? (
        <p className="ui-message ui-message-error">{getRegisterErrorMessage(errorCode)}</p>
      ) : null}
      <div className="space-y-6">
        <form action={registerAction} className="ui-form">
          <div className="ui-field">
            <label className="ui-label" htmlFor="email">
              {messages.register.emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="ui-input"
              required
            />
          </div>
          <div className="ui-field">
            <label className="ui-label" htmlFor="password">
              {messages.register.passwordLabel}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={MIN_PASSWORD_LENGTH}
              className="ui-input"
              required
            />
            <p className="ui-note">{messages.register.minPasswordHint}</p>
          </div>
          <button type="submit" className="ui-button">
            {messages.register.submitLabel}
          </button>
        </form>
        <p className="text-sm text-[color:var(--color-text-base)]">
          {messages.register.loginHint}{" "}
          <Link href="/login" className="font-medium underline underline-offset-2">
            {messages.register.loginLinkLabel}
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

async function registerAction(formData: FormData) {
  "use server";

  const { registerUser } = await import("@/modules/auth/server/register");

  const result = await registerUser({
    email: getFormValue(formData, "email"),
    password: getFormValue(formData, "password"),
  });

  if (result.status === "success") {
    redirect("/register?status=success");
  }

  redirect(`/register?error=${result.code}`);
}

function getFormValue(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);

  return typeof value === "string" ? value : "";
}

function getRegisterErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "invalid-email":
      return messages.register.errors.invalidEmail;
    case "password-too-short":
      return messages.register.errors.passwordTooShort;
    case "email-taken":
      return messages.register.errors.emailTaken;
    default:
      return messages.register.errors.unknown;
  }
}
