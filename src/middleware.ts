import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_COUNTRIES = [
  "KP", "IR", "SY", "CU", "SD", "RU", "BY", "VE", "CF", "CD",
  "SO", "SS", "UA", "AF", "LY", "YE", "ZW", "LB", "MM", "CN"
];

// geo가 타입상 undefined라 에러 발생 → as any로 우회
export function middleware(request: NextRequest) {
  // 타입 무시: (request as any).geo
  const country =
    ((request as any).geo?.country as string | undefined) || "XX";
  if (BLOCKED_COUNTRIES.includes(country)) {
    return new NextResponse(
      "Access denied. This service is not available in your country.",
      { status: 403 }
    );
    // 또는 안내페이지: return NextResponse.redirect(new URL("/blocked", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
