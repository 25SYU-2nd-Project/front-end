'use client'

import Header from "../../Component/Header"
import Footer from "../../Component/Footer"
import QuickRecord from "@/app/Component/QuickRecord"
import Image from "next/image"
import "../../Styles/BriefDetail.css"
import "../../Styles/main.css"
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';



import { useParams } from 'next/navigation'

const meetingList = [
    { id: 1, date: '2025.05.08', times: '10차시' },
    { id: 2, date: '2025.05.01', times: '9차시' },
    { id: 3, date: '2025.04.24', times: '8차시' },
]



export default function BriefDetailPage() {
    const params = useParams()
    const id = Number(params.id)

    const meeting = meetingList.find(m => m.id === id)

    const participants = [
        { name: '정서우', role: '팀장' },
        { name: '장준익', role: '팀원' },
        { name: '유광렬', role: '팀원' },
        { name: '김도영', role: '팀원' },
        { name: '윤동희', role: '팀원' },
        { name: '감보아', role: '팀원' },
    ]

    const [recordingPhase, setRecordingPhase] = useState<'idle' | 'recording'>('idle');
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Web Speech API 초기화 및 음성 인식 처리
    useEffect(() => {
        if (recordingPhase === 'recording') {
            // 브라우저에 따라 SpeechRecognition 생성자 접근
            type SpeechRecognitionConstructor = new () => SpeechRecognition;

            const win = window as typeof window & {
                SpeechRecognition?: SpeechRecognitionConstructor;
                webkitSpeechRecognition?: SpeechRecognitionConstructor;
            };

            const SpeechRecognitionClass =
                win.SpeechRecognition || win.webkitSpeechRecognition;

            if (!SpeechRecognitionClass) {
                alert('이 브라우저는 Web Speech API를 지원하지 않습니다.');
                return;
            }

            const recognition = new SpeechRecognitionClass();
            recognitionRef.current = recognition;

            recognition.lang = 'ko-KR';
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => {
                console.log('🎤 음성 인식 시작');
            };
            recognition.onresult = (event: CustomSpeechRecognitionEvent) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i];
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript + ' ';
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => prev + finalTranscript.trim() + ' ');
                }
            };


            recognition.onerror = (event: Event) => {
                const err = event as SpeechRecognitionErrorEvent;
                console.error('❌ 음성 인식 에러:', err.error, err.message);
            };

            recognition.onend = () => {
                console.log('⏹️ 음성 인식 종료');
            };

            recognition.start();
        }

        return () => {
            recognitionRef.current?.stop();
        };
    }, [recordingPhase]);

    const handleStop = () => {
        recognitionRef.current?.stop();
        setRecordingPhase('idle');
    };


    if (!meeting) return <p className="Brief-Error-Message">회의를 찾을 수 없습니다.</p>

    return (

        <div className="BriefDetail-Container">
            <Header />
            <div className="BriefDetail-Box">
                <div className="BriefDetail-Header">
                    <Image className='BriefDetail-Header-Img' src='/images/BriefDetail.png' alt='BriefDetailImg' width={32.37} height={30} />
                    <p>{meeting.times} 회의</p>
                </div>
                <div className="BriefDetail-Content">
                    <div className="Content-Times-Header">
                        <p className="Brief-Times-Label">{meeting.times} 회의</p>
                        <p className="Brief-Times-Label-Ans">{meeting.date} 진행</p>
                    </div>
                    <div className="Content-Team-Header">
                        <p className="Brief-Team-Label">회의 참가자</p>
                        <p className="Brief-Team-Label-Ans">정서우 장준익 유광렬 (추후 백엔드 연결)</p>
                    </div>
                    <div className="BriefDetail-Content-Entry">
                        <div className="Content-Entry-Title">회의 참가자 관리</div>

                        <div className="Entry-List">
                            {participants.map((user, idx) => (
                                <div className="Entry-Item" key={idx}>
                                    <div className="Entry-Name">
                                        <p className="Entry-Name-Label">{user.name}</p>
                                        <span className={user.role === '팀장' ? 'Role Leader' : 'Role'}>{user.role}</span>
                                    </div>
                                    <Image src="/images/EntryAddButton.png" alt="add" width={24} height={24} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {recordingPhase === 'idle' ? (
                        <div className='BriefDetail-Quick-Record-Box'>
                            <div className='BriefDetail-Record-Header'>
                                <p className='BriefDetail-Record-Header-Text'>회의록</p>
                            </div>
                            <div className='BriefDetail-Record-Voice-Box'>
                                <div className='BriefDetail-Voice-Header'>
                                    <Image className='idle-Voice-Header-Img' src='/images/whitemic.png' alt='MicLogo2' width={24} height={24} />
                                    <p className='idle-Voice-Header-Text'>실시간 음성 기록 및 요약</p>
                                </div>

                                <div className='BriefDetail-Voice-Content'>
                                    <div className='idle-Voice-Content-Timer'>00:00:00</div>
                                    <div className='idle-Voice-Content-StartButton'>
                                        <Image
                                            className='idle-Voice-Button'
                                            src='/images/RecordButton.png'
                                            alt='RecButton'
                                            width={27}
                                            height={27}
                                            onClick={() => setRecordingPhase('recording')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='BriefDetail-Voice-Summary'>
                                <div className='BriefDetail-Voice-Summary-Header'>
                                    <Image
                                        className='Record-Voice-Summary-Header-Img'
                                        src='/images/SummaryIcon.png'
                                        alt='SummaryLogo'
                                        width={16.31}
                                        height={20}
                                    />
                                    <p className='Record-Voice-Summary-Header-Text'>텍스트 회의록 요약</p>
                                </div>
                                <div className='BriefDetail-Voice-Summary-Content'>
                                    <textarea className='Voice-Summary' placeholder='회의록 텍스트를 입력해주세요.'></textarea>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <QuickRecord transcript={transcript} onStop={handleStop} />
                    )}

                </div>
            </div>
            <Footer />
        </div>
    )
}
