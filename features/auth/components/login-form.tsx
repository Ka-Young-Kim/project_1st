import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { login } from "@/features/auth/actions/login";

export function LoginForm({ error }: Readonly<{ error?: boolean }>) {
  return (
    <div className="space-y-8 text-white">
      <div className="space-y-4 border-b border-white/6 pb-6">
        <p className="page-kicker">
          Secure Access
        </p>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight md:text-[2.5rem]">
            재테크 대시보드 로그인
          </h2>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
            비밀번호를 입력해 재테크 대시보드와 투자 기록 화면에 접속합니다.
          </p>
        </div>
      </div>

      <form action={login} className="space-y-5">
        <label className="block rounded-[1.4rem] border border-white/8 bg-black/10 p-4" htmlFor="password">
          <span className="block text-sm font-medium text-white/90">비밀번호</span>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            required
            tone="dark"
            className="mt-3"
          />
        </label>

        {error ? (
          <p className="rounded-[1.2rem] border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-medium text-rose-100">
            비밀번호가 올바르지 않습니다.
          </p>
        ) : null}

        <div className="rounded-[1.4rem] border border-white/8 bg-black/10 p-4">
          <p className="text-xs leading-6 text-[var(--muted)]">
            인증 후 포트폴리오, 투자 항목, 투자일지, 할 일 관리를 사용할 수 있습니다.
          </p>
          <SubmitButton className="mt-4 w-full" pendingLabel="접속 중...">
            접속하기
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
