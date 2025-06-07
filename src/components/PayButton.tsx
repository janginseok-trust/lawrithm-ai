"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";

export default function PayButton() {
  return (
    <div className="w-full">
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(_, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: "9.99", // Trial Pass 가격
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          console.log("🟡 onApprove 시작됨");

          const details = await actions?.order?.capture();
          console.log("🎯 결제 성공 후 디테일:", details);

          const orderId = details?.id;
          const customerEmail = details?.payer?.email_address;
          const planType = "Trial Pass";

          if (!orderId || !customerEmail) {
            console.error("❌ 필수 정보 누락");
            return;
          }

          try {
            const res = await fetch("/api/paypal/confirm", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderId,
                customerEmail,
                planType,
              }),
            });

            const result = await res.json();
            console.log("📨 서버 응답:", result);

            if (result.success) {
              alert("✅ 결제가 완료되었습니다. Pro 권한이 부여되었습니다.");
            } else {
              alert("❗ 서버 처리 중 오류 발생: " + result.error);
            }
          } catch (err) {
            console.error("🔥 서버 요청 실패:", err);
            alert("❌ 네트워크 오류 또는 서버 문제");
          }
        }}
        onError={(err) => {
          console.error("🛑 PayPal 결제 오류:", err);
        }}
      />
    </div>
  );
}
