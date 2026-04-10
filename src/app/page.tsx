import Link from "next/link";
import { getTranslations } from "@/modules/i18n";
import { PageShell } from "@/shared/ui/page-shell";

const common = getTranslations("common");
const messages = getTranslations("app");

const routes = [
  { href: "/login", label: messages.home.links.login },
  { href: "/register", label: messages.home.links.register },
  { href: "/app", label: messages.home.links.app },
  { href: "/app/reservations", label: messages.home.links.reservations },
  { href: "/share/demo-token", label: messages.home.links.share },
];

export default function HomePage() {
  return (
    <PageShell
      eyebrow={common.brand}
      title={messages.home.title}
      description={messages.home.description}
    >
      <div className="space-y-4">
        <p className="text-sm leading-6 text-slate-600">{messages.home.routesHint}</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="block rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
