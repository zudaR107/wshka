import { getTranslations } from "@/modules/i18n";
import { PageShell } from "@/shared/ui/page-shell";

const common = getTranslations("common");
const messages = getTranslations("app");

export default function ReservationsPage() {
  return (
    <PageShell
      eyebrow={common.routeSkeleton}
      title={messages.reservations.title}
      description={messages.reservations.description}
    />
  );
}
