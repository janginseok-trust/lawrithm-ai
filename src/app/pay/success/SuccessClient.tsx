"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id") ?? "없음";

  return (
    <div>
      <p>결제 성공! 세션 ID: {sessionId}</p>
    </div>
  );
}
