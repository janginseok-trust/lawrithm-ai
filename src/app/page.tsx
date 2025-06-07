"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Chatbot from "@/components/Chatbot";
import { useSession } from "next-auth/react";
import { downloadLegalReportDOCX } from "@/lib/docxUtil";
import gbCases from "@/lib/gbCases";
import usCases from "@/lib/usCases";
import deCases from "@/lib/deCases";
import caCases from "@/data/canada_cases_2025.json";
import indiaCases from "@/data/india_cases_2025.json";

// --- 타입 선언 ---
type LawOption = { value: string; label: string };
type LawOptionsByCountryType = { [key: string]: LawOption[] };
type CasesByCountryType = { [key: string]: any[] };

// --- 타입 적용해서 선언 ---
const LAW_OPTIONS_BY_COUNTRY: LawOptionsByCountryType = {
  GB: [
    { value: "all", label: "All Divisions" },
    { value: "ch", label: "Chancery" },
    { value: "fam", label: "Family" },
    { value: "ipec", label: "Intellectual Property" },
    { value: "kb", label: "King's Bench" },
    { value: "comm", label: "Commercial" },
    { value: "admin", label: "Administrative" },
  ],
  US: [
    { value: "all", label: "All Laws" },
    { value: "criminal", label: "Criminal Law" },
    { value: "civil", label: "Civil Law" },
    { value: "constitutional", label: "Constitutional Law" },
    { value: "intellectual", label: "Intellectual Property" },
  ],
  DE: [
    { value: "all", label: "All Laws" },
    { value: "criminal", label: "Criminal Law" },
    { value: "civil", label: "Civil Law" },
  ],
  CA: [
    { value: "all", label: "All Laws" },
    { value: "immigration", label: "Immigration" },
    { value: "criminal", label: "Criminal Law" },
    { value: "civil", label: "Civil Law" },
    { value: "refugee", label: "Refugee Law" },
  ],
  default: [
    { value: "all", label: "All Laws" },
    { value: "criminal", label: "Criminal Law" },
    { value: "civil", label: "Civil Law" },
  ],
};

const CASES_BY_COUNTRY: CasesByCountryType = {
  GB: gbCases,
  US: usCases,
  DE: deCases,
  CA: caCases,
  IN: indiaCases,
};

const PLANS = [
  {
    name: "⭐ Trial Pass",
    period: "24 hours",
    price: "$9.99",
    limitation: "Up to 5 reports (within 24 hours)",
    features: ["DOCX export included", "All core AI features"],
    payLink: "https://www.paypal.com/ncp/payment/MEFEHS66Z598A",
  },
  {
    name: "✅ Pro Pass",
    period: "14 days",
    price: "$59.99",
    limitation: "Up to 40 reports (within 14 days)",
    features: ["DOCX + PDF export", "AI legal analysis, auto law matching"],
    payLink: "https://www.paypal.com/ncp/payment/PFRX599F3R7BS",
  },
  {
    name: "💼 Unlimited",
    period: "30 days",
    price: "$119.99",
    limitation: "Unlimited reports (within 30 days)",
    features: [
      "All premium features, unlimited",
      "DOCX + PDF export",
      "Priority support",
    ],
    payLink: "https://www.paypal.com/ncp/payment/VW4RYKN32WFDN",
  },
];

