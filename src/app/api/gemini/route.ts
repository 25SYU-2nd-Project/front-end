// src/app/api/gemini/route.ts
// 이전의 pages/api/summarize.ts 파일 내용과 동일하지만, NextRequest와 NextResponse를 사용합니다.
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { NextResponse } from 'next/server'; // Next.js 13+ App Router용 응답 객체

// API 응답 데이터 타입을 정의합니다.
interface SummarizeResponse {
  summarizedText?: string;
  message?: string;
  error?: string;
}

// POST 핸들러 함수를 export 합니다. (GET, POST 등 각 HTTP 메서드별 함수를 export)
export async function POST(req: Request) { // App Router에서는 Request 객체를 직접 받습니다.
  const { text } = await req.json() as { text: string }; // req.json()으로 body 파싱

  if (!text) {
    return NextResponse.json({ message: '텍스트를 제공해주세요.' }, { status: 400 });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
    return NextResponse.json({ message: '서버 설정 오류: API 키가 없습니다.' }, { status: 500 });
  }

  try {
    const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model: GenerativeModel = genAI.getGenerativeModel({ model:"models/gemini-1.5-pro-latest" });

    // 변경된 프롬프트 적용: 핵심 내용 위주로 요약하라는 지시 추가
    const prompt: string = `다음 텍스트를 핵심 내용 위주로 요약해 주세요: \n\n"${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summarizedText: string = response.text();

    return NextResponse.json({ summarizedText }, { status: 200 });

  } catch (error: any) {
    console.error('Gemini API 호출 중 오류 발생:', error);
    return NextResponse.json({ message: '텍스트 요약 중 오류가 발생했습니다.', error: error.message }, { status: 500 });
  }
}