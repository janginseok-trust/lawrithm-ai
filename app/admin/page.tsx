// src/app/admin/page.tsx

"use client";

import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const addLaw = async () => {
    if (!category || !title || !content) {
      setMessage("모든 필드를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("/api/admin/add-law", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, content }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("법령이 성공적으로 추가되었습니다.");
        setTitle("");
        setContent("");
      } else {
        setMessage("법령 추가에 실패했습니다.");
      }
    } catch {
      setMessage("서버 오류 발생.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">법령/판례 관리자</h1>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-3 border p-2 rounded w-full"
      >
        <option value="">카테고리 선택</option>
        <option value="형법">형법</option>
        <option value="민법">민법</option>
        <option value="국제법">국제법</option>
        <option value="가사법">가사법</option>
        <option value="노동법">노동법</option>
        <option value="상법">상법</option>
        <option value="행정법">행정법</option>
        <option value="헌법">헌법</option>
      </select>
      <input
        type="text"
        placeholder="법령 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-3 border p-2 rounded w-full"
      />
      <textarea
        placeholder="법령 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="mb-3 border p-2 rounded w-full"
      />
      <button
        onClick={addLaw}
        className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
      >
        법령 추가
      </button>
      {message && <p className="mt-3 text-center text-sm text-red-600">{message}</p>}
    </div>
  );
}
