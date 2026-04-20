"use client";

import { useRef } from "react";

type DeleteItemButtonLabels = {
  deleteLabel: string;
  confirmTitle: string;
  confirmDescription: string;
  confirmLabel: string;
  cancelLabel: string;
};

type DeleteItemButtonProps = {
  itemId: string;
  itemTitle: string;
  deleteAction: (formData: FormData) => Promise<void>;
  labels: DeleteItemButtonLabels;
};

export function DeleteItemButton({
  itemId,
  itemTitle,
  deleteAction,
  labels,
}: DeleteItemButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) {
      dialogRef.current?.close();
    }
  }

  return (
    <>
      <button
        type="button"
        className="item-delete-btn"
        onClick={() => dialogRef.current?.showModal()}
      >
        {labels.deleteLabel}
      </button>

      <dialog ref={dialogRef} className="confirm-dialog" onClick={handleBackdropClick}>
        <div className="confirm-dialog-inner">
          <h2 className="confirm-dialog-title">{labels.confirmTitle}</h2>
          <p className="confirm-dialog-description">
            {labels.confirmDescription}{" "}
            <strong className="confirm-dialog-item-name">&laquo;{itemTitle}&raquo;</strong>?
          </p>
          <div className="confirm-dialog-actions">
            <form action={deleteAction}>
              <input type="hidden" name="itemId" value={itemId} />
              <button type="submit" className="ui-button ui-button-danger">
                {labels.confirmLabel}
              </button>
            </form>
            <button
              type="button"
              className="ui-button ui-button-secondary"
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
