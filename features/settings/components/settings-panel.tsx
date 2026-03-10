import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { updateAppSettingsAction } from "@/features/settings/actions/update-app-settings";
import { DEFAULT_APP_SETTINGS } from "@/features/settings/services/settings-service";
import { cx } from "@/lib/utils";

type SettingsPanelProps = {
  settings: {
    brandName: string;
    brandSubtitle: string;
    brandImageUrl: string;
    monthlyPrinciple: string;
    dashboardInsights: string;
  };
  mode: "brand" | "principle" | "insights";
};

export function SettingsPanel({
  settings,
  mode,
}: Readonly<SettingsPanelProps>) {
  const fieldClassName =
    "border-white/10 !bg-[rgba(255,255,255,0.04)] !text-white placeholder:!text-[#7083aa] shadow-none [color-scheme:dark] focus:border-[#6ea8fe] focus:ring-[rgba(110,168,254,0.16)]";
  const isBrandMode = mode === "brand";
  const isPrincipleMode = mode === "principle";
  const title = isBrandMode
    ? "사용자 설정"
    : isPrincipleMode
      ? "오늘의 원칙"
      : "대시보드 인사이트";
  const description = isBrandMode
    ? "이름, 한 줄 소개, 프로필 이미지 경로를 수정할 수 있습니다."
    : isPrincipleMode
      ? "사이드바에 보이는 문구를 바로 수정할 수 있습니다."
      : "대시보드 인사이트 문구를 줄바꿈 기준으로 직접 수정할 수 있습니다.";

  return (
    <Card
      className={cx(
        "w-full rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(20,29,53,.98),rgba(17,26,48,.98))] p-5 sm:p-6",
        "max-h-[85vh] overflow-y-auto",
      )}
    >
      <div className="flex flex-col gap-3 pr-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold leading-tight sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 max-w-[32rem] text-sm leading-6 text-[var(--muted)]">
            {description}
          </p>
        </div>
        <span className="hidden h-8 shrink-0 items-center rounded-full border border-[rgba(110,168,254,0.22)] bg-[rgba(110,168,254,0.12)] px-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#cfe1ff] sm:inline-flex">
          Settings
        </span>
      </div>

      <form action={updateAppSettingsAction} className="mt-6 space-y-4">
        {isBrandMode ? (
          <>
            <label className="space-y-2">
              <span className="text-sm font-medium">이름</span>
              <Input
                name="brandName"
                defaultValue={settings.brandName}
                required
                className={fieldClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">한 줄 소개</span>
              <Input
                name="brandSubtitle"
                defaultValue={settings.brandSubtitle}
                required
                className={fieldClassName}
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium">프로필 이미지 경로</span>
              <Input
                name="brandImageUrl"
                defaultValue={settings.brandImageUrl}
                placeholder={DEFAULT_APP_SETTINGS.brandImageUrl || "/globe.svg"}
                className={fieldClassName}
              />
              <p className="text-xs leading-5 text-[var(--muted)]">
                예: `/globe.svg`, `/next.svg`, 또는 외부 이미지 주소
              </p>
            </label>
            <input
              type="hidden"
              name="monthlyPrinciple"
              value={settings.monthlyPrinciple}
            />
            <input
              type="hidden"
              name="dashboardInsights"
              value={settings.dashboardInsights}
            />
          </>
        ) : isPrincipleMode ? (
          <>
            <input type="hidden" name="brandName" value={settings.brandName} />
            <input
              type="hidden"
              name="brandSubtitle"
              value={settings.brandSubtitle}
            />
            <input
              type="hidden"
              name="brandImageUrl"
              value={settings.brandImageUrl}
            />
            <input
              type="hidden"
              name="dashboardInsights"
              value={settings.dashboardInsights}
            />
            <label className="space-y-2">
              <span className="text-sm font-medium">오늘의 원칙</span>
              <Textarea
                name="monthlyPrinciple"
                defaultValue={settings.monthlyPrinciple}
                required
                className={`${fieldClassName} min-h-40`}
              />
            </label>
          </>
        ) : (
          <>
            <input type="hidden" name="brandName" value={settings.brandName} />
            <input
              type="hidden"
              name="brandSubtitle"
              value={settings.brandSubtitle}
            />
            <input
              type="hidden"
              name="brandImageUrl"
              value={settings.brandImageUrl}
            />
            <input
              type="hidden"
              name="monthlyPrinciple"
              value={settings.monthlyPrinciple}
            />
            <label className="space-y-2">
              <span className="text-sm font-medium">대시보드 인사이트</span>
              <Textarea
                name="dashboardInsights"
                defaultValue={settings.dashboardInsights}
                required
                className={`${fieldClassName} min-h-48`}
              />
              <p className="text-xs leading-5 text-[var(--muted)]">
                한 줄이 인사이트 한 문장으로 표시됩니다.
              </p>
            </label>
          </>
        )}

        <SubmitButton className="w-full" pendingLabel="설정 저장 중...">
          설정 저장
        </SubmitButton>
      </form>
    </Card>
  );
}
