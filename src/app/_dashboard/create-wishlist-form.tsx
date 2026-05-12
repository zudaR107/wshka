"use client";

import { useEffect, useRef, useActionState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/modules/i18n";
import { createWishlistAction, type CreateWishlistState } from "./item-actions";

type CreateWishlistFormProps = {
  onCreated: (wishlistId: string) => void;
  onCancel: () => void;
};

export function CreateWishlistForm({ onCreated, onCancel }: CreateWishlistFormProps) {
  const messages = useTranslations("app");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState<CreateWishlistState, FormData>(
    createWishlistAction,
    null,
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state?.status === "success" && state.wishlistId) {
      onCreated(state.wishlistId);
      startTransition(() => router.refresh());
    }
    if (state?.status === "error") {
      inputRef.current?.focus();
    }
  }, [state]);

  const errorMessage =
    state?.status === "error"
      ? state.error === "empty"
        ? messages.dashboard.wishlists.errors.createEmpty
        : state.error === "duplicate"
          ? messages.dashboard.wishlists.errors.createDuplicate
          : messages.dashboard.wishlists.errors.createUnknown
      : null;

  return (
    <form action={formAction} className="wishlist-edit-form" noValidate>
      <div>
        <input
          ref={inputRef}
          name="name"
          className={errorMessage ? "ui-input ui-input-error" : "ui-input"}
          placeholder={messages.dashboard.wishlists.createPlaceholder}
          maxLength={100}
        />
        {errorMessage ? <p className="ui-note ui-note-error">{errorMessage}</p> : null}
      </div>
      <div className="wishlist-edit-form-actions">
        <button type="submit" className="ui-button">
          {messages.dashboard.wishlists.createSubmitLabel}
        </button>
        <button type="button" className="ui-button ui-button-soft" onClick={onCancel}>
          {messages.dashboard.wishlists.createCancelLabel}
        </button>
      </div>
    </form>
  );
}
