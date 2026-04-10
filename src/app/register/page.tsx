import { getTranslations } from "@/modules/i18n";
import { PageShell } from "@/shared/ui/page-shell";

const common = getTranslations("common");
const messages = getTranslations("app");

export default function RegisterPage() {
  return (
    <PageShell
      eyebrow={common.routeSkeleton}
      title={messages.register.title}
      description={messages.register.description}
    />
  );
}
