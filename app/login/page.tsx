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
    <main className="page-shell flex items-center justify-center">
      <div className="page-container w-full max-w-[520px]">
        <section className="glass-panel rounded-[2rem] p-8 md:p-10">
          <LoginForm error={errorParam === "invalid"} />
        </section>
      </div>
    </main>
  );
}
