import { SubmitButton } from "@/components/ui/submit-button";
import { logout } from "@/features/auth/actions/logout";

export function LogoutButton() {
  return (
    <form action={logout} className="w-full">
      <SubmitButton
        className="h-11 w-full rounded-[1rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-4 py-0 !text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))]"
        pendingLabel="로그아웃 중..."
      >
        로그아웃
      </SubmitButton>
    </form>
  );
}
