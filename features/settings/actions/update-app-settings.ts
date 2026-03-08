"use server";

import { redirect } from "next/navigation";

import { appSettingsSchema } from "@/features/settings/schemas/settings";
import { updateAppSettings } from "@/features/settings/services/settings-service";
import { logger } from "@/lib/logger";

export async function updateAppSettingsAction(formData: FormData) {
  const parsed = appSettingsSchema.safeParse({
    brandName: formData.get("brandName"),
    brandSubtitle: formData.get("brandSubtitle"),
    brandImageUrl: formData.get("brandImageUrl"),
    monthlyPrinciple: formData.get("monthlyPrinciple"),
    dashboardInsights: formData.get("dashboardInsights"),
  });

  if (!parsed.success) {
    logger.warn("settings.update.validation_failed", parsed.error.flatten());
    redirect("/?status=settings-invalid");
  }

  await updateAppSettings(parsed.data);
  redirect("/?status=settings-updated");
}
