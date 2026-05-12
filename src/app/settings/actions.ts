"use server";

import { requireCurrentUser } from "@/modules/auth/server/current-user";
import { getUserProfile, updateUserBio, updateUserPreferredCurrency, updateUserShowReservations } from "@/modules/auth/server/update-bio";
import { parseCurrency } from "@/shared/lib/currency";

export type SaveSettingsState = {
  status: "success" | "error";
  code?: "bio-too-long" | "unknown";
  key: number;
} | null;

export async function saveSettingsAction(
  prev: SaveSettingsState,
  formData: FormData,
): Promise<SaveSettingsState> {
  const user = await requireCurrentUser();
  const nextKey = (prev?.key ?? 0) + 1;

  const profile = await getUserProfile(user.id);
  const oldBio = profile?.bio ?? null;

  const bio = formData.get("bio");
  const bioResult = await updateUserBio(
    user.id,
    typeof bio === "string" ? bio : "",
    oldBio,
  );

  if (bioResult.status === "error" && bioResult.code === "too-long") {
    return { status: "error", code: "bio-too-long", key: nextKey };
  }

  const raw = formData.get("preferredCurrency");
  const currency = parseCurrency(typeof raw === "string" ? raw : "");
  await updateUserPreferredCurrency(user.id, currency);

  const showReservations = formData.get("showReservationsOnDashboard") === "true";
  await updateUserShowReservations(user.id, showReservations);

  if (bioResult.status === "success") {
    return { status: "success", key: nextKey };
  }

  return { status: "error", code: "unknown", key: nextKey };
}
