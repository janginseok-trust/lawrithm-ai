import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const category = form.get("category")?.toString() || "";
    const file = form.get("file");
    // File 타입 체크
    const fileObj = file instanceof File ? file : null;

    const statement = fileObj ? await fileObj.text() : "";

    if (!category || !statement) {
      return NextResponse.json({ error: "카테고리와 진술문을 입력하세요." }, { status: 400 });
    }

    // GPT API 요청
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "OpenAI API 키 누락" }, { status: 500 });

    const prompt = `
      [카테고리] ${category}
      [진술문/사건요약] ${statement}
      위 내용을 법률 전문가처럼 논리적으로 요약 및 해석해 리포트로 작성해줘. (500자 이내, 핵심 위주, 인공지능임을 명시)
    `;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 700,
        temperature: 0.2
      })
    });

    // 타입 안전하게 지정
    type GptResponse = {
      choices?: Array<{ message?: { content?: string } }>;
      error?: string;
    };

    const json: GptResponse = await gptRes.json();
    const result = json.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ result });
  } catch (e) {
    // e는 unknown 타입이기 때문에, 안전하게 처리
    const errorMsg = e instanceof Error ? e.message : "알 수 없는 오류";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
