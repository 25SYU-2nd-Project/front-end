'use client';

import Header from "../../Component/Header";
import Footer from "../../Component/Footer";
import QuickRecord from "@/app/Component/QuickRecord";
import Image from "next/image";
import "../../Styles/BriefDetail.css";
import "../../Styles/main.css";
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
const router = useRouter();
const id = Number(params.id);

const [participants, setParticipants] = useState<Attendee[]>([]);
const [meeting, setMeeting] = useState<Meeting | null>(null);
const [recordingPhase, setRecordingPhase] = useState<'idle' | 'recording' | 'done'>('idle');

const [myId, setMyId] = useState<number | null>(null);
const [error, setError] = useState('');

const [userName, setUserName] = useState('');
const [isLeader, setIsLeader] = useState(false);

// 사용자 이름만 추출
// const fetchMyName = async () => {
//   const token = localStorage.getItem('token') || sessionStorage.getItem('token');
//   if (!token) return;
//   try {
//     const res = await api.get('/users/me'); // "현재 로그인한 사용자: saka"
//     const name = res.data.split(':')[1]?.trim();
//     setUserName(name);
//     console.log('[디버깅] 내 이름:', name);
//   } catch (err) {
//     console.error('유저 이름 조회 실패:', err);
//   }
// };

// 참가자 목록에서 내 이름으로 팀장 여부 파악
useEffect(() => {
  if (!userName || participants.length === 0) return;

  const me = participants.find(p => p.userName === userName);
  if (me) {
    setIsLeader(!!me.leader);
    console.log('[디버깅] 내 정보:', me);
    console.log('[디버깅] isLeader:', me.leader);
  } else {
    console.warn('참가자 목록에서 내 정보를 찾을 수 없습니다.');
  }
}, [participants, userName]);


// ✅ 회의 정보 가져오기
const fetchMeetingDetail = async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;
  try {
    const res = await api.get(`/meetings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMeeting(res.data);
    console.log('[디버깅] 회의 정보:', res.data);
  } catch (err) {
    console.error('회의 정보 조회 실패:', err);
  }
};

// ✅ 참가자 목록 가져오기
const fetchAttendees = async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (!token) return;
  try {
    const res = await api.get(`/meetings/${id}/attendees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setParticipants(res.data);
    console.log('[디버깅] 참석자 목록:', res.data);
  } catch (err) {
    console.error('참석자 목록 조회 실패:', err);
    setError('참석자 정보를 불러오는 데 실패했습니다.');
  }
};

const getNextStatus = (current: string) => {
  switch (current) {
    case 'ABSENT':
      return 'PRESENT';
    case 'PRESENT':
      return 'LATE';
    case 'LATE':
      return 'ABSENT';
    default:
      return 'ABSENT';
  }
};



//  초기 로딩
useEffect(() => {
  const init = async () => {
    // await fetchMyName();
    await fetchMeetingDetail();
    await fetchAttendees();
  };

  if (id) init();
}, [id]);





// ✅ 출석 상태 변경
const handleStatusChange = async (userId: number, currentStatus: string) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const nextStatus = getNextStatus(currentStatus);

  try {
    await api.put(`/meetings/${id}/attendees/${userId}/status`, {
      status: nextStatus,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    await fetchAttendees(); // 목록 최신화
  } catch (err) {
    console.error('출석 상태 변경 실패:', err);
    alert('출석 상태 변경에 실패했습니다.');
  }
};


// ✅ 요약 완료 후 초기화
const handleDoneClipboardCopy = () => {
  setRecordingPhase('idle');
};

// ✅ 회의 정보 없을 때 처리
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
                        <div className="Brief-Team-Label-Ans">
                            {participants
                                .filter((p) => p.status === 'PRESENT')
                                .map((p, idx) => (
                                    <span key={idx} className="Team-Member-Name">
                                        {p.userName}
                                    </span>
                                ))}
                        </div>
                    </div>
                    <div className="BriefDetail-Content-Entry">
                        <div className="Content-Entry-Title">회의 참가자 관리</div>
                        <div className="Entry-List">
                            {participants.map((user, idx) => (
                                <div className="Entry-Item" key={idx}>
                                    <div className="Entry-NameBox">
                                        <p className="Entry-Name-Label">{user.userName}</p>
                                        <span className={user.leader ? 'Role Leader' : 'Role'}>
                                            {user.leader ? '팀장' : '팀원'}
                                        </span>
                                    </div>
                                        <button className="Entry-AddBtn" onClick={() => handleStatusChange(user.userId, user.status)}>
                                            <img src="/images/EntryAddButton.png" alt="추가" />
                                        </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {recordingPhase === 'idle' ? (
                        <div className="BriefDetail-Quick-Record-Box">
                            <div className="BriefDetail-Record-Header">
                                <p className="BriefDetail-Record-Header-Text">회의록</p>
                            </div>
                            <div className="BriefDetail-Voice-Box">
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
