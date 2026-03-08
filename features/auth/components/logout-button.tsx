import { SubmitButton } from "@/components/ui/submit-button";
import { logout } from "@/features/auth/actions/logout";

export function LogoutButton() {
  return (
    <form action={logout} className="w-full">
      <SubmitButton
        className="h-11 w-full rounded-[1rem] border border-white/10 bg-white/4 px-4 py-0 !text-white hover:bg-white/8"
        pendingLabel="로그아웃 중..."
      >
        로그아웃
      </SubmitButton>
    </form>
  );
}
