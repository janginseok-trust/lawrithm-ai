// src/app/api/preview/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Redis from "ioredis";

// Redis 연결 (환경변수에 REDIS_URL 필요)
const redis = new Redis(process.env.REDIS_URL!);

const LIMIT = 10;      // 1분당 10회
const WINDOW = 60;     // 60초

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  // 1. 클라이언트 IP 추출 (Vercel, Cloudflare 등 프록시 대응)
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as any).ip ||
    "unknown";

  // 2. Redis에 카운터: 1분 동안 LIMIT 횟수 초과 시 차단
  const key = `preview-rate:${ip}`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, WINDOW); // 최초 1회만 만료시간 설정
  }
  if (current > LIMIT) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  // 3. 프리뷰 요약 실제 코드
  const { content } = await req.json();

  // Global prompt: Summarize as a professional legal summary (max 100 words, English, international style)
  const prompt = `
Summarize the following statement in clear, professional legal English (max 100 words), suitable for global use.
Statement: ${content}
  `.trim();

  const gptRes = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0.2,
  });

  // 100단어 이내로 잘라내고, 앞의 개행 제거
  const summary = gptRes.choices[0].message.content
    ?.replace(/^\n+/, "")
    .split(/\s+/)
    .slice(0, 100)
    .join(" ");

  return NextResponse.json({ summary });
}
