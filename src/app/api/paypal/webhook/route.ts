import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin"; // 반드시 firebase-admin!

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log("✅ [paypal/webhook] Webhook 수신", body);

  // 이벤트 타입 분기
  const eventType = body.event_type;
  let email = "";
  let orderId = "";
  let passType = ""; // trial, pro, unlimited
  let expiresAt = 0;
  let usageLimit = 0; // ← usageLimit 기본값 선언

  // 단건 결제 (PAYMENT.CAPTURE.COMPLETED)
  if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
    email = body.resource?.payer?.email_address || "";
    orderId = body.resource?.id || "";
    const amount = body.resource?.amount?.value;

    if (amount === "9.99") {
      passType = "trial";
      expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24시간
      usageLimit = 5;
    } else if (amount === "59.99") {
      passType = "pro";
      expiresAt = Date.now() + 14 * 24 * 60 * 60 * 1000; // 14일
      usageLimit = 40; // ✅ Pro는 40회
    } else if (amount === "119.99") {
      passType = "unlimited";
      expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30일
      usageLimit = 999999; // ✅ Unlimited는 매우 큰 값
    }
  }

  // (정기결제/구독 관련 코드 완전 제거!)

  // 필수값 누락시
  if (!email || !orderId || !passType || !expiresAt || !usageLimit) {
    return NextResponse.json({ ok: false, message: "필수값 누락" });
  }

  // 1. 결제내역 저장 (payments)
  const paymentRef = db.collection("payments").doc(orderId);
  await paymentRef.set({
    email,
    passType,
    expiresAt,
    orderId,
    eventType,
    usageLimit, // ← 결제 내역에도 기록해두면 관리 쉬움
    createdAt: Date.now()
  });

  // 2. 유저 권한 갱신 (users)
  const userRef = db.collection("users").doc(email);
  await userRef.set({
    pro: passType === "pro" || passType === "unlimited",
    trial: passType === "trial",
    unlimited: passType === "unlimited",
    passType,
    expiresAt,
    updatedAt: Date.now(),
    usageLimit, // ✅ 필수 추가!
    usedCount: 0, // 첫 결제는 무조건 0으로 초기화!
  }, { merge: true });

  return NextResponse.json({ ok: true, message: "권한 발급 완료" });
}
