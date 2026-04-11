import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/modules/auth/server/current-user";
import { getTranslations } from "@/modules/i18n";
import { getCurrentWishlistWithItems } from "@/modules/wishlist/server/items";
import { PageShell } from "@/shared/ui/page-shell";

const common = getTranslations("common");
const messages = getTranslations("app");

export default async function AppPage() {
  const user = await requireCurrentUser();
  const wishlist = await getCurrentWishlistWithItems(user.id);

  return (
    <PageShell
      eyebrow={common.routeSkeleton}
      title={messages.dashboard.title}
      description={messages.dashboard.description}
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-3">
            <p className="ui-note">{messages.dashboard.summaryLabel}</p>
            <div
              className="ui-surface p-5"
              style={{ background: "var(--color-bg-subtle)" }}
            >
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="ui-note">ID</dt>
                  <dd className="mt-1 break-all font-medium text-[color:var(--color-text-strong)]">
                    {wishlist.id}
                  </dd>
                </div>
                <div>
                  <dt className="ui-note">{messages.dashboard.itemCountLabel}</dt>
                  <dd className="mt-1 font-medium text-[color:var(--color-text-strong)]">
                    {wishlist.items.length}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="ui-button">
              {messages.dashboard.logoutLabel}
            </button>
          </form>
        </div>

        {wishlist.items.length === 0 ? (
          <section className="ui-surface p-6">
            <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">
              {messages.dashboard.emptyTitle}
            </h2>
            <p className="mt-3 text-[color:var(--color-text-base)]">
              {messages.dashboard.emptyDescription}
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-[color:var(--color-text-strong)]">
              {messages.dashboard.itemsTitle}
            </h2>
            <ul className="space-y-4">
              {wishlist.items.map((item) => (
                <li key={item.id} className="ui-surface p-6">
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold text-[color:var(--color-text-strong)]">
                      {item.title}
                    </h3>
                    {item.url ? (
                      <p className="text-sm text-[color:var(--color-text-base)] break-all">
                        <span className="font-medium text-[color:var(--color-text-strong)]">
                          {messages.dashboard.itemFields.url}: 
                        </span>
                        {item.url}
                      </p>
                    ) : null}
                    {item.note ? (
                      <p className="text-sm text-[color:var(--color-text-base)]">
                        <span className="font-medium text-[color:var(--color-text-strong)]">
                          {messages.dashboard.itemFields.note}: 
                        </span>
                        {item.note}
                      </p>
                    ) : null}
                    {item.price ? (
                      <p className="text-sm text-[color:var(--color-text-base)]">
                        <span className="font-medium text-[color:var(--color-text-strong)]">
                          {messages.dashboard.itemFields.price}: 
                        </span>
                        {item.price}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageShell>
  );
}

async function logoutAction() {
  "use server";

  const cookieStore = await cookies();
  const [{ AUTH_SESSION_COOKIE_NAME, clearSessionCookie }, { logoutUser }] = await Promise.all([
    import("@/modules/auth/server/session"),
    import("@/modules/auth/server/logout"),
  ]);

  await logoutUser(cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value);
  await clearSessionCookie();

  redirect("/login?status=logged-out");
}
