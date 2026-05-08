"use client";

import { useRef, useEffect, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CancelOwnerReservationState } from "./item-actions";

type Labels = {
  buttonLabel: string;
  confirmTitle: string;
  confirmDescription: string;
  confirmLabel: string;
  cancelLabel: string;
};

type CancelOwnerReservationButtonProps = {
  itemId: string;
  labels: Labels;
  cancelAction: (
    prev: CancelOwnerReservationState,
    formData: FormData,
  ) => Promise<CancelOwnerReservationState>;
};

export function CancelOwnerReservationButton({
  itemId,
  labels,
  cancelAction,
}: CancelOwnerReservationButtonProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState(cancelAction, null);

  useEffect(() => {
    if (state?.status === "success") {
      dialogRef.current?.close();
      startTransition(() => router.refresh());
    }
  }, [state]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  }

  return (
    <>
      <button
        type="button"
        className="item-cancel-reservation-btn"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span className="item-btn-label">{labels.buttonLabel}</span>
      </button>

      <dialog ref={dialogRef} className="confirm-dialog" onClick={handleBackdropClick}>
        <div className="confirm-dialog-inner">
          <h2 className="confirm-dialog-title">{labels.confirmTitle}</h2>
          <p className="confirm-dialog-description">{labels.confirmDescription}</p>
          <div className="confirm-dialog-actions">
            <form action={formAction}>
              <input type="hidden" name="itemId" value={itemId} />
              <button type="submit" className="ui-button ui-button-danger">
                {labels.confirmLabel}
              </button>
            </form>
            <button
              type="button"
              className="ui-button ui-button-soft"
              onClick={() => dialogRef.current?.close()}
            >
              {labels.cancelLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
