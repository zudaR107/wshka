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
            <rect x="6" y="10" width="20" height="17" rx="2.5" fill="white" />
            <rect x="14.5" y="10" width="3" height="17" fill="#3b82f6" opacity="0.22" />
            <path d="M16 10 C15 7 10 6.5 10.5 9 C11 10.5 16 10 16 10 Z" fill="#93c5fd" />
            <path d="M16 10 C17 7 22 6.5 21.5 9 C21 10.5 16 10 16 10 Z" fill="#93c5fd" />
            <circle cx="16" cy="10" r="1.5" fill="white" />
          </svg>
          {common.brand}
        </Link>
        {user ? <NavLinks onLogout={onLogout} /> : <GuestLinks />}
      </div>
    </header>
  );
}
