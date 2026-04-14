import Link from "next/link";
import { getTranslations } from "@/modules/i18n";

const common = getTranslations("common");

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>{common.footer.copyright}</p>
        <nav className="site-footer-links">
          <Link href="/privacy" className="site-footer-link">
            {common.footer.privacy}
          </Link>
          <Link href="/terms" className="site-footer-link">
            {common.footer.terms}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
