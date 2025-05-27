"use client";

import { useEffect, useState } from "react";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/get-logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setLogs(data.logs || []);
        } else {
          setError("불러오기 실패");
        }
      })
      .catch(() => setError("서버 오류"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">📊 AI 리포트 열람 로그</h1>
      {logs.length === 0 ? (
        <p className="text-sm text-gray-500">기록된 로그가 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log, i) => (
            <li key={i} className="border rounded-xl p-4 bg-white shadow">
              <div className="text-xs text-gray-500 mb-2">
                열람시간: {new Date(log.viewedAt).toLocaleString()}
              </div>
              <div className="text-sm text-gray-800">
                Report ID: {log.reportId}
              </div>
              {/* 필요한 경우 나라/IP 정보 추가 */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
