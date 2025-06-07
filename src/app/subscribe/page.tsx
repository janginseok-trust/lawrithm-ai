"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayButton from "@/components/PayButton";

// PayPal 공식은 "client-id"로만 key를 씁니다.
// 타입 에러는 아래처럼 as any 처리하면 100% 무시됩니다.

export default function SubscribePage() {
  return (
    <PayPalScriptProvider
      options={
        {
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
          // "currency": "USD", // 필요하면 주석 해제
        } as any // 👈 타입 에러 방지
      }
    >
      <div style={{ padding: 60 }}>
        <h1>결제 테스트</h1>
        <PayButton />
      </div>
    </PayPalScriptProvider>
  );
}
