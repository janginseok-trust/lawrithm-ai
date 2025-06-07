import { NextRequest, NextResponse } from "next/server";

const TOSS_CLIENT_KEY = process.env.TOSS_CLIENT_KEY!;
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    const response = await fetch("https://api.tosspayments.com/v1/payments/ready", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${TOSS_CLIENT_KEY}:${TOSS_SECRET_KEY}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: `order_${Date.now()}`,
        amount: 69000, // 월 69,000원
        orderName: "Lawrithm Pro 멤버십",
        successUrl: `${process.env.DOMAIN}/success`,
        failUrl: `${process.env.DOMAIN}/fail`,
        customerEmail: "", // 필요시 고객 이메일 넣기
        customerName: "",  // 필요시 고객 이름 넣기
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json({ error: errorBody }, { status: 400 });
    }

    const data = await response.json();

    return NextResponse.json({ paymentUrl: data.paymentUrl });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
