"use client";

import { useEffect, useState } from "react";

type Log = {
  reportId: string;
  viewedAt: string;
  ip?: string;
};

export default function ShareLogsAdminPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/share-logs")
      .then((res) => res.json())
      .then((res) => setLogs(res.logs || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="max-w-2xl mx-auto my-12 px-4">
      <h1 className="text-2xl font-bold mb-6">공유 열람 로그</h1>
      {loading ? (
        <div className="text-center py-20">로딩중...</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-gray-400">열람 기록이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">열람시각</th>
                <th className="p-2 border">Report ID</th>
                <th className="p-2 border">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2 border">{new Date(log.viewedAt).toLocaleString()}</td>
                  <td className="p-2 border">{log.reportId}</td>
                  <td className="p-2 border">{log.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
