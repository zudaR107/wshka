"use client";

import { useState } from "react";
import { MAX_PRICE } from "@/modules/wishlist/server/item-input";
import { useTranslations } from "@/modules/i18n";

type PriceInputProps = {
  id: string;
  name: string;
  defaultValue?: string;
  className?: string;
  autoFocus?: boolean;
  error?: boolean;
};

type InputHint = "non-numeric" | "too-large" | null;

const ALLOWED_KEYS = new Set([
  "Backspace", "Delete", "Tab", "Escape", "Enter",
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "Home", "End",
]);

/** Strip all formatting chars: NBSP, regular space, currency symbol. */
function stripFormat(value: string): string {
  return value.replace(/[  ₽]/g, "");
}

/** Format raw digit string as "3 490 ₽" with NBSP thousands separator. */
function applyFormat(raw: string, currencySymbol: string): string {
  if (!raw) return "";
  const thousands = raw.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${thousands} ${currencySymbol}`;
}

export function PriceInput({ id, name, defaultValue, className, autoFocus, error }: PriceInputProps) {
  const common = useTranslations("common");
  const [hint, setHint] = useState<InputHint>(null);

  const currencySymbol = common.currencySymbol;
  const suffix = ` ${currencySymbol}`;
  const maxPriceDisplay = MAX_PRICE.toLocaleString("ru-RU");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (ALLOWED_KEYS.has(e.key) || e.ctrlKey || e.metaKey) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      setHint("non-numeric");
      return;
    }
    // Check MAX_PRICE: compute what raw value would be after inserting this digit.
    const { value, selectionStart, selectionEnd } = e.currentTarget;
    const beforeRaw = stripFormat(value.slice(0, selectionStart ?? value.length));
    const afterRaw = stripFormat(value.slice(selectionEnd ?? value.length));
    const next = Number(beforeRaw + e.key + afterRaw);
    if (next > MAX_PRICE) {
      e.preventDefault();
      setHint("too-large");
    } else {
      setHint(null);
    }
  }

  function handleInput(e: React.FormEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const cursorPos = input.selectionStart ?? input.value.length;

    // Count digits before cursor so we can restore cursor after reformatting.
    const digitsBeforeCursor = stripFormat(input.value.slice(0, cursorPos)).length;

    const raw = stripFormat(input.value);

    if (!raw) {
      input.value = "";
      setHint(null);
      return;
    }

    if (Number(raw) > MAX_PRICE) {
      const formatted = applyFormat(String(MAX_PRICE), currencySymbol);
      input.value = formatted;
      const pos = formatted.length - suffix.length;
      input.setSelectionRange(pos, pos);
      setHint("too-large");
      return;
    }

    const formatted = applyFormat(raw, currencySymbol);
    input.value = formatted;

    // Restore cursor: find position after the same number of digits as before.
    let newPos = formatted.length - suffix.length; // default: right before suffix
    if (digitsBeforeCursor === 0) {
      newPos = 0;
    } else {
      let count = 0;
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          count++;
          if (count === digitsBeforeCursor) {
            newPos = i + 1;
            break;
          }
        }
      }
    }

    input.setSelectionRange(newPos, newPos);
    setHint(null);
  }

  function handleBlur() {
    setHint(null);
  }

  return (
    <>
      <input
        id={id}
        name={name}
        defaultValue={applyFormat(stripFormat(defaultValue ?? ""), currencySymbol)}
        className={error ? `${className ?? ""} ui-input-error`.trim() : className}
        inputMode="numeric"
        autoComplete="off"
        autoFocus={autoFocus}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onBlur={handleBlur}
      />
      {hint === "non-numeric" ? (
        <p className="ui-note" style={{ color: "var(--color-status-reserved)" }}>
          {common.priceInput.nonNumericHint}
        </p>
      ) : hint === "too-large" ? (
        <p className="ui-note" style={{ color: "var(--color-status-reserved)" }}>
          {common.priceInput.tooLargeHint}: {maxPriceDisplay}.
        </p>
      ) : null}
    </>
  );
}
