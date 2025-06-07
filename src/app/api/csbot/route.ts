import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const systemPrompt = {
    role: "system",
    content: `
당신은 친절한 Lawrithm AI 고객지원 챗봇입니다.
사용자의 질문에 한국어/영어로 친절하게 답변하세요.
서비스의 법적 책임, 가격, 사용법, 결제/환불, 개인정보 저장 등 문의가 오면
가장 안전하고 신뢰성 있게 안내하세요.
반드시 "이 서비스는 법률자문이 아니며, 모든 결과는 AI가 생성한 참고 정보입니다. 고객 데이터는 저장하지 않습니다."를 답변에 자연스럽게 포함하세요.
`.trim(),
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [systemPrompt, ...messages],
      max_tokens: 600,
      temperature: 0.5,
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "AI 답변을 불러올 수 없습니다.";
  return NextResponse.json({ reply });
}
