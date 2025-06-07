import React from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <main>
      <h1>결제 성공 페이지</h1>
      <React.Suspense fallback={<p>로딩 중...</p>}>
        <SuccessClient />
      </React.Suspense>
    </main>
  );
}
