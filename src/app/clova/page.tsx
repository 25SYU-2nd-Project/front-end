'use client';

import { useState, useRef } from 'react';

export default function ClovaSpeech() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

      try {
        const response = await fetch('/api/stt', {
          method: 'POST',
          body: audioBlob,
        });

        if (!response.ok) throw new Error('API 요청 실패');

        const result = await response.json();
        setTranscript(result.text || '[결과 없음]');
      } catch (error) {
        console.error('❌ 변환 실패:', error);
        setTranscript('오류가 발생했습니다.');
      }

      audioChunksRef.current = [];
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop());
    setRecording(false);
  };

  return (
    <div className="p-4 rounded border w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">🎙 CLOVA Speech 인식기</h2>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? '녹음 중지' : '녹음 시작'}
      </button>
      <div className="mt-4">
        <p className="text-gray-700 font-medium">📝 변환 결과:</p>
        <p className="bg-gray-100 p-3 rounded mt-2 whitespace-pre-wrap">{transcript}</p>
      </div>
    </div>
  );
}
