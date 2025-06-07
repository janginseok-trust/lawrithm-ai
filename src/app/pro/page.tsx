"use client";

import Script from "next/script";
import { useRef } from "react";

export default function ProPage() {
  const renderedRef = useRef(false);

  function renderPayPalButtons() {
    if (renderedRef.current) return;
    renderedRef.current = true;

    if (typeof window !== "undefined" && window.paypal) {
      // 14일 구독 버튼
      (window.paypal as any).Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: function (data: any, actions: any) {
          return actions.subscription.create({
            plan_id: "P-43538694WP0210040NA7KYGA", // 14일 플랜 ID
          });
        },
        onApprove: async function (data: any) {
          alert("✅ 결제가 완료되었습니다. Pro 권한을 활성화합니다.");
          await fetch("/api/paypal/subscription-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionID: data.subscriptionID }),
          });
          window.location.href = "/success";
        },
      }).render("#paypal-button-container-14d");

      // 월간 구독 버튼
      (window.paypal as any).Buttons({
        style: {
          shape: "rect",
          color: "gold",
          layout: "vertical",
          label: "subscribe",
        },
        createSubscription: function (data: any, actions: any) {
          return actions.subscription.create({
            plan_id: "P-1HE93620W8345020UNA7LJSY", // 월간 플랜 ID
          });
        },
        onApprove: async function (data: any) {
          alert("✅ 월간 구독 결제가 완료되었습니다.");
          await fetch("/api/paypal/subscription-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionID: data.subscriptionID }),
          });
          window.location.href = "/success";
        },
      }).render("#paypal-button-container-month");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Pro 구독</h1>

      {/* 14일 상품 */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>14일 / $59.99</h2>
        <p>
          모든 기능 무제한 + AI 분석 리포트 제공
          <br />
          <b>결제 후 환불 불가, 개인 데이터 저장 안함</b>
        </p>
        <div id="paypal-button-container-14d" />
      </div>

      {/* 월간 상품 */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600 }}>1개월 / $119.99</h2>
        <p>
          모든 기능 무제한 + 우선 분석 제공
          <br />
          <b>결제 후 환불 불가, 개인 데이터 저장 안함</b>
        </p>
        <div id="paypal-button-container-month" />
      </div>

      {/* PayPal SDK Script */}
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
        strategy="afterInteractive"
        onLoad={renderPayPalButtons}
      />
    </div>
  );
}



