export const NAV_ITEMS = [
  {
    href: "/",
    label: "대시보드",
    description: "오늘 마감 TODO와 최근 거래를 확인합니다.",
  },
  {
    href: "/todos",
    label: "할 일 관리",
    description: "우선순위와 마감일을 기준으로 TODO를 관리합니다.",
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
  "item-linked": {
    tone: "error",
    message: "연결된 투자일지가 있는 항목은 삭제할 수 없습니다.",
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
