import { SubmitButton } from "@/components/ui/submit-button";
import { logout } from "@/features/auth/actions/logout";

export function LogoutButton() {
  return (
    <form action={logout} className="pt-1">
      <SubmitButton
        className="w-full bg-white !text-[#0b1020] hover:bg-[#dbe4f3]"
        pendingLabel="로그아웃 중..."
      >
        로그아웃
      </SubmitButton>
    </form>
  );
}
