"use server";

import { redirect } from "next/navigation";

import { createSession, getPasswordValue } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function login(formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || password !== getPasswordValue()) {
    logger.warn("auth.invalid_password");
    redirect("/login?error=invalid");
  }

  await createSession();
  redirect("/");
}
