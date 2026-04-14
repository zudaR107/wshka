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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            style={{ width: 28, height: 28, flexShrink: 0 }}
          >
            <rect width="32" height="32" rx="7" fill="#3b82f6" />
            <rect x="7" y="18" width="18" height="9" rx="2" fill="white" />
            <rect x="6" y="13" width="20" height="6" rx="2" fill="white" />
            <rect x="14.5" y="13" width="3" height="14" fill="#3b82f6" />
            <path d="M16 13 C15 10 10 9.5 10.5 12 C11 13.5 16 13 16 13 Z" fill="#93c5fd" />
            <path d="M16 13 C17 10 22 9.5 21.5 12 C21 13.5 16 13 16 13 Z" fill="#93c5fd" />
            <circle cx="16" cy="13" r="1.5" fill="white" />
          </svg>
          {common.brand}
        </Link>
        {user ? <NavLinks onLogout={onLogout} /> : <GuestLinks />}
      </div>
    </header>
  );
}
