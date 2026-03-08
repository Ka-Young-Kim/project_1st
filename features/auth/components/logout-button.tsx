import { SubmitButton } from "@/components/ui/submit-button";
import { logout } from "@/features/auth/actions/logout";

export function LogoutButton() {
  return (
    <form action={logout} className="pt-1">
      <SubmitButton
        className="w-full bg-[var(--foreground)] hover:bg-black"
        pendingLabel="로그아웃 중..."
      >
        로그아웃
      </SubmitButton>
    </form>
  );
}
