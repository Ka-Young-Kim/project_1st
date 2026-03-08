import { redirect } from "next/navigation";

import { LoginForm } from "@/features/auth/components/login-form";
import { isAuthenticated } from "@/lib/auth";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage(props: { searchParams?: SearchParams }) {
  if (await isAuthenticated()) {
    redirect("/");
  }

  const searchParams = props.searchParams ? await props.searchParams : {};
  const errorParam = Array.isArray(searchParams.error)
    ? searchParams.error[0]
    : searchParams.error;

  return (
    <main className="page-shell flex items-center">
      <div className="page-container grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center gap-6">
          <p className="status-badge w-fit bg-white/75 text-[var(--accent-strong)]">
            Money Discipline System
          </p>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
              TODO와 투자일지를 한 흐름으로 묶는 개인 자산 기록실
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              오늘 해야 할 일, 최근 거래 이유, 월간 거래 빈도를 한 화면에서
              확인합니다. 이 앱은 개인 기록용이며 투자 추천 서비스를 제공하지
              않습니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-panel rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Timezone
              </p>
              <p className="mt-2 text-lg font-semibold">Asia/Seoul</p>
            </div>
            <div className="glass-panel rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Currency
              </p>
              <p className="mt-2 text-lg font-semibold">KRW</p>
            </div>
            <div className="glass-panel rounded-3xl p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                Access
              </p>
              <p className="mt-2 text-lg font-semibold">Single Password</p>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-8 md:p-10">
          <LoginForm error={errorParam === "invalid"} />
        </section>
      </div>
    </main>
  );
}
