import { NextRequest } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const audioBuffer = await req.arrayBuffer();

  try {
    const clovaRes = await axios.post(
      'https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=Kor',
      Buffer.from(audioBuffer),
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'X-NCP-APIGW-API-KEY-ID': process.env.CLOVA_API_KEY_ID!,
          'X-NCP-APIGW-API-KEY': process.env.CLOVA_API_KEY!,
        },
      }
    );

    return new Response(JSON.stringify(clovaRes.data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('API Route Error:', error);
    return new Response('Failed to call CLOVA', { status: 500 });
  }
}
