'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

// API 응답 데이터 타입을 정의합니다.
// pages/api/summarize.ts 파일에서 정의한 SummarizeResponse 인터페이스와 일치해야 합니다.
interface SummarizeResponse {
  summarizedText?: string;
  message?: string;
  error?: string;
}

export default function Home(): JSX.Element { // 컴포넌트 반환 타입을 JSX.Element로 명시합니다.
  const [inputText, setInputText] = useState<string>(''); // inputText는 문자열임을 명시
  const [summarizedText, setSummarizedText] = useState<string>(''); // summarizedText도 문자열임을 명시
  const [loading, setLoading] = useState<boolean>(false); // loading은 boolean임을 명시
  const [error, setError] = useState<string>(''); // error는 문자열임을 명시

  const handleSummarize = async (): Promise<void> => { // 비동기 함수이며 반환값이 없음을 명시
    setLoading(true);
    setError('');
    setSummarizedText(''); // 이전 요약 결과 초기화

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        // 응답이 OK가 아닐 경우 에러 데이터를 파싱합니다.
        const errorData: SummarizeResponse = await response.json();
        throw new Error(errorData.message || '요약 요청 실패');
      }

      // 성공적인 응답 데이터를 파싱합니다.
      const data: SummarizeResponse = await response.json();
      
      // summarizedText가 존재하는 경우에만 상태를 업데이트합니다.
      if (data.summarizedText) {
        setSummarizedText(data.summarizedText);
      } else {
        // 서버에서 summarizedText를 반환하지 않은 경우에 대한 처리
        throw new Error(data.message || '요약 결과를 받아오지 못했습니다.');
      }
    } catch (err: any) { // 에러 객체의 타입을 명확히 알 수 없을 때 'any'를 사용합니다.
      console.error('요약 중 오류 발생:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>텍스트 요약 (Gemini API with Next.js)</h1>

      <textarea
        value={inputText}
        // ChangeEvent<HTMLTextAreaElement>를 사용하여 이벤트 객체의 타입을 명시합니다.
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
        placeholder="요약할 텍스트를 입력하세요..."
        rows={10} // 숫자 리터럴은 중괄호 없이 사용 가능하지만, 일관성을 위해 사용
        cols={50} // 숫자 리터럴은 중괄호 없이 사용 가능하지만, 일관성을 위해 사용
        style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
      />
      <button
        // FormEvent<HTMLButtonElement>를 사용하여 이벤트 객체의 타입을 명시합니다.
        onClick={handleSummarize}
        disabled={loading || !inputText.trim()}
        style={{ padding: '10px 20px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {loading ? '요약 중...' : '텍스트 요약하기'}
      </button>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>오류: {error}</p>}

      {summarizedText && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <h2>요약 결과:</h2>
          <p>{summarizedText}</p>
        </div>
      )}
    </div>
  );
}