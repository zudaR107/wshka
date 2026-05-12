"use client";

import { useEffect, useRef, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/modules/i18n";
import { renameWishlistAction, type RenameWishlistState } from "./item-actions";

type RenameWishlistFormProps = {
  wishlistId: string;
  currentName: string;
  onCancel: () => void;
};

export function RenameWishlistForm({ wishlistId, currentName, onCancel }: RenameWishlistFormProps) {
  const messages = useTranslations("app");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState<RenameWishlistState, FormData>(
    renameWishlistAction,
    null,
  );

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    if (state?.status === "success") {
      onCancel();
      startTransition(() => router.refresh());
    }
    if (state?.status === "error") {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [state]);

  function getErrorMessage(code: string | undefined): string {
    switch (code) {
      case "empty":
        return messages.dashboard.wishlists.errors.renameEmpty;
      case "duplicate":
        return messages.dashboard.wishlists.errors.renameDuplicate;
      case "not-found":
        return messages.dashboard.wishlists.errors.renameNotFound;
      default:
        return messages.dashboard.wishlists.errors.renameUnknown;
    }
  }

  const errorMessage = state?.status === "error" ? getErrorMessage(state.error) : null;

  return (
    <form action={formAction} className="wishlist-edit-form" noValidate>
      <input type="hidden" name="wishlistId" value={wishlistId} />
      <div>
        <input
          ref={inputRef}
          name="name"
          className={errorMessage ? "ui-input ui-input-error" : "ui-input"}
          defaultValue={currentName}
          maxLength={100}
          placeholder={messages.dashboard.wishlists.renamePlaceholder}
        />
        {errorMessage ? <p className="ui-note ui-note-error">{errorMessage}</p> : null}
      </div>
      <div className="wishlist-edit-form-actions">
        <button type="submit" className="ui-button">
          {messages.dashboard.wishlists.renameSubmitLabel}
        </button>
        <button type="button" className="ui-button ui-button-soft" onClick={onCancel}>
          {messages.dashboard.wishlists.renameCancelLabel}
        </button>
      </div>
    </form>
  );
}
