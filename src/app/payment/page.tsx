"use client";

import Script from "next/script";
import { useState } from "react";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // 서버에서 orderId, amount 등 정보 받아오기
    const res = await fetch("/api/toss/ready", { method: "POST" });
    const data = await res.json();
    const { orderId, amount, customerName } = data;

    // Toss Payments SDK 로드
    const tossPayments = (window as any).TossPayments("YOUR_CLIENT_KEY");

    tossPayments.requestPayment("카드", {
      amount,
      orderId,
      orderName: "월간 구독권",
      customerName,
      successUrl: `${window.location.origin}/success`,
      failUrl: `${window.location.origin}/fail`,
    });
    setLoading(false);
  };

  return (
    <>
      {/* TossPayments SDK Script */}
      <Script src="https://js.tosspayments.com/v1/payment" strategy="afterInteractive" />
      <button onClick={handlePayment} disabled={loading}>
        결제하기
      </button>
    </>
  );
}
