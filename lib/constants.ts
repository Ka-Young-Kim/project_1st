export const NAV_ITEMS = [
  {
    href: "/",
    label: "대시보드",
    description: "오늘 마감 TODO와 최근 거래를 확인합니다.",
  },
  {
    href: "/portfolios",
    label: "포트폴리오 구성",
    description: "선택한 포트폴리오의 계좌, 자산군, 리밸런싱을 설정합니다.",
  },
  {
    href: "/journal",
    label: "투자일지",
    description: "매매 기록과 투자 이유, 회고를 남깁니다.",
  },
  {
    href: "/items",
    label: "투자 항목 관리",
    description: "등록 항목과 기본 정보를 관리합니다.",
  },
  {
    href: "/todos",
    label: "할 일 관리",
    description: "포트폴리오와 관계없이 공통 TODO를 관리합니다.",
  },
] as const;

const STATUS_MESSAGES = {
  "todo-created": { tone: "success", message: "새 TODO가 저장되었습니다." },
  "todo-updated": { tone: "success", message: "TODO가 업데이트되었습니다." },
  "todo-deleted": { tone: "success", message: "TODO가 삭제되었습니다." },
  "todo-invalid": {
    tone: "error",
    message: "TODO 입력값이 올바르지 않습니다.",
  },
  "journal-created": {
    tone: "success",
    message: "투자일지가 저장되었습니다.",
  },
  "journal-updated": {
    tone: "success",
    message: "투자일지가 업데이트되었습니다.",
  },
  "journal-deleted": {
    tone: "success",
    message: "투자일지가 삭제되었습니다.",
  },
  "journal-invalid": {
    tone: "error",
    message: "투자일지 입력값이 올바르지 않습니다.",
  },
  "item-created": {
    tone: "success",
    message: "투자 항목이 저장되었습니다.",
  },
  "item-updated": {
    tone: "success",
    message: "투자 항목이 업데이트되었습니다.",
  },
  "item-deleted": {
    tone: "success",
    message: "투자 항목이 삭제되었습니다.",
  },
  "item-invalid": {
    tone: "error",
    message: "투자 항목 입력값이 올바르지 않습니다.",
  },
  "item-duplicate-code": {
    tone: "error",
    message: "같은 포트폴리오에 이미 등록된 코드입니다.",
  },
  "item-duplicate-name": {
    tone: "error",
    message: "같은 포트폴리오에 이미 등록된 항목명입니다.",
  },
  "item-linked": {
    tone: "error",
    message: "연결된 투자일지가 있는 항목은 삭제할 수 없습니다.",
  },
  "portfolio-created": {
    tone: "success",
    message: "포트폴리오가 저장되었습니다.",
  },
  "portfolio-updated": {
    tone: "success",
    message: "포트폴리오가 업데이트되었습니다.",
  },
  "portfolio-deleted": {
    tone: "success",
    message: "포트폴리오가 삭제되었습니다.",
  },
  "portfolio-invalid": {
    tone: "error",
    message: "포트폴리오 입력값이 올바르지 않습니다.",
  },
  "portfolio-linked": {
    tone: "error",
    message: "항목 또는 일지가 연결된 포트폴리오는 삭제할 수 없습니다.",
  },
  "portfolio-account-created": {
    tone: "success",
    message: "계좌가 저장되었습니다.",
  },
  "portfolio-account-updated": {
    tone: "success",
    message: "계좌가 업데이트되었습니다.",
  },
  "portfolio-account-deleted": {
    tone: "success",
    message: "계좌가 삭제되었습니다.",
  },
  "portfolio-account-invalid": {
    tone: "error",
    message: "계좌 입력값이 올바르지 않습니다.",
  },
  "portfolio-asset-group-created": {
    tone: "success",
    message: "자산군이 저장되었습니다.",
  },
  "portfolio-asset-group-updated": {
    tone: "success",
    message: "자산군이 업데이트되었습니다.",
  },
  "portfolio-asset-group-deleted": {
    tone: "success",
    message: "자산군이 삭제되었습니다.",
  },
  "portfolio-asset-group-invalid": {
    tone: "error",
    message: "자산군 입력값이 올바르지 않습니다.",
  },
  "portfolio-targets-updated": {
    tone: "success",
    message: "자산군 목표 비율이 저장되었습니다.",
  },
  "portfolio-targets-invalid": {
    tone: "error",
    message: "자산군 목표 비율 합계를 100%로 맞춰주세요.",
  },
  "portfolio-holding-linked": {
    tone: "success",
    message: "투자 항목이 포트폴리오에 연결되었습니다.",
  },
  "portfolio-holding-unlinked": {
    tone: "success",
    message: "투자 항목 연결이 해제되었습니다.",
  },
  "portfolio-holding-invalid": {
    tone: "error",
    message: "포트폴리오 항목 연결 정보가 올바르지 않습니다.",
  },
  "portfolio-item-created": {
    tone: "success",
    message: "포트폴리오 항목이 저장되었습니다.",
  },
  "portfolio-item-updated": {
    tone: "success",
    message: "포트폴리오 항목이 업데이트되었습니다.",
  },
  "portfolio-item-deleted": {
    tone: "success",
    message: "포트폴리오 항목이 삭제되었습니다.",
  },
  "portfolio-item-invalid": {
    tone: "error",
    message: "포트폴리오 항목 입력값이 올바르지 않습니다.",
  },
  "portfolio-snapshot-recorded": {
    tone: "success",
    message: "포트폴리오 스냅샷이 기록되었습니다.",
  },
  "portfolio-snapshot-invalid": {
    tone: "error",
    message: "포트폴리오 스냅샷을 기록할 수 없습니다.",
  },
  "settings-updated": {
    tone: "success",
    message: "브랜드와 운영 설정이 저장되었습니다.",
  },
  "settings-invalid": {
    tone: "error",
    message: "설정 입력값이 올바르지 않습니다.",
  },
} as const;

export function getStatusMessage(status?: string) {
  if (!status) {
    return null;
  }

  return STATUS_MESSAGES[status as keyof typeof STATUS_MESSAGES] ?? null;
}
