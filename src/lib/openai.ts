// src/lib/openai.ts
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 환경변수 노출 주의!
});

export default openai;
