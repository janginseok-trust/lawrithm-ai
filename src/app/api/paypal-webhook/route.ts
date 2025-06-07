// src/app/api/paypal-webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

// (실제 PayPal signature 검증은 PayPal 공식 SDK 또는 REST API로 구현 권장)

export async function POST(req: NextRequest) {
  try {
    // 1. PayPal Webhook에서 이벤트 파싱
    const event = await req.json();

    // 2. 결제 승인 이벤트만 처리 (예시: CHECKOUT.ORDER.APPROVED 또는 PAYMENT.CAPTURE.COMPLETED)
    const eventType = event.event_type || event.eventType;
    if (
      !["CHECKOUT.ORDER.APPROVED", "PAYMENT.CAPTURE.COMPLETED"].includes(
        eventType
      )
    ) {
      // 필요한 결제 이벤트만 처리
      return NextResponse.json({ ok: true, ignored: true });
    }

    // 3. 결제 관련 정보 추출
    const payerEmail =
      event.resource?.payer?.email_address ||
      event.resource?.payer?.email ||
      event.resource?.payer?.payer_info?.email;
    const transactionId =
      event.resource?.id || event.resource?.supplementary_data?.related_ids?.payment_id;
    const plan =
      event.resource?.custom_id || event.resource?.plan || event.resource?.invoice_id; // plan명(직접 전달 필요)
    const priceId = event.resource?.purchase_units?.[0]?.reference_id || "paypal";

    // (테스트용: 관리자 이메일 처리)
    if (payerEmail === ADMIN_EMAIL) {
      await db.collection("users").doc(payerEmail).set(
        {
          isPro: true,
          plan: "unlimited",
          expiresAt: null,
          usageLimit: undefined,
          usedCount: 0,
          updatedAt: Date.now(),
          transactionId,
          priceId,
        },
        { merge: true }
      );
      return NextResponse.json({ ok: true, admin: true });
    }

    if (!payerEmail || !transactionId || !plan) {
      return NextResponse.json(
        { error: "Incomplete PayPal webhook event" },
        { status: 400 }
      );
    }

    // 4. 플랜별 기간/사용량 설정
    let expiresAt = null;
    let usageLimit = undefined;
    if (plan === "trial") {
      expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24시간
      usageLimit = 5;
    } else if (plan === "pro") {
      expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 14; // 14일
      usageLimit = 40;
    } else if (plan === "unlimited") {
      expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30일
      usageLimit = undefined;
    } else {
      return NextResponse.json(
        { error: "Unknown plan" },
        { status: 400 }
      );
    }

    // 5. Firestore에 결제 기록/업데이트
    await db.collection("users").doc(payerEmail).set(
      {
        isPro: true,
        plan,
        expiresAt,
        usageLimit,
        usedCount: 0,
        updatedAt: Date.now(),
        transactionId,
        priceId,
      },
      { merge: true }
    );

    return NextResponse.json({ ok: true, payerEmail, plan, expiresAt });
  } catch (error) {
    console.error("PayPal webhook error:", error);
    return NextResponse.json(
      { error: "PayPal webhook processing failed", detail: String(error) },
      { status: 500 }
    );
  }
}
