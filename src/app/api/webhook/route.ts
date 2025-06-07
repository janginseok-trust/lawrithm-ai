import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Firebase Admin initialization (skip if already initialized)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}
const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Only process when payment is complete
    if (body.status === "DONE") {
      const orderId = body.orderId || "";
      const customerEmail = body.customerEmail || "";
      const planType = body.planType || "pro"; // "trial", "pro", "unlimited"

      if (!customerEmail) {
        return NextResponse.json({ error: "No customerEmail in webhook." }, { status: 400 });
      }

      // 플랜별 기간/건수 자동 설정
      const startDate = new Date();
      let expireDate = new Date(startDate);
      let usageLimit: number = 0;
      if (planType === "trial") {
        expireDate.setDate(startDate.getDate() + 1); // 24시간
        usageLimit = 5;
      } else if (planType === "pro") {
        expireDate.setDate(startDate.getDate() + 14); // 14일
        usageLimit = 40;
      } else if (planType === "unlimited") {
        expireDate.setDate(startDate.getDate() + 30); // 30일
        usageLimit = 99999999; // 무제한은 아주 큰 값으로
      } else {
        return NextResponse.json({ error: "Unknown plan type" }, { status: 400 });
      }

      await db.collection("subscriptions").doc(customerEmail).set({
        orderId,
        customerEmail,
        plan: planType,
        isProUser: true,
        usedCount: 0,
        usageLimit,
        validUntil: expireDate.toISOString(),
        updatedAt: startDate.toISOString(),
      });

      console.log(`[Webhook] Subscription activated for ${customerEmail} (${planType}), orderId: ${orderId}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
