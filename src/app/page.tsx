"use client";

import React, { useState, useEffect, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";

type Lang = "ko" | "en";
type CardKey = "pro" | "pdf" | "ai" | "pkg";

interface Card {
  name: string;
  desc: string;
  price: string;
  features: string[];
  btn: string;
  best?: string;
}

interface Messages {
  slogan: string;
  slogan2: string;
  selectLabel: string;
  customPlaceholder: string;
  textareaPlaceholder: string;
  generate: string;
  generating: string;
  pdfDownload: string;
  proOnly: string;
  title: string;
  proCard: Card;
  pdfCard: Card;
  aiCard: Card;
  pkgCard: Card;
  disclaimer: string;
}

const messages: Record<Lang, Messages> = {
  ko: {
    slogan: "고객 데이터 미저장 · 9개국 지원 · 합법적 최신 AI 법률 자동화",
    slogan2: "No personal data stored · Legal AI for 9 countries · Always compliant & up-to-date",
    selectLabel: "법률 분야 선택 또는 직접 입력 선택",
    customPlaceholder: "법률 분야 직접 입력",
    textareaPlaceholder: "진술서/사건 요약 입력 (영어/한국어 모두 가능)",
    generate: "AI 리포트 생성",
    generating: "AI 리포트 생성 중...",
    pdfDownload: "PDF로 저장",
    proOnly: "Pro 사용자만 PDF 저장이 가능합니다.",
    title: "Lawrithm™ – AI Legal Report Generator",
    proCard: {
      name: "Pro Membership",
      desc: "PDF/AI 분석 무제한, 문서 저장, 전문가 전용 기능",
      price: "$49.00 / month",
      best: "BEST",
      features: ["무제한 사용", "모든 프리미엄 기능 포함", "문서 이력 관리", "전문가용 분석"],
      btn: "구독하기",
    },
    pdfCard: {
      name: "PDF Report",
      desc: "공식 진술서 PDF 다운로드",
      price: "$19.99",
      features: ["간편 공식 PDF 다운로드", "수정 없는 보고서"],
      btn: "PDF 리포트 결제",
    },
    aiCard: {
      name: "AI Analysis Report",
      desc: "리스크 자동 추출/사례 분석 포함 프리미엄 리포트",
      price: "$29.99",
      features: ["AI 기반 리스크 추출", "프리미엄 보고서 포맷"],
      btn: "AI 분석 결제",
    },
    pkgCard: {
      name: "Premium Package (Both Reports)",
      desc: "PDF 보고서 + AI 분석 리포트 패키지",
      price: "$44.99",
      features: ["모든 보고서 이용 가능", "최적의 가성비"],
      btn: "패키지 결제",
    },
    disclaimer:
      "본 서비스는 법률 자문을 제공하지 않으며, 모든 결과는 AI가 생성한 참고용 정보입니다. 오류 또는 부정확한 내용이 포함될 수 있으니, 법률 문제는 반드시 전문가와 상담하십시오. 고객의 개인정보 및 업로드 파일은 저장, 보관, 유출되지 않습니다.",
  },
  en: {
    slogan: "No personal data stored · Supported in 9 countries · Up-to-date legal AI",
    slogan2: "No personal data stored · Legal AI for 9 countries · Always compliant & up-to-date",
    selectLabel: "Select or enter a legal category",
    customPlaceholder: "Custom legal category",
    textareaPlaceholder: "Enter your statement/case summary (English/Korean both OK)",
    generate: "Generate AI Report",
    generating: "Generating AI Report...",
    pdfDownload: "Save as PDF",
    proOnly: "Only Pro users can download PDF.",
    title: "Lawrithm™ – AI Legal Report Generator",
    proCard: {
      name: "Pro Membership",
      desc: "Unlimited PDF/AI analysis, document storage, expert-only features",
      price: "$49/month",
      best: "BEST",
      features: ["Unlimited usage", "All premium features", "Document history", "Expert analysis"],
      btn: "Subscribe Now",
    },
    pdfCard: {
      name: "PDF Report",
      desc: "Download official statement PDF",
      price: "$19.99",
      features: ["Official PDF download", "Ready-to-use report"],
      btn: "Get PDF Report",
    },
    aiCard: {
      name: "AI Analysis Report",
      desc: "Premium report with AI risk extraction & legal analysis",
      price: "$29.99",
      features: ["AI-powered risk extraction", "Premium report format"],
      btn: "Get Analysis Report",
    },
    pkgCard: {
      name: "Premium Package (Both Reports)",
      desc: "Includes PDF Report + AI Analysis Report",
      price: "$44.99",
      features: ["Access to all reports", "Best value"],
      btn: "Get Both Reports",
    },
    disclaimer:
      "This service does not provide legal advice. All results are AI-generated and for reference only. Always consult a legal professional for actual matters. No personal data or uploaded files are stored, saved, or leaked.",
  },
};

const STRIPE_PRICE_IDS: Record<CardKey, string> = {
  pro: "price_1RSWguH0tqa0JCVf8X98PzAX",
  pdf: "price_1RSWhtH0tqa0JCVfJjMjRikP",
  ai: "price_1RSWioH0tqa0JCVfxguMqlz6",
  pkg: "price_1RSWjbH0tqa0JCVfCGIRdyLO",
};

export default function Home() {
  const [category, setCategory] = useState<string>("");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [statement, setStatement] = useState<string>("");
  const [report, setReport] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const stripePromise = useMemo(
    () => loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""),
    []
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const n = navigator.language || "en";
      setLang(n.startsWith("ko") ? "ko" : "en");
    }
  }, []);

  const t = messages[lang];

  const generateReport = async () => {
    const selectedCategory = category === "custom" ? customCategory.trim() : category;
    if (!selectedCategory)
      return alert(lang === "ko" ? "법률 분야를 입력하세요" : "Enter a legal category");
    if (!statement) return alert(lang === "ko" ? "진술서를 입력하세요" : "Enter your statement");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", selectedCategory);
      formData.append("file", new Blob([statement], { type: "text/plain" }));

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        setReport((lang === "ko" ? "오류: " : "Error: ") + data.error);
      } else {
        setReport(data.result || (lang === "ko" ? "리포트 생성 실패" : "Failed to generate report"));
      }
    } catch {
      setReport(lang === "ko" ? "리포트 생성 중 오류 발생" : "Error while generating report");
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    if (!report) return;
    import("jspdf").then((jsPDF) => {
      const doc = new jsPDF.default();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 10;
      const maxLineWidth = pageWidth - margin * 2;
      const lines = doc.splitTextToSize(report, maxLineWidth);
      doc.text(lines, margin, 20);
      doc.save("Lawrithm_Report.pdf");
    });
  };

  const handleStripeCheckout = async (type: CardKey) => {
    const stripe = await stripePromise;
    if (!stripe) {
      alert("Stripe 연동 오류! Stripe 공개키를 확인하세요.");
      return;
    }

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: STRIPE_PRICE_IDS[type], lang }),
    });

    const { sessionId, error } = await res.json();
    if (error || !sessionId) {
      alert("결제 세션 생성 오류! Stripe Price ID를 확인하세요.");
      return;
    }
    await stripe.redirectToCheckout({ sessionId });
  };

  useEffect(() => {
    fetch("/api/check-pro")
      .then((res) => res.json())
      .then((data) => setIsPro(data.isPro))
      .catch(() => setIsPro(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full flex flex-col items-center bg-blue-700 py-3 shadow">
        <span className="text-white text-base font-bold tracking-wide flex items-center gap-3">
          {t.slogan}
          <span className="text-xl ml-2">🇺🇸🇰🇷🇮🇳🇮🇩🇵🇭🇳🇬🇧🇷🇲🇽🇨🇦</span>
        </span>
        <span className="text-white text-xs font-normal mt-1 flex items-center gap-2">{t.slogan2}</span>
      </div>

      <main className="flex-1 flex flex-col items-center py-6">
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-8 w-full max-w-md flex flex-col items-center">
          <h1 className="text-xl font-extrabold mb-3 text-center leading-tight">{t.title}</h1>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CardKey | "")}
            className="mb-3 border px-3 py-2 rounded-xl w-full max-w-xs"
          >
            <option value="">{t.selectLabel}</option>
            <option value="Criminal">{lang === "ko" ? "형법" : "Criminal Law"}</option>
            <option value="Civil">{lang === "ko" ? "민법" : "Civil Law"}</option>
            <option value="Family">{lang === "ko" ? "가사법" : "Family Law"}</option>
            <option value="Labor">{lang === "ko" ? "노동법" : "Labor Law"}</option>
            <option value="Commercial">{lang === "ko" ? "상법" : "Commercial Law"}</option>
            <option value="Administrative">{lang === "ko" ? "행정법" : "Administrative Law"}</option>
            <option value="Constitutional">{lang === "ko" ? "헌법" : "Constitutional Law"}</option>
            <option value="International">{lang === "ko" ? "국제법" : "International Law"}</option>
            <option value="custom">{lang === "ko" ? "직접 입력" : "Custom input"}</option>
          </select>
          {category === "custom" && (
            <input
              type="text"
              placeholder={t.customPlaceholder}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="mb-3 border px-3 py-2 rounded-xl w-full max-w-xs"
              maxLength={50}
            />
          )}
          <textarea
            className="w-full max-w-xs border p-2 rounded-xl mb-4"
            rows={6}
            placeholder={t.textareaPlaceholder}
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            maxLength={5000}
          />
          <button
            onClick={generateReport}
            disabled={loading}
            className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl mb-4"
          >
            {loading ? t.generating : t.generate}
          </button>

          {report && (
            <div className="w-full max-w-xs bg-white rounded-xl shadow-md p-4">
              <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap mb-2">
                {report.length > 100 ? report.slice(0, 100) + "..." : report}
              </p>
              {isPro ? (
                <button
                  onClick={downloadPDF}
                  className="mt-2 w-full bg-black text-white rounded-xl py-2 font-bold hover:bg-gray-800"
                >
                  {t.pdfDownload}
                </button>
              ) : (
                <p className="mt-2 text-xs text-center text-gray-500">{t.proOnly}</p>
              )}
            </div>
          )}
        </div>

        <div className="w-full max-w-md mt-10 space-y-6">
          {(["proCard", "pdfCard", "aiCard", "pkgCard"] as const).map((key, i) => {
            const card = t[key];
            const type = key.replace("Card", "") as CardKey;
            return (
              <div
                key={i}
                className={`rounded-2xl p-6 ${
                  type === "pro"
                    ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white border border-blue-600 shadow-lg"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {type === "pro" && (
                    <span className="text-yellow-400 text-2xl animate-pulse">★</span>
                  )}
                  <span className="font-bold text-base">{card.name}</span>
                  {card.best && (
                    <span className="bg-white text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-1">
                      {card.best}
                    </span>
                  )}
                </div>
                <div className="text-xs mb-2">{card.desc}</div>
                <div className="font-extrabold text-lg mb-3">{card.price}</div>
                <ul className="text-xs mb-3 space-y-1 pl-3 list-disc">
                  {card.features.map((txt, i) => (
                    <li key={i}>{txt}</li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 font-bold rounded-xl transition ${
                    type === "pro"
                      ? "bg-white text-blue-700 hover:bg-gray-100"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                  onClick={() => handleStripeCheckout(type)}
                >
                  {card.btn}
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-white border-t py-8 mt-8">
        <div className="max-w-2xl mx-auto text-center text-xs text-gray-700 space-y-1">
          <div>
            <b>Lawrithm™</b> is a pending trademark of <b>CoreAxis Labs</b>.
          </div>
          <div>{t.disclaimer}</div>
          <div className="text-gray-400">
            사업자명: 코어액시스랩스(CoreAxis Labs) | 대표: 장인석
            <br />
            사업자등록번호: 233-39-01443 | 이메일: 589second@gmail.com
          </div>
          <div className="mt-1 text-gray-400">© 2025 CoreAxis Labs. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

