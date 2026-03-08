import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "finance-todo-journal",
    timestamp: new Date().toISOString(),
  });
}
