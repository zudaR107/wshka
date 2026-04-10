import { getTranslations } from "@/modules/i18n";
import { PageShell } from "@/shared/ui/page-shell";

const common = getTranslations("common");
const messages = getTranslations("app");

export default function AppPage() {
  return (
    <PageShell
      eyebrow={common.routeSkeleton}
      title={messages.dashboard.title}
      description={messages.dashboard.description}
    />
  );
}
