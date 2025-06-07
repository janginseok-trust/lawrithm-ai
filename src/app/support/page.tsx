"use client";

import { useState, useRef, useEffect } from "react";

export default function HomePage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "system",
      content:
        "Hello! How can I help you today? (Ex: How to use the service, payment, report info, etc.)",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (chatOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
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
        { role: "assistant", content: data.reply || "Sorry, I couldn't get a response." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "A server error has occurred." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&family=Noto+Serif+KR&display=swap');
        * { box-sizing: border-box; }
        body {
          margin: 0; padding: 0;
          font-family: 'Noto Serif KR', serif;
          color: #2c2f48;
          background-color: #f2f4f7;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          padding: 40,
          maxWidth: 600,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#f2f4f7",
        }}
      >
        {/* Main Title */}
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 24 }}>
          Lawrithm
        </h1>
        <p style={{ marginBottom: 48, fontSize: 18, color: "#4e5873", textAlign: "center" }}>
          AI-powered legal automation. No personal data stored. 24/7 instant AI reports for global users.
        </p>

        {/* ... Main page content, subscription cards, etc. ... */}

        {/* Chatbot Toggle Button */}
        <button
          aria-label="Open support chatbot"
          onClick={() => setChatOpen((open) => !open)}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "#3546b1",
            boxShadow: "0 12px 26px rgba(53,70,177,0.7)",
            color: "#fff",
            fontSize: 28,
            fontWeight: "bold",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none",
            zIndex: 9999,
            border: "none",
          }}
        >
          💬
        </button>

        {/* Chatbot Popup */}
        {chatOpen && (
          <section
            role="dialog"
            aria-label="Support Chatbot"
            style={{
              position: "fixed",
              bottom: 100,
              right: 28,
              width: 360,
              height: 480,
              backgroundColor: "#fff",
              borderRadius: 20,
              boxShadow: "0 16px 48px rgba(53,70,177,0.25)",
              display: "flex",
              flexDirection: "column",
              fontFamily: "'Noto Serif KR', serif",
              color: "#2c2f48",
              zIndex: 9999,
            }}
          >
            <header
              style={{
                padding: "16px 24px",
                borderBottom: "1.5px solid #d1d5df",
                fontWeight: 700,
                fontSize: 20,
                color: "#3546b1",
                userSelect: "none",
              }}
            >
              Lawrithm AI Support
            </header>

            <main
              style={{
                flex: 1,
                padding: 16,
                overflowY: "auto",
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 12,
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: msg.role === "user" ? "#3546b1" : "#e0e7ff",
                      color: msg.role === "user" ? "#fff" : "#1e293b",
                      padding: "8px 14px",
                      borderRadius: 14,
                      maxWidth: "80%",
                      wordBreak: "break-word",
                      userSelect: "text",
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
              <div ref={bottomRef} />
            </main>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!loading) handleSend();
              }}
              style={{ padding: 16, borderTop: "1.5px solid #d1d5df" }}
            >
              <textarea
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Type your question..."
                style={{
                  width: "100%",
                  resize: "none",
                  borderRadius: 12,
                  border: "1.5px solid #cbd5e1",
                  padding: "8px 12px",
                  fontSize: 15,
                  fontFamily: "'Noto Serif KR', serif",
                  color: "#2c2f48",
                  boxSizing: "border-box",
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "12px 0",
                  backgroundColor: "#3546b1",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 16,
                  borderRadius: 12,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "background-color 0.3s ease",
                }}
                onMouseOver={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2a3691";
                }}
                onMouseOut={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3546b1";
                }}
              >
                {loading ? "Sending…" : "Send"}
              </button>
            </form>
          </section>
        )}

        {/* Footer */}
        <footer
          style={{
            fontSize: 12,
            color: "#7a7e90",
            maxWidth: 560,
            textAlign: "center",
            marginTop: 72,
            lineHeight: 1.6,
            fontFamily: "'Noto Serif KR', serif",
            userSelect: "none",
          }}
        >
          <p style={{ marginBottom: 6 }}>
            Powered by CoreAxis Labs · contact: 589second@gmail.com
          </p>
          <p style={{ fontSize: 11, color: "#a5a7b0", marginTop: 28, lineHeight: 1.4 }}>
            This service is an AI-powered automation tool. It does not provide legal advice or legal representation. Use at your own risk; the company is not liable for legal outcomes.
          </p>
          <p style={{ fontSize: 11, color: "#a5a7b0", lineHeight: 1.4 }}>
            <a href="#">Terms of Use</a> &nbsp;|&nbsp; <a href="#">Privacy Policy</a>
          </p>
        </footer>
      </div>
    </>
  );
}
