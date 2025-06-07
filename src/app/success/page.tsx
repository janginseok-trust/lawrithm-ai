"use client";

import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function SuccessPage() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#181821",
        color: "#fff",
        padding: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24 }}>
        ✅ {t("payment_success")}
      </h1>
      <p style={{ fontSize: 18, marginBottom: 30, textAlign: "center" }}>
        {t("pro_unlocked")}
        <br />
        {t("use_full")}
      </p>
      <Link
        href="/"
        style={{
          padding: "14px 28px",
          fontSize: 16,
          fontWeight: 700,
          background: "linear-gradient(90deg,#8ed6ff,#436fff)",
          color: "#181821",
          borderRadius: 12,
          boxShadow: "0 6px 20px rgba(80,120,255,0.2)",
          textDecoration: "none",
        }}
      >
        {t("back_home")}
      </Link>
    </div>
  );
}
