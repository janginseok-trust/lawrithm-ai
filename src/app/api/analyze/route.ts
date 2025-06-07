import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/verifyToken";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

const COUNTRY_LAW = {
  US: { name: "United States", statute: "All Law", law_name: "Constitution and Federal Law" },
  GB: { name: "United Kingdom", statute: "All Law", law_name: "Constitution and Common Law" },
  AU: { name: "Australia", statute: "All Law", law_name: "Australian Constitution and Law" },
  CA: { name: "Canada", statute: "All Law", law_name: "Canadian Constitution and Law" },
  DE: { name: "Germany", statute: "All Law", law_name: "Grundgesetz und Gesetze" },
  NZ: { name: "New Zealand", statute: "All Law", law_name: "Crimes Act and Constitution" },
  SG: { name: "Singapore", statute: "All Law", law_name: "Penal Code and Constitution" },
};

async function readCsvData(countryCode = "US") {
  try {
    const filePath = path.resolve(process.cwd(), `data/laws_merge_${countryCode.toLowerCase()}.csv`);
    if (!fs.existsSync(filePath)) return [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { parse } = await import("csv-parse/sync");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });
    return Array.isArray(records) ? records : [];
  } catch (e) {
    return [];
  }
}

function findRelevantCsvText(content: string, csvData: any[]) {
  if (!content || !csvData.length) return "";
  const lower = (str: string) => (str || "").toLowerCase();
  const keywords = lower(content).replace(/[^\w\s]/g, "").split(/\s+/).filter((x) => x.length > 1);
  const scored = csvData
    .map((row) => {
      const rowText = lower(row.content || "");
      const hit = keywords.filter((k) => rowText.includes(k));
      return { ...row, score: hit.length };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return scored.map((r) => `● ${r.filename}\n${r.content?.slice(0, 600)}`).join("\n\n");
}

function getPrompt(
  content: string,
  countryCode: keyof typeof COUNTRY_LAW,
  category: string,
  type: "preview" | "ai",
  csvRelevantText: string = ""
) {
  const categoryMap: Record<string, string> = {
    all: "All Law",
    criminal: "Criminal Law",
    civil: "Civil Law",
  };
  const categoryName = categoryMap[category] || category;
  const csvBlock = csvRelevantText ? `\n[Reference: Below are relevant statutes/cases/templates found in the latest database]\n${csvRelevantText}\n` : "";

  const base = `
Summarize the following statement with maximum specificity for the selected country (${COUNTRY_LAW[countryCode].name}) and category (${categoryName}), listing applicable statutes (with number), law names, main legal principles, key issues, and applicability.
1. Statute number, official law name, key issues, and main legal reasoning must be included.
2. Return different statutes/issues/cases depending on the facts (e.g., assault, theft, damages).
3. If not relevant or not enough information, reply: "No applicable statute found" or "No legal issue identified in the given statement."
${csvBlock}
[Statement] ${content}
`.trim();

  return type === "ai"
    ? base + "\nWrite the result as a professional analysis (around 800 words, separated by sections, include basis/risk/issues/statute numbers)."
    : base + "\nWrite the result in under 100 words (include statute number/law name/key issues/applicability, split in 2 lines).";
}

async function callGPT(openai: OpenAI, prompt: string, maxLen = 400) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: Math.ceil(maxLen * 2),
    temperature: 0.1,
  });
  return (res.choices?.[0]?.message?.content || "").trim();
}

function refine(text: string) {
  const disclaimer = "\n\n⚠️ Disclaimer: This AI-generated content is for informational purposes only and does not constitute legal advice.";
  if (!text || text.trim().length < 12 || /(no applicable statute|no legal issue|irrelevant|not found|none)/i.test(text)) {
    return "No legal issue identified in the given statement.\nPlease enter a valid case statement." + disclaimer;
  }
  return text + disclaimer;
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const content = (json.content || "").trim();
    const country = (json.country || "US") as keyof typeof COUNTRY_LAW;
    const category = json.law || "all";
    if (!content) return NextResponse.json({ error: "A statement or file text is required." }, { status: 400 });

    const csvData = await readCsvData(country);
    const csvRelevantText = findRelevantCsvText(content, csvData);

    const previewRaw = await callGPT(openai, getPrompt(content, country, category, "preview", csvRelevantText), 120);

    const authHeader = req.headers.get("authorization");
    let decoded: any = null;
    if (authHeader) {
      decoded = await verifyToken(authHeader.replace("Bearer ", ""));
    }

    if (decoded && decoded.email === ADMIN_EMAIL) {
      const aiRaw = await callGPT(openai, getPrompt(content, country, category, "ai", csvRelevantText), 800);
      return NextResponse.json({
        preview: refine(previewRaw).slice(0, 200), // 200자 제한!
        ai: refine(aiRaw),
      });
    }

    if (!decoded || typeof decoded !== "object" || !("email" in decoded)) {
      return NextResponse.json({
        preview: refine(previewRaw).slice(0, 200), // 200자 제한!
        ai: null,
      });
    }

    const userEmail = decoded.email as string;
    const userRef = db.collection("users").doc(userEmail);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return NextResponse.json({ error: "No active plan. Please purchase a plan." }, { status: 403 });
    }
    const user = userSnap.data()!;
    const now = Date.now();

    if (!user.expiresAt || now > user.expiresAt) {
      return NextResponse.json({ error: "Plan expired. Please renew." }, { status: 403 });
    }
    if (
      user.usageLimit !== undefined &&
      user.usedCount !== undefined &&
      user.usedCount >= user.usageLimit
    ) {
      return NextResponse.json({ error: "Usage limit exceeded. Upgrade plan." }, { status: 403 });
    }

    const aiRaw = await callGPT(
      openai,
      getPrompt(content, country, category, "ai", csvRelevantText),
      800
    );

    await userRef.update({
      usedCount: (user.usedCount ?? 0) + 1,
      updatedAt: now,
    });

    return NextResponse.json({
      preview: refine(previewRaw).slice(0, 200), // 200자 제한!
      ai: refine(aiRaw),
    });
  } catch (error) {
    return NextResponse.json({ error: "AI analysis failed", detail: String(error) }, { status: 500 });
  }
}