function ZipUploader({ onUpload }: { onUpload?: (file: File) => void }) {
  return (
    <div style={{ minWidth: 160 }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", marginBottom: 6, display: "block" }}>
        Upload ZIP
      </span>
      <input
        type="file"
        accept=".zip"
        onChange={(e) => {
          if (onUpload && e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const { data: session } = useSession();

  const [country, setCountry] = useState("GB");
  const [law, setLaw] = useState("all");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [aiReport, setAiReport] = useState("");
  const reportContent = aiReport || preview;
  const [isProUser, setIsProUser] = useState(false);

  // 👇 스크롤 이동용 ref
  const membershipRef = useRef<HTMLDivElement | null>(null);

  // 에러/상태 관리
  const [errorMsg, setErrorMsg] = useState("");

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const casesData = CASES_BY_COUNTRY[country] || [];

  useEffect(() => {
    console.log("session.user.email", session?.user?.email);
    if (session) {
      fetch("/api/check-pro", {
        headers: {
          "x-user-email": session.user?.email ?? "",
        },
      })
        .then((res) => res.json())
        .then((data) => setIsProUser(data.isPro === true))
        .catch(() => setIsProUser(false));
    } else {
      setIsProUser(false);
    }
  }, [session]);

  useEffect(() => {
    setLaw("all");
  }, [country]);

  const lawOptions = LAW_OPTIONS_BY_COUNTRY[country] || LAW_OPTIONS_BY_COUNTRY.default;

  async function handleGenerate() {
    setErrorMsg("");
    if (!content.trim() && !file && !zipFile) {
      setErrorMsg("Please enter a case or upload a file.");
      return;
    }
    setLoading(true);
    setPreview("");
    setAiReport("");
    try {
      let body;
      let headers;
      if (file || zipFile) {
        body = new FormData();
        body.append("country", country);
        body.append("law", law);
        if (file) body.append("file", file);
        if (zipFile) body.append("zipFile", zipFile);
        headers = { "x-pro-user": isProUser ? "true" : "false" };
      } else {
        body = JSON.stringify({ content, country, law });
        headers = {
          "Content-Type": "application/json",
          "x-pro-user": isProUser ? "true" : "false",
        };
      }
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      if (data.error) {
        setErrorMsg("AI report failed: " + data.error);
        setLoading(false);
        return;
      }
      setPreview(data.preview || "");
      if (isProUser) setAiReport(data.ai || "");
      else setAiReport("");
    } catch (error) {
      setErrorMsg("Request failed.");
    } finally {
      setLoading(false);
    }
  }

  const downloadDocx = async (content: string, fileName: string) => {
  try {
    const res = await fetch("/api/download-docx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, fileName }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.reason || "Failed to download DOCX");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "Lawrithm_Report.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download report.");
  }
};


  function handleProSampleClick() {
    window.location.href = "/pro-sample";
  }

  // 면책문구 컴포넌트(무료/유료 공통 노출)
  function Disclaimer() {
    return (
      <div
        style={{
          marginTop: 20,
          padding: "13px 18px",
          background: "#233245",
          color: "#8ed6ff",
          fontWeight: 600,
          fontSize: 15,
          borderRadius: 8,
          lineHeight: 1.7,
        }}
      >
        ⚠️ <b>Disclaimer:</b> This service provides AI-generated legal information and
        does not constitute legal advice.
        <br />
        For specific legal matters, please consult a licensed attorney in your jurisdiction.
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Noto+Serif+KR:wght@700&display=swap');
        body {
          margin: 0; padding: 0;
          background: #181821;
          color: #fff;
          font-family: 'Noto Serif KR', serif;
        }
        a { color: #99aaff; text-decoration: none; }
        a:hover { text-decoration: underline; }
        button:hover { filter: brightness(0.93); }
        @media (max-width: 900px) {
          .main-input-box {
            width: 100% !important;
            max-width: 100vw !important;
            min-width: 0 !important;
            margin-left: 0 !important;
          }
          .membership-cards {
            flex-direction: column;
            gap: 18px !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          padding: "36px 12px 100px",
          background: "#181821",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Header */}
        <header
          style={{
            width: "100%",
            maxWidth: 980,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 32px",
            backgroundColor: "#21212b",
            borderRadius: 14,
            boxShadow: "0 12px 32px rgba(30,30,60,0.17)",
            marginBottom: 38,
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "1px",
            }}
          >
            Lawrithm
          </div>
          <nav
            style={{
              display: "flex",
              gap: 28,
              color: "#fff",
              fontWeight: 600,
              fontSize: 16,
              alignItems: "center",
            }}
          >
            <Link href="/about">About</Link>
            <Link href="/faq">FAQ</Link>
            <button
              onClick={handleProSampleClick}
              style={{
                marginLeft: 12,
                background: "linear-gradient(90deg,#a6c8ff,#5e85ff)",
                color: "#181821",
                fontWeight: 800,
                border: "none",
                borderRadius: 10,
                padding: "9px 24px",
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(90,120,255,0.17)",
                transition: "background 0.2s",
              }}
            >
              PRO Report Sample
            </button>
          </nav>
        </header>

        {/* Main input box */}
        <section
          className="main-input-box"
          style={{
            width: "100%",
            maxWidth: 540,
            minWidth: 320,
            margin: "0 auto 48px auto",
            background: "#232343",
            padding: "34px 30px 34px 30px",
            borderRadius: 24,
            boxShadow: "0 8px 40px rgba(20,50,120,0.13)",
            fontFamily: "'Noto Serif KR', serif",
            color: "#fff",
          }}
        >
          {/* 국가별 안내문구 */}
          <div
            style={{
              color: "#9ad0ff",
              fontSize: 16,
              fontWeight: 700,
              marginBottom: 18,
              lineHeight: 1.6,
            }}
          >
            {country === "GB" &&
              (() => {
                const caseData = gbCases[0];
                const title = caseData?.title || "UK Case";
                const date = caseData?.date || "N/A";
                const summary = caseData?.plain_text?.slice(0, 70) || "N/A";
                return (
                  <>
                    Number of UK cases: {gbCases.length} (as of {year}-{month}-{day})
                    <br />
                    📌 {title} ({date})
                    <br />
                    📝 {summary}...
                  </>
                );
              })()}
            {country === "US" &&
              (() => {
                const caseData = usCases[0];
                const summary = caseData?.plain_text?.slice(0, 70) || "N/A";
                const title = summary;
                const date = caseData?.date_created || "N/A";
                return (
                  <>
                    Number of U.S. cases: {usCases.length} (as of {year}-{month}-{day})
                    <br />
                    📌 {title} ({date})
                    <br />
                    📝 {summary}...
                  </>
                );
              })()}
            {country === "DE" &&
              (() => {
                const caseData = deCases[0];
                const title = caseData?.title || "DE Case";
                const date = caseData?.date || "N/A";
                const summary = caseData?.plain_text?.slice(0, 70) || "N/A";
                return (
                  <>
                    Number of DE cases: {deCases.length} (as of {year}-{month}-{day})
                    <br />
                    📌 {title} ({date})
                    <br />
                    📝 {summary}...
                  </>
                );
              })()}
            {country === "CA" &&
              (() => {
                const caseData = caCases[0];
                const title = caseData?.title || "CA Case";
                const date = caseData?.date || "N/A";
                const summary = caseData?.body?.slice(0, 70) || "N/A";
                return (
                  <>
                    Number of CA cases: {caCases.length} (as of {year}-{month}-{day})
                    <br />
                    📌 {title} ({date})
                    <br />
                    📝 {summary}...
                  </>
                );
              })()}
              {country === "IN" &&
  (() => {
    const caseData = indiaCases[0];
    const title = caseData?.title || "IN Case";
    const date = caseData?.date || "N/A";
    const summary = (caseData?.main_text || "").slice(0, 70) || "N/A";
    return (
      <>
        Number of IN cases: {indiaCases.length} (as of {year}-{month}-{day})
        <br />
        📌 {title} ({date})
        <br />
        📝 {summary}...
      </>
    );
  })()
}
          </div>

          {/* 국가·법률 선택 */}
          <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              aria-label="Select country"
              style={{
                flex: 1,
                padding: "13px 12px",
                borderRadius: 10,
                border: "1.5px solid #3b4669",
                fontSize: 15,
                color: "#b9baf3",
                background: "#181821",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="DE">Germany</option>
              <option value="CA">Canada</option>
              <option value="IN">India</option>
            </select>
            <select
              value={law}
              onChange={(e) => setLaw(e.target.value)}
              aria-label="Select law"
              style={{
                flex: 1,
                padding: "13px 12px",
                borderRadius: 10,
                border: "1.5px solid #3b4669",
                fontSize: 15,
                color: "#b9baf3",
                background: "#181821",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {lawOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 케이스/파일 업로드 */}
          <textarea
            placeholder="Describe your case or paste text here"
            rows={6}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (e.target.value) {
                setFile(null);
                setZipFile(null);
              }
            }}
            style={{
              width: "100%",
              borderRadius: 15,
              border: "1.5px solid #3b4669",
              padding: 16,
              fontSize: 16,
              color: "#fff",
              fontWeight: 500,
              background: "#191928",
              fontFamily: "'Noto Serif KR', serif",
              resize: "vertical",
              boxShadow: "inset 0 3px 10px rgb(44 47 72 / 0.13)",
              marginBottom: 16,
            }}
          />
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
              marginBottom: 18,
            }}
          >
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                    setContent("");
                    setZipFile(null);
                  }
                }}
                style={{
                  cursor: "pointer",
                  color: file ? "#8ed6ff" : "#ccc",
                }}
              />
              <span style={{ fontSize: 13, marginLeft: 8, color: "#a1a4af" }}>
                {file ? file.name : "No file selected"}
              </span>
            </div>
            <ZipUploader
              onUpload={(f) => {
                setZipFile(f);
                setContent("");
                setFile(null);
              }}
            />
            <span style={{ fontSize: 13, marginLeft: 8, color: "#a1a4af" }}>
              {zipFile ? zipFile.name : "No file selected"}
            </span>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              width: "100%",
              marginBottom: 6,
              padding: "16px 0",
              borderRadius: 16,
              background: "linear-gradient(90deg,#8ed6ff,#436fff)",
              color: "#181821",
              fontWeight: 800,
              fontSize: 18,
              border: "none",
              boxShadow: "0 10px 32px rgba(80,100,255,0.21)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s ease",
            }}
            aria-label="Generate AI Report"
          >
            {loading ? "Generating..." : "Generate AI Report"}
          </button>
          {/* 에러/상태 메시지 */}
          {errorMsg && (
            <div style={{ marginTop: 14, color: "#ff7a8a", fontWeight: 600, fontSize: 15 }}>
              {errorMsg}
            </div>
          )}

          {/* ✅ Free Preview 전체 표시 */}
          {preview && (
            <div
              style={{
                background: "#2d3555",
                padding: 16,
                borderRadius: 10,
                marginTop: 18,
                color: "#bdf",
                fontWeight: 600,
                whiteSpace: "pre-wrap",
              }}
            >
              {preview}
            </div>
          )}

          {/* ✅ Unlock Pro Report 안내 버튼 */}
          {!isProUser && preview && (
            <div
              style={{
                marginTop: 20,
                padding: 20,
                background: "#2a2f45",
                borderRadius: 12,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#cde6ff",
                  marginBottom: 10,
                }}
              >
                Want the full legal analysis & DOCX download?
              </div>
              <button
                onClick={() => {
                  membershipRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                style={{
                  padding: "13px 28px",
                  background: "linear-gradient(90deg, #a6e1ff, #597bff)",
                  color: "#181821",
                  fontWeight: 800,
                  borderRadius: 12,
                  fontSize: 16,
                  border: "none",
                  boxShadow: "0 4px 14px rgba(100,120,255,0.2)",
                  cursor: "pointer",
                }}
              >
                Unlock Pro Report
              </button>
            </div>
          )}

          {/* Payment Assistance Notice */}
          <div
            style={{
              width: "100%",
              maxWidth: 700,
              margin: "0 auto 32px auto",
              textAlign: "center",
              color: "#5ef7b6",
              fontWeight: 800,
              fontSize: 17,
              letterSpacing: "0.2px",
              lineHeight: "1.6",
            }}
          >
            💬 For payment assistance, please contact us:
            <br />
            📧 <a href="mailto:589second@gmail.com" style={{ color: "#8ed6ff" }}>589second@gmail.com</a>
            <br />
            ⚠️ Due to PayPal's policy restrictions in Korea, direct payment may not be available.
          </div>

          {/* Pro Report (Paid) */}
          {isProUser && reportContent && (
            <section
              aria-label="Pro Report"
              style={{
                padding: 15,
                background: "#314288",
                borderRadius: 12,
                fontSize: 15,
                color: "#fff",
                whiteSpace: "pre-wrap",
                marginBottom: 10,
              }}
            >
              <strong>Pro Report:</strong>
              <br />
              {reportContent}
              <div style={{ marginTop: 18, textAlign: "right" }}>
                <button
                  onClick={() => downloadDocx(reportContent, "Lawrithm_Report.docx")}
                  style={{
                    padding: "11px 26px",
                    background: "linear-gradient(90deg,#8ed6ff,#436fff)",
                    color: "#181821",
                    fontWeight: 800,
                    borderRadius: 12,
                    fontSize: 16,
                    border: "none",
                    boxShadow: "0 4px 14px rgba(100,120,255,0.15)",
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  Download DOCX
                </button>
              </div>
              <Disclaimer />
            </section>
          )}
        </section>

        {/* Membership Cards */}
        <section
          className="membership-cards"
          ref={membershipRef}
          style={{
            width: "100%",
            maxWidth: 700,
            margin: "0 auto 42px auto",
            borderRadius: 18,
            border: "1.8px solid #8ed6ff",
            boxShadow: "0 8px 36px rgba(142,214,255,0.13)",
            padding: "42px 24px 36px 24px",
            background: "#181821",
            color: "#e0e7ff",
            fontFamily: "'Noto Serif KR', serif",
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              style={{
                flex: "1 1 240px",
                minWidth: 220,
                textAlign: "center",
                background: "#21223c",
                borderRadius: 16,
                boxShadow: "0 2px 16px rgba(88,180,255,0.08)",
                padding: "28px 12px 18px 12px",
                marginBottom: 0,
                marginTop: 0,
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: 22,
                  marginBottom: 11,
                  color: "#fff",
                  letterSpacing: "0.5px",
                }}
              >
                {plan.name}
              </div>
              <div style={{ color: "#c2eaff", fontSize: 16, marginBottom: 7, fontWeight: 700 }}>
                {plan.price} / {plan.period}
              </div>
              <div style={{ color: "#b0f7e2", fontSize: 14, marginBottom: 7 }}>
                {plan.limitation}
              </div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: 14, textAlign: "left" }}>
                {plan.features.map((f, idx) => (
                  <li
                    key={idx}
                    style={{ color: "#8ed6ff", fontSize: 15, marginBottom: 2, paddingLeft: 12 }}
                  >
                    ✅ {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => window.open(plan.payLink, "_blank")}
                style={{
                  width: "100%",
                  padding: "15px 0",
                  background:
                    i === 0
                      ? "linear-gradient(90deg,#7fe7c3,#5e85ff)"
                      : i === 1
                      ? "linear-gradient(90deg,#8ed6ff,#436fff)"
                      : "linear-gradient(90deg,#7cb2ff,#3d7ffd)",
                  color: "#181821",
                  fontWeight: 800,
                  fontSize: 18,
                  borderRadius: 13,
                  border: "none",
                  boxShadow: "0 6px 24px rgba(80,120,255,0.15)",
                  cursor: "pointer",
                  marginBottom: 8,
                  letterSpacing: "1px",
                  marginTop: 7,
                }}
              >
                {plan.price} / {plan.period}
              </button>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer
          style={{
            fontSize: 13,
            color: "#8ed6ff",
            textAlign: "center",
            marginTop: 40,
            fontFamily: "'Noto Serif KR', serif",
            lineHeight: 1.7,
          }}
        >
          <Link href="/refund-policy" style={{ color: "#8ed6ff", marginRight: 14 }}>
            Refund Policy
          </Link>
          |
          <Link href="/terms" style={{ color: "#8ed6ff", margin: "0 14px" }}>
            Terms of Use
          </Link>
          |
          <Link href="/privacy-policy" style={{ color: "#8ed6ff" }}>
            Privacy Policy
          </Link>
          <p style={{ marginTop: 10, color: "#3e4761" }}>
            Company: CoreAxis Labs Inc. | CEO: Inseok Jang
            <br />
            Business Registration No: 233-39-01443
            <br />
            Address: 105-C115, Daemyung Bicens City, 196 World Cup-ro, Mapo-gu, Seoul, Korea
            <br />
            Email: 589second@gmail.com
          </p>
          Lawrithm™ is a trademark of CoreAxis Labs Inc.
          <p style={{ marginTop: 12, fontSize: 12, color: "#3e4761" }}>
            This service provides AI-generated legal information and does not constitute legal advice.
            <br />
            For specific legal matters, please consult a licensed attorney in your jurisdiction.
          </p>
        </footer>
      </div>
      {/* 👇 오른쪽 하단 플로팅 챗봇 */}
      <Chatbot />
    </>
  );
}
