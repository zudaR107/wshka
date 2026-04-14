import Link from "next/link";
import { getTranslations } from "@/modules/i18n";

const common = getTranslations("common");

type HeaderUser = {
  id: string;
};

type HeaderProps = {
  user: HeaderUser | null;
  onLogout: () => Promise<void>;
};

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          {common.brand}
        </Link>
        <nav className="site-nav">
          {user ? (
            <>
              <Link href="/app" className="site-nav-link">
                {common.nav.wishlist}
              </Link>
              <Link href="/app/reservations" className="site-nav-link">
                {common.nav.reservations}
              </Link>
              <form action={onLogout}>
                <button type="submit" className="ui-button ui-button-secondary">
                  {common.nav.logout}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="site-nav-link">
                {common.nav.login}
              </Link>
              <Link href="/register" className="ui-button">
                {common.nav.register}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
