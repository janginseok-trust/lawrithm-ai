// src/app/admin/purchases/page.tsx

"use client";

import { useEffect, useState } from "react";

interface Purchase {
  email: string;
  type: string;
  updatedAt: number;
}

export default function PurchasesPage() {
  const [data, setData] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/purchases")
      .then((res) => res.json())
      .then((res) => {
        setData(res.purchases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">결제 내역 (Admin)</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : data.length === 0 ? (
        <p>결제 기록이 없습니다.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">상품 종류</th>
              <th className="border px-4 py-2">결제일시</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="text-center">
                <td className="border px-4 py-2">{row.email}</td>
                <td className="border px-4 py-2">{row.type}</td>
                <td className="border px-4 py-2">
                  {new Date(row.updatedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
