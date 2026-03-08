import { revalidatePath } from "next/cache";

import { AppSettingsInput } from "@/features/settings/schemas/settings";
import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "default";

export const DEFAULT_APP_SETTINGS = {
  id: SETTINGS_ID,
  brandName: "재테크 Admin",
  brandSubtitle: "투자 관리 대시보드",
  brandImageUrl: "",
  monthlyPrinciple:
    "추격 매수 금지, 매수 전 기록 우선, 주간 리뷰 고정. 성과보다 규칙 준수율을 먼저 확인합니다.",
  dashboardInsights: [
    "오늘 마감 TODO는 없어 계획 정리나 회고에 시간을 쓸 수 있습니다.",
    "이번 달 거래 0건으로 비교적 안정적인 기록 흐름입니다.",
    "완료율 0%로 열린 항목 정리가 더 필요합니다.",
  ].join("\n"),
} as const;

export async function getAppSettings() {
  const settings = await prisma.appSettings.findUnique({
    where: { id: SETTINGS_ID },
  });

  if (!settings) {
    return DEFAULT_APP_SETTINGS;
  }

  return {
    ...settings,
    brandImageUrl: settings.brandImageUrl ?? "",
    dashboardInsights:
      settings.dashboardInsights ?? DEFAULT_APP_SETTINGS.dashboardInsights,
  };
}

export async function updateAppSettings(input: AppSettingsInput) {
  await prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {
      brandName: input.brandName,
      brandSubtitle: input.brandSubtitle,
      brandImageUrl: input.brandImageUrl || null,
      monthlyPrinciple: input.monthlyPrinciple,
      dashboardInsights: input.dashboardInsights,
    },
    create: {
      id: SETTINGS_ID,
      brandName: input.brandName,
      brandSubtitle: input.brandSubtitle,
      brandImageUrl: input.brandImageUrl || null,
      monthlyPrinciple: input.monthlyPrinciple,
      dashboardInsights: input.dashboardInsights,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/todos");
  revalidatePath("/journal");
}
