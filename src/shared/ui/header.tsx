import Link from "next/link";
import { getTranslations } from "@/modules/i18n";
import { NavLinks, GuestLinks } from "@/shared/ui/nav-links";

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
        {user ? <NavLinks onLogout={onLogout} /> : <GuestLinks />}
      </div>
    </header>
  );
}
