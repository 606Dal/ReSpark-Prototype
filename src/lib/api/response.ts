import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

export function ok<T>(data: T, message?: string, init?: ResponseInit) {
  const body: ApiResponse<T> = {
    success: true,
    data,
    message,
    mock: true,
  };
  return NextResponse.json(body, init);
}

export function fail(message: string, status = 400) {
  const body: ApiResponse<null> = {
    success: false,
    data: null,
    message,
    mock: true,
  };
  return NextResponse.json(body, { status });
}
