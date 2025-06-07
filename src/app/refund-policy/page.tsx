export default function RefundPolicyPage() {
  return (
    <div
      style={{
        padding: 40,
        maxWidth: 700,
        margin: "0 auto",
        color: "#fff",
        fontFamily: "'Noto Serif KR', serif",
        backgroundColor: "#222236",
        borderRadius: 18,
        boxShadow: "0 12px 36px rgba(142,214,255,0.15)",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 32, color: "#8ed6ff" }}>
        Refund Policy
      </h1>
      <p style={{ fontSize: 18, marginBottom: 24 }}>
        Our refund policy is as follows:
      </p>
      <ul
        style={{
          fontSize: 17,
          marginLeft: 20,
          marginBottom: 30,
          color: "#c5d0ff",
          listStyleType: "disc",
        }}
      >
        <li>
          • Pro Membership is activated manually by our team after payment confirmation.
        </li>
        <li>
          • Refund requests must be made within 7 days of payment.
        </li>
        <li>
          • If the AI analysis service (e.g., report generation) has been used at least once, refunds may be limited or denied.
        </li>
        <li>
          • For refund requests or questions, please contact our support team at <a href="mailto:589second@gmail.com" style={{ color: "#8ed6ff" }}>589second@gmail.com</a>.
        </li>
        <li>
          • Refunds will be processed promptly after verifying payment and service usage history.
        </li>
        <li>
          • For more details on refunds, please refer to our Terms of Use.
        </li>
      </ul>
      <p style={{ fontSize: 16, color: "#8ed6ff", fontWeight: "600" }}>
        If you have any inconvenience, please contact us and we will do our best to assist you.
      </p>
    </div>
  );
}
