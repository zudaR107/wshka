import { getTranslations } from "@/modules/i18n";
import { PageShell } from "@/shared/ui/page-shell";

const common = getTranslations("common");
const messages = getTranslations("app");

export default function SharePage() {
  return (
    <PageShell
      eyebrow={common.routeSkeleton}
      title={messages.share.title}
      description={messages.share.description}
    />
  );
}
