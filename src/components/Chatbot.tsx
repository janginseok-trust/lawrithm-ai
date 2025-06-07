"use client";
import { useState, useRef } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content: "Hello! How can I help you? (Ex: service usage, payment, report details, etc.)",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Server API call
    const res = await fetch("/api/csbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...messages.filter((m) => m.role !== "system"), userMessage],
      }),
    });
    const data = await res.json();
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply || "Sorry, no response available." },
    ]);
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 10);
  }

  // 챗봇 닫기 시 입력초기화(선택)
  function handleClose() {
    setOpen(false);
    setInput("");
    // setMessages([...messages.slice(0, 1)]); // system 메시지만 남기고 싶으면 주석 해제
  }

  // 🟦 이모지 버튼/챗봇 UI 모두 포함
  return (
    <>
      {/* 이모티콘 플로팅 버튼 */}
      {!open && (
        <button
          aria-label="Open chatbot"
          onClick={() => setOpen(true)}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            width: 64,
            height: 64,
            background: "linear-gradient(135deg,#8ed6ff 60%,#4054e6 100%)",
            border: "none",
            borderRadius: "50%",
            boxShadow: "0 4px 24px rgba(80,120,255,0.23)",
            fontSize: 34,
            color: "#fff",
            cursor: "pointer",
            zIndex: 9999,
            transition: "background 0.18s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🤖
        </button>
      )}

      {/* 챗봇 UI */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            width: 360,
            maxHeight: 520,
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(53,70,177,0.7)",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            fontFamily: "'Noto Serif KR', serif",
            zIndex: 10000,
          }}
          aria-label="Support Chatbot"
        >
          {/* 헤더 + 닫기버튼 */}
          <header
            style={{
              backgroundColor: "#3546b1",
              color: "#fff",
              padding: "14px 18px 14px 20px",
              fontWeight: 700,
              fontSize: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            AI Support Chatbot
            <button
              aria-label="Close chatbot"
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                cursor: "pointer",
                padding: 0,
                marginLeft: 12,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </header>
          {/* 메시지 영역 */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              backgroundColor: "#f7f8fc",
              fontSize: 14,
              lineHeight: 1.5,
              color: "#2c2f48",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  margin: "12px 0",
                  fontWeight: msg.role === "system" ? 500 : 400,
                  color: msg.role === "assistant" ? "#2431a1" : "#333",
                  background:
                    msg.role === "assistant"
                      ? "#eef1fa"
                      : msg.role === "user"
                      ? "#f2f4f9"
                      : "#fffbe5",
                  borderRadius: 7,
                  padding: 10,
                  textAlign: "left",
                }}
              >
                {msg.role === "assistant" && <b>AI: </b>}
                {msg.role === "user" && <b>You: </b>}
                {msg.content}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {/* 입력창 */}
          <div
            style={{
              display: "flex",
              gap: 6,
              padding: 12,
              borderTop: "1px solid #e3e7f8",
              backgroundColor: "#f9fafc",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder="Type your question here!"
              style={{
                flex: 1,
                border: "1px solid #b2b6d9",
                borderRadius: 7,
                padding: "10px 11px",
                fontSize: 14,
              }}
              disabled={loading}
              aria-label="Chatbot input"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              style={{
                minWidth: 78,
                background: "#4054e6",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                borderRadius: 7,
                fontSize: 14,
                padding: "0 14px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.56 : 1,
              }}
              aria-label="Send message"
            >
              {loading ? "Loading..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
