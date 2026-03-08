import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { login } from "@/features/auth/actions/login";

export function LoginForm({ error }: Readonly<{ error?: boolean }>) {
  return (
    <div className="space-y-7">
      <div className="space-y-3 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
          Secure Access
        </p>
        <h2 className="text-3xl font-bold tracking-tight">앱 잠금 해제</h2>
        <p className="text-sm leading-6 text-[var(--muted)]">
          비밀번호를 입력해 대시보드에 접속합니다.
        </p>
      </div>

      <form action={login} className="space-y-4">
        <label className="block space-y-2" htmlFor="password">
          <span className="text-sm font-medium">비밀번호</span>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
          />
        </label>

        {error ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            비밀번호가 올바르지 않습니다.
          </p>
        ) : null}

        <SubmitButton className="w-full">접속하기</SubmitButton>
      </form>
    </div>
  );
}
