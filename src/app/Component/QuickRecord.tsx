'use client';
import '../Styles/QuickRecord.css';
import '../Styles/main.css'
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface QuickRecordProps {
  onStop: () => void;
  onCopyComplete: () => void;
}

export default function QuickRecord({ onStop, onCopyComplete }: QuickRecordProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(true);

  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [phase, setPhase] = useState<'recording' | 'done'>('recording');

  const handleGeminiSummarize = async () => {
    if (!transcript.trim()) return;

    try {
      setLoading(true);
      setSummary('');
      setError('');

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcript }),
      });

      const result = await response.json();

      if (response.ok && result.summarizedText) {
        setSummary(result.summarizedText);
        setPhase('done');
      } else {
        throw new Error(result.message || '요약 실패');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          const result = await response.json();
          setTranscript(result.text || '[결과 없음]');
        } catch (error) {
          console.error('❌ 변환 실패:', error);
          setTranscript('오류가 발생했습니다.');
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();

      if (timerRef.current) clearInterval(timerRef.current);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    };

    startRecording();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const endRecording = () => {
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop(); // 녹음 종료
      }
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // 스트림 강제 종료
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);  // 타이머 종료
      timerRef.current = null;
    }

    setIsPaused(false);
    setIsRecording(false);
    setSeconds(0);
    setPhase('done'); // 요약 단계로 전환 (요약 버튼만 보여짐)
  };


  const formatTime = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className='Recording-Quick-Record-Box'>
      <div className='Recording-Record-Header'>
        <Image className='Recording-Record-Header-Img' src="/images/blackmic.png" alt="MicLogo" width={24} height={24} />
        <p className='Recording-Record-Header-Text'>빠른 녹음 및 요약</p>
      </div>

      <div className='Recording-Record-Voice-Box'>
        <div className='Recording-Voice-Header'>
          <Image className='Recording-Voice-Header-Img' src="/images/whitemic.png" alt="MicLogo2" width={24} height={24} />
          <p className='Recording-Voice-Header-Text'>실시간 음성 기록 및 요약</p>
        </div>

        <div className='Recording-Voice-Content'>
          <div className='Recording-Voice-Content-Timer'>{formatTime(seconds)}</div>
          <div className='Recording-Voice-Content-ButtonBox'>
            {phase === 'recording' && (
              <>
                <Image
                  className='Recording-End-Button'
                  src="/images/RecordEnd.png"
                  alt="EndButton"
                  width={30}
                  height={30}
                  onClick={endRecording}
                  style={{ cursor: 'pointer' }}
                />
                <Image
                  className='Recording-Gemini-Button'
                  src="/images/Gemini.png"
                  alt="GemButton"
                  width={27}
                  height={27}
                  onClick={handleGeminiSummarize}
                  style={{ cursor: 'pointer' }}
                />
                {isPaused ? (
                  <Image
                    className='Recording-Play-Button'
                    src="/images/QuickRecordPlay.png"
                    alt="PlayButton"
                    width={30}
                    height={30}
                    onClick={resumeRecording}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <Image
                    className='Recording-Pause-Button'
                    src="/images/QuickRecordPause.png"
                    alt="PauseButton"
                    width={30}
                    height={30}
                    onClick={pauseRecording}
                    style={{ cursor: 'pointer' }}
                  />
                )}
              </>
            )}
            {phase === 'done' && (
              <Image
                className='Recording-Gemini-Button'
                src="/images/Gemini.png"
                alt="GemButton"
                width={27}
                height={27}
                onClick={handleGeminiSummarize}
                style={{ cursor: 'pointer' }}
              />
            )}
          </div>


          <div className='Recording-Gemini-Summary'>
            {loading ? (
              '요약 중입니다...'
            ) : error ? (
              `요약 오류: ${error}`
            ) : summary.trim() ? (
              <div>
                <h3>회의 요약</h3>
                <ul style={{ paddingLeft: '20px' }}>
                  {summary
                    .split('\n')
                    .filter(line => line.trim() !== '')
                    .map((line, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{line.trim().replace(/^[-•*]\s?/, '')}</li>
                    ))}
                </ul>
              </div>
            ) : (
              '음성이 아직 입력되지 않았습니다.'
            )}
          </div>

          <div className='Recording-Gemini-Save'>
            <p
              className='Save-Label'
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (summary.trim()) {
                  navigator.clipboard.writeText(summary);
                  onCopyComplete();
                } else {
                  alert('요약 결과가 없습니다.');
                }
              }}
            >
              요약본 클립보드에 저장
            </p>
          </div>
        </div>
      </div>

      <div className='Record-Voice-Summary'>
        <div className='Record-Voice-Summary-Header'>
          <Image
            className='Record-Voice-Summary-Header-Img'
            src="/images/SummaryIcon.png"
            alt="SummaryLogo"
            width={16.31}
            height={20}
          />
          <p className='Record-Voice-Summary-Header-Text'>텍스트 회의록 요약</p>
        </div>

        <div className='Record-Voice-Summary-Content'>
          <textarea
              id="manual-summary"
              className="Voice-Summary"
              placeholder="회의록 텍스트를 입력해주세요."
          />
        </div>
      </div>
        <div className='Record-Voice-Summary-Clipboard'>
          <p
            className='Save-Label'
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const textarea = document.getElementById('manual-summary') as HTMLTextAreaElement;
              const text = textarea?.value.trim();
              if (text) {
                navigator.clipboard.writeText(text);
                alert('클립보드에 복사되었습니다.');
              } else {
                alert('복사할 내용이 없습니다.');
              }
            }}
          >
            클립보드에 저장
          </p>
        </div>
    </div>
  );
}
