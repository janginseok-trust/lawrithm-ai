"use client";
import { useRouter } from "next/navigation";

export default function CSFloatingButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/support")}
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 9999,
        background: "#151515",
        color: "#fff",
        border: "none",
        borderRadius: 50,
        width: 56,
        height: 56,
        boxShadow: "0 4px 18px #10101038",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 25,
        cursor: "pointer",
        transition: "background 0.18s",
      }}
      aria-label="AI Customer Support"
      title="AI Customer Support"
    >
      {/* Simple chat icon SVG */}
      <svg width="29" height="29" fill="none" viewBox="0 0 29 29">
        <circle cx="14.5" cy="14.5" r="14.5" fill="#4054e6"/>
        <path d="M8 10.5a6.5 6.5 0 0111.3-4.6A6.5 6.5 0 0122 15.5a6.48 6.48 0 01-3.4 5.7c-.3.2-.5.5-.5.9v1.1a.5.5 0 01-.8.4l-1.8-1.4a.5.5 0 00-.5-.1A6.5 6.5 0 018 10.5z" fill="#fff"/>
      </svg>
    </button>
  );
}
