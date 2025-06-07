import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verifyToken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

export async function GET(req: NextRequest) {
  // 1. 관리자 이메일 예외: 헤더로 x-user-email 또는 email 파라미터 둘 다 허용
  const rawAdmin =
    req.headers.get("x-user-email") ||
    req.nextUrl.searchParams.get("email") ||
    "";

  if (rawAdmin === ADMIN_EMAIL) {
    // 관리자(나)는 무조건 구독 OK, 만료 없음
    return NextResponse.json({
      subscribed: true,
      expiresAt: null,
      expired: false,
      admin: true,
    });
  }

  // 2. 토큰 추출 및 검증
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  const decoded = await verifyToken(idToken);

  // 3. 인증 실패시 401 Unauthorized
  if (!decoded?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4. 쿼리파라미터 email 가져오기
  const email = req.nextUrl.searchParams.get("email");
  // 5. 토큰의 email과 요청 email이 다르면 차단 (타인 정보 접근 방지)
  if (!email || email !== decoded.email) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 6. 구독 정보 조회
  const doc = await db.collection("users").doc(email).get();
  if (!doc.exists) {
    return NextResponse.json({ subscribed: false });
  }

  const data = doc.data();
  const expiresAt = data?.expiresAt ?? null;
  const now = Date.now();
  const isActive = expiresAt && now < expiresAt;

  return NextResponse.json({
    subscribed: !!isActive,
    expiresAt,
    expired: !isActive,
  });
}
