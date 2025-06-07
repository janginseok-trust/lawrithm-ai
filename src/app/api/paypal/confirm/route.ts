import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { getOrderDetails } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  let body: any;

  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { orderId, planType } = body || {};
  console.log("✅ [paypal/confirm] 요청 도착:", orderId);
  console.log("🧾 받은 planType:", planType);

  if (!orderId || !planType) {
    return NextResponse.json({ error: "Missing orderId or planType" }, { status: 400 });
  }

  try {
    const order = await getOrderDetails(orderId);
    const email = order?.payer?.email_address;

    if (!email) {
      return NextResponse.json({ error: "No customer email found" }, { status: 400 });
    }

    let expiresAt = 0;
    let usageLimit = 0;
    if (planType === "trial") {
      expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      usageLimit = 5;
    } else if (planType === "pro") {
      expiresAt = Date.now() + 14 * 24 * 60 * 60 * 1000;
      usageLimit = 40;
    } else if (planType === "unlimited") {
      expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
      usageLimit = 999999;
    } else {
      return NextResponse.json({ error: "Invalid planType" }, { status: 400 });
    }

    await db.collection("users").doc(email).set(
      {
        pro: planType === "pro" || planType === "unlimited",
        trial: planType === "trial",
        unlimited: planType === "unlimited",
        planType,
        expiresAt,
        usageLimit,
        usedCount: 0,
        paypalOrderId: orderId,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    console.log("✅ Pro 사용자 저장 완료:", email);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 결제 정보 확인 실패:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
