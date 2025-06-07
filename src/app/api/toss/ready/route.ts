import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// 환경변수로 관리
const SECRET_KEY = process.env.TOSS_SECRET_KEY!;
const CLIENT_KEY = process.env.TOSS_CLIENT_KEY!;

export async function POST(req: NextRequest) {
  // 주문 데이터 설정
  const orderId = "order_" + Date.now(); // 고유값 생성
  const amount = 9900; // 원하는 결제금액(월 9,900원 예시)
  const customerName = "홍길동"; // 실제 로그인 정보로 대체

  // 필요한 정보 프론트로 전달
  return NextResponse.json({
    orderId,
    amount,
    customerName,
  });
}
