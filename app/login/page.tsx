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
    <main className="admin-shell page-shell flex items-center">
      <div className="page-container w-full max-w-[1120px]">
        <section className="glass-panel grid overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,29,53,.96),rgba(14,22,42,.98))] lg:grid-cols-[1fr_minmax(420px,0.9fr)]">
          <div className="hidden border-r border-white/6 p-10 lg:block">
            <p className="page-kicker">Secure Access</p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">
              투자 기록과
              <br />
              실행 흐름을 한 화면에서.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)]">
              포트폴리오, 투자일지, TODO를 PC 화면 기준으로 빠르게 읽고 정리할 수
              있도록 구성한 개인 투자 대시보드입니다.
            </p>
            <div className="mt-10 grid gap-4">
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                  Workflow
                </p>
                <p className="mt-3 text-sm leading-7 text-[#d8e4ff]">
                  대시보드에서 현황을 보고, 투자일지에서 매매 이유를 기록하고,
                  TODO에서 다음 액션을 관리합니다.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
                  Security
                </p>
                <p className="mt-3 text-sm leading-7 text-[#d8e4ff]">
                  단일 비밀번호 잠금을 사용하며, 인증 후에만 기록 화면에 접근할 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
          <LoginForm error={errorParam === "invalid"} />
          </div>
        </section>
      </div>
    </main>
  );
}
