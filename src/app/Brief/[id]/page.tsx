'use client'

import Header from "../../Component/Header"
import Footer from "../../Component/Footer"
import QuickRecord from "@/app/Component/QuickRecord"
import Image from "next/image"
import "../../Styles/BriefDetail.css"
import "../../Styles/main.css"
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import api from '../../api';

interface Attendee {
    id: number;
    userId: number;
    userName: string;
    status: string;
    leader: boolean;
}

interface Meeting {
    id: number;
    sessionNumber: number;
    meetingDate: string;
    meetingTime: string;
    content: string;
}

export default function BriefDetailPage() {
    const params = useParams();
    const id = Number(params.id);

    const [participants, setParticipants] = useState<Attendee[]>([]);
    const [meeting, setMeeting] = useState<Meeting | null>(null);
    const [error, setError] = useState('');
    //   const [leaderId, setLeaderId] = useState<string>('');
    // const [leaderId, setLeaderId] = useState<string>('');

    // const fetchLeader = async (teamId: number) => {
    //     const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    //     try {
    //         const res = await api.get(`/teams/${teamId}/leader`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         console.log('팀장 loginId:', res.data);
    //         setLeaderId(res.data); // leader의 userId
    //     } catch (err) {
    //         console.error('팀장 정보 조회 실패:', err);
    //     }
    // };

    const fetchAttendees = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        try {
            const res = await api.get(`/meetings/${id}/attendees`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setParticipants(res.data);
        } catch (err) {
            console.error('참석자 목록 조회 실패:', err);
            setError('참석자 정보를 불러오는 데 실패했습니다.');
        }
    };

    const fetchMeetingDetail = async () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        try {
            const res = await api.get(`/meetings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMeeting(res.data);

            // const teamId = res.data.teamId; //  이게 응답에 있어야 함
            // if (teamId) {
            //     fetchLeader(teamId); // 팀장 정보 요청
            // }
        } catch (err) {
            console.error('회의 정보 조회 실패:', err);
        }
    };


    useEffect(() => {
        if (id) {
            fetchMeetingDetail();
            fetchAttendees();
        }
    }, [id]);

    useEffect(() => {
        console.log('🧾 참석자 전체:', participants);
    }, [participants]);

    const router = useRouter();
    const sliderRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const [recordingPhase, setRecordingPhase] = useState<'idle' | 'recording' | 'done'>('idle');

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        if (sliderRef.current) {
            sliderRef.current.classList.add('dragging');
            startX.current = e.pageX - sliderRef.current.offsetLeft;
            scrollLeft.current = sliderRef.current.scrollLeft;
        }
    };

    const handleDoneClipboardCopy = () => {
        setRecordingPhase('idle');
    };

    if (!meeting) {
        return <p className="Brief-Error-Message">회의를 찾을 수 없습니다.</p>;
    }

    return (
        <div className="BriefDetail-Container">
            <Header />
            <div className="BriefDetail-Box">
                <div className="BriefDetail-Header">
                    <Image className='BriefDetail-Header-Img' src='/images/BriefDetail.png' alt='BriefDetailImg' width={32.37} height={30} />
                    <p>{meeting.sessionNumber}차시 회의</p>
                </div>
                <div className="BriefDetail-Content">
                    <div className="Content-Times-Header">
                        <p className="Brief-Times-Label">{meeting.sessionNumber}차시 회의</p>
                        <p className="Brief-Times-Label-Ans">{meeting.meetingDate} 진행</p>
                    </div>

                    <div className="Content-Team-Header">
                        <p className="Brief-Team-Label">회의 참가자</p>
                        <p className="Brief-Team-Label-Ans">
                            {participants.map(p => p.userName).join(' ')}
                        </p>
                    </div>

                    <div className="BriefDetail-Content-Entry">
                        <div className="Content-Entry-Title">회의 참가자 관리</div>
                        <div className="Entry-List">
                            {participants.map((user, idx) => (
                                <div className="Entry-Item" key={idx}>
                                    <div className="Entry-Name">
                                        <p className="Entry-Name-Label">{user.userName}</p>
                                        <span className={user.leader ? 'Role Leader' : 'Role'}>
                                            {user.leader ? '팀장' : '팀원'}
                                        </span>
                                    </div>
                                </div>
                            ))}



                        </div>
                    </div>

                    {/* 녹음/요약 영역 */}
                    {recordingPhase === 'idle' ? (
                        <div className="BriefDetail-Quick-Record-Box">
                            <div className="BriefDetail-Record-Header">
                                <p className="BriefDetail-Record-Header-Text">회의록</p>
                            </div>

                            <div className="BriefDetail-Record-Voice-Box">
                                <div className="BriefDetail-Voice-Header">
                                    <Image className="idle-Voice-Header-Img" src="/images/whitemic.png" alt="MicLogo2" width={24} height={24} />
                                    <p className="idle-Voice-Header-Text">실시간 음성 기록 및 요약</p>
                                </div>

                                <div className="BriefDetail-Voice-Content">
                                    <div className="idle-Voice-Content-Timer">00:00:00</div>
                                    <div className="idle-Voice-Content-StartButton">
                                        <Image
                                            className="idle-Voice-Button"
                                            src="/images/RecordButton.png"
                                            alt="RecButton"
                                            width={27}
                                            height={27}
                                            onClick={() => setRecordingPhase('recording')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="BriefDetail-Voice-Summary">
                                <div className="BriefDetail-Voice-Summary-Header">
                                    <Image className="Record-Voice-Summary-Header-Img" src="/images/SummaryIcon.png" alt="SummaryLogo" width={16.31} height={20} />
                                    <p className="Record-Voice-Summary-Header-Text">텍스트 회의록 요약</p>
                                </div>
                                <div className="BriefDetail-Voice-Summary-Content">
                                    <textarea
                                        id="manual-summary"
                                        className="Voice-Summary"
                                        placeholder="회의록 텍스트를 입력해주세요."
                                    />
                                </div>
                            </div>
                            <div className="Record-Voice-Summary-Clipboard">
                                <p
                                    className="Save-Label"
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
                    ) : (
                        <QuickRecord
                            onStop={() => setRecordingPhase('done')}
                            onCopyComplete={handleDoneClipboardCopy}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
