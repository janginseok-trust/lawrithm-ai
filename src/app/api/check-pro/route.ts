import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verifyToken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "589second@gmail.com";

export async function GET(req: NextRequest) {
  console.log("실제 ADMIN_EMAIL 값:", ADMIN_EMAIL);
  const rawAdmin = req.headers.get("x-user-email");
  console.log("rawAdmin 값:", rawAdmin, "ADMIN_EMAIL:", ADMIN_EMAIL);

  // 헤더의 x-user-email이 관리자 이메일과 일치하면 Pro 인증
  if (rawAdmin && rawAdmin === ADMIN_EMAIL) {
    console.log("PRO 통과!! (rawAdmin과 ADMIN_EMAIL 완전 일치)");
    return NextResponse.json({ isPro: true, planType: "admin", expiresAt: null });
  }

  // Firebase ID 토큰 인증
  const idToken = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!idToken) return NextResponse.json({ isPro: false });

  const decoded = await verifyToken(idToken);
  if (!decoded?.email) return NextResponse.json({ isPro: false });

  // 관리자 이메일이면 무조건 통과
  if (decoded.email === ADMIN_EMAIL) {
    return NextResponse.json({ isPro: true, planType: "admin", expiresAt: null });
  }

  // Firestore 사용자 정보 조회
  const userDoc = await db.collection("users").doc(decoded.email).get();
  if (!userDoc.exists) return NextResponse.json({ isPro: false });

  const user = userDoc.data();
  const now = Date.now();

  // Pro 여부 및 기간 만료 여부 체크
  const isPro =
    user?.pro === true &&
    typeof user.expiresAt === "number" &&
    now < user.expiresAt;

  return NextResponse.json({
    isPro,
    planType: user?.planType ?? null,
    expiresAt: user?.expiresAt ?? null,
  });
}
