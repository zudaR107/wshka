"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "@/modules/i18n";

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function formatNotificationDate(iso: string, locale: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (locale === "en") {
    if (diffMinutes < 1) return "just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  if (diffMinutes < 1) return "только что";
  if (diffMinutes < 60) return `${diffMinutes} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const current = document.documentElement.classList.contains("dark") ? "dark" : "light";
    setTheme(stored ?? current);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return { theme, toggleTheme };
}

export type RecentNotification = {
  id: string;
  type: "item_updated" | "item_deleted";
  itemId: string | null;
  itemTitle: string;
  wishlistId: string;
  readAt: string | null;
  createdAt: string;
};

type NavLinksProps = {
  email: string;
  unreadCount: number;
  recentNotifications: RecentNotification[];
  onLogout: () => Promise<void>;
  onMarkAllRead: () => Promise<void>;
};

export function NavLinks({
  email,
  unreadCount,
  recentNotifications,
  onLogout,
  onMarkAllRead,
}: NavLinksProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const locale = useLocale();
  const common = useTranslations("common");
  const app = useTranslations("app");
  const isSettingsActive = pathname === "/settings";
  const isNotificationsActive = pathname === "/notifications";
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  function handleLocaleSwitch() {
    const next = locale === "ru" ? "en" : "ru";
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (!bellOpen) return;
    function handleOutside(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [bellOpen]);

  return (
    <nav className="site-nav">
      <Link
        href="/"
        className={`site-nav-link${pathname === "/" ? " site-nav-link--active" : ""}`}
      >
        {common.nav.wishlist}
      </Link>
      <Link
        href="/reservations"
        className={`site-nav-link${pathname === "/reservations" ? " site-nav-link--active" : ""}`}
      >
        {common.nav.reservations}
      </Link>

      {/* Bell / notifications */}
      <div className="site-nav-bell" ref={bellRef}>
        <button
          type="button"
          className={`site-nav-gear${isNotificationsActive ? " site-nav-gear--active" : ""}`}
          aria-label={common.nav.notificationsLabel}
          aria-expanded={bellOpen}
          onClick={() => setBellOpen((v) => !v)}
        >
          <span className="site-nav-bell-wrapper">
            <BellIcon />
            {unreadCount > 0 && (
              <span className="site-nav-bell-badge" aria-hidden="true">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </span>
        </button>
        {bellOpen && (
          <div className="site-nav-dropdown site-nav-dropdown--notifications">
            <div className="site-nav-dropdown-notifications-header">
              <span className="site-nav-dropdown-notifications-title">
                {common.nav.notifications}
              </span>
              {unreadCount > 0 && (
                <form action={onMarkAllRead}>
                  <button
                    type="submit"
                    className="site-nav-dropdown-notifications-mark-read"
                    onClick={() => setBellOpen(false)}
                  >
                    {app.notifications.markAllRead}
                  </button>
                </form>
              )}
            </div>
            <div className="site-nav-dropdown-divider" />
            {recentNotifications.length === 0 ? (
              <p className="site-nav-dropdown-notifications-empty">
                {app.notifications.noUnread}
              </p>
            ) : (
              recentNotifications.map((n) => (
                <Link
                  key={n.id}
                  href="/notifications"
                  className={`site-nav-dropdown-notification${n.readAt ? "" : " site-nav-dropdown-notification--unread"}`}
                  onClick={() => setBellOpen(false)}
                >
                  <span className="site-nav-dropdown-notification-icon" aria-hidden="true">
                    {n.type === "item_updated" ? "✏️" : "🗑️"}
                  </span>
                  <span className="site-nav-dropdown-notification-body">
                    <span className="site-nav-dropdown-notification-type">
                      {n.type === "item_updated"
                        ? app.notifications.itemUpdated
                        : app.notifications.itemDeleted}
                    </span>
                    <span className="site-nav-dropdown-notification-name">{n.itemTitle}</span>
                    <span className="site-nav-dropdown-notification-date">
                      {formatNotificationDate(n.createdAt, locale)}
                    </span>
                  </span>
                </Link>
              ))
            )}
            <div className="site-nav-dropdown-divider" />
            <Link
              href="/notifications"
              className="site-nav-dropdown-item"
              onClick={() => setBellOpen(false)}
            >
              {app.notifications.viewAll}
            </Link>
          </div>
        )}
      </div>

      <div className="site-nav-menu" ref={menuRef}>
        <button
          type="button"
          className={`site-nav-gear${isSettingsActive ? " site-nav-gear--active" : ""}`}
          aria-label={common.nav.accountMenu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        {open && (
          <div className="site-nav-dropdown">
            <span className="site-nav-dropdown-email">{email}</span>
            <div className="site-nav-dropdown-divider" />
            <Link
              href="/settings"
              className="site-nav-dropdown-item site-nav-dropdown-item--icon"
              onClick={() => setOpen(false)}
            >
              <SettingsIcon />
              {common.nav.settings}
            </Link>
            <button
              type="button"
              className="site-nav-dropdown-item site-nav-dropdown-item--icon"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              {theme === "dark" ? common.nav.themeLight : common.nav.themeDark}
            </button>
            <button
              type="button"
              className="site-nav-dropdown-item site-nav-dropdown-item--icon"
              aria-label={common.nav.localeSwitcherLabel}
              onClick={handleLocaleSwitch}
            >
              <GlobeIcon />
              {locale === "ru" ? common.nav.localeEn : common.nav.localeRu}
            </button>
            <form action={onLogout}>
              <button type="submit" className="site-nav-dropdown-item site-nav-dropdown-item--icon">
                <LogoutIcon />
                {common.nav.logout}
              </button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}

export function GuestLinks() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const locale = useLocale();
  const common = useTranslations("common");

  function handleLocaleSwitch() {
    const next = locale === "ru" ? "en" : "ru";
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.refresh();
  }

  return (
    <nav className="site-nav site-nav--guest">
      <button
        type="button"
        className="site-nav-gear"
        aria-label={theme === "dark" ? common.nav.themeLight : common.nav.themeDark}
        onClick={toggleTheme}
      >
        {theme === "dark" ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
      <button
        type="button"
        className="site-nav-gear"
        aria-label={common.nav.localeSwitcherLabel}
        onClick={handleLocaleSwitch}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </button>
      <Link
        href="/login"
        className={`site-nav-link${pathname === "/login" ? " site-nav-link--active" : ""}`}
      >
        {common.nav.login}
      </Link>
      <Link href="/register" className="ui-button">
        {common.nav.register}
      </Link>
    </nav>
  );
}
