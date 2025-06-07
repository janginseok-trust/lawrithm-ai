"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafc",
      }}
    >
      <div
        style={{
          padding: 38,
          borderRadius: 16,
          background: "#fff",
          boxShadow: "0 6px 24px #d4d8fa44",
          minWidth: 340,
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: 800, marginBottom: 32 }}>
          구글로 1초 로그인
        </h2>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            width: "100%",
            background: "#4285F4",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            fontWeight: 700,
            fontSize: 17,
            padding: "13px 0",
            marginBottom: 10,
            cursor: "pointer",
            boxShadow: "0 4px 10px #aaa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
            alt="구글"
            style={{ height: 24 }}
          />
          구글 로그인
        </button>
      </div>
    </div>
  );
}
