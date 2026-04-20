"use client";

type Props = {
  formId: string;
  inputName: string;
  className?: string;
  children: React.ReactNode;
};

export function OpenFormButton({ formId, inputName, className, children }: Props) {
  return (
    <button
      className={className}
      onClick={() => {
        const details = document.getElementById(formId) as HTMLDetailsElement | null;
        if (!details) return;
        details.open = true;
        details.scrollIntoView({ behavior: "smooth", block: "start" });
        details.querySelector<HTMLElement>(`[name="${inputName}"]`)?.focus({ preventScroll: true });
      }}
    >
      {children}
    </button>
  );
}

type SummaryProps = {
  inputName: string;
  className?: string;
  "data-testid"?: string;
  children: React.ReactNode;
};

export function AddItemSummary({ inputName, className, children, ...rest }: SummaryProps) {
  return (
    <summary
      className={className}
      {...rest}
      onClick={(e) => {
        const details = (e.currentTarget as HTMLElement).closest("details");
        if (details && !details.open) {
          requestAnimationFrame(() => {
            details.scrollIntoView({ behavior: "smooth", block: "start" });
            details.querySelector<HTMLElement>(`[name="${inputName}"]`)?.focus({ preventScroll: true });
          });
        }
      }}
    >
      {children}
    </summary>
  );
}
