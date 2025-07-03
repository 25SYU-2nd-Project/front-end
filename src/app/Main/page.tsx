'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import QuickRecord from '../Component/QuickRecord';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import '../Styles/main.css';
import Image from 'next/image';
import Link from 'next/link';
import api from '../api';
import TeamSearchModal from '../Component/TeamSearchModal';


/** 백엔드 응답 타입 */
interface Team {
  id: number;
  teamName: string;
}

export default function MainPage() {
  const router = useRouter();

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const [recordingPhase, setRecordingPhase] = useState<'idle' | 'recording' | 'done'>('idle');

  const [teamList, setTeamList] = useState<Team[]>([]);
  const [loading, setLoading]   = useState(true); 

    // 팀 검색 모달
  const [showSearchModal, setShowSearchModal] =useState(false);
  const handleSearchModal = () => setShowSearchModal(true);
  

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

  const handleCreateTeam = () => {
    router.push('/teamCreate');
  };

  useEffect(() => {
  const fetchTeams = async () => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {                         // 미로그인 처리
      console.warn('토큰이 없습니다.');
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get<Team[]>('/teams/my-teams', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // id 오름차순 정렬
      const sorted = data.sort((a, b) => a.id - b.id);
      setTeamList(sorted);
    } catch (err) {
      console.error('팀 조회 실패', err);
    } finally {
      setLoading(false);
    }
  };

  fetchTeams();
}, []);


  return (
    <div className="Main-Container">
      <Header />

      {/* 팀 카드 영역 */}
      <div className="MyTeam-Box">
        <div className="MyTeam-Header">
          <div className="MyTeam-Header-Left">
            <Image className="MyTeam-Logo" src="/images/userImg.png" alt="MyteamLogo" width={24} height={24} />
            <p className="MyTeam-Header-Text">마이 팀</p>
          </div>
          <Image
            className="MyTeam-Search"
            src="/images/search.png"
            alt="SearchImg"
            width={24}
            height={24}
            onClick={() => setShowSearchModal(true)}
          />
        </div>

        <div className="MyTeam-Content">
<div
  className="MyTeam-Slider"
  ref={sliderRef}
  onMouseDown={handleMouseDown}
>
  {/* 새 팀 카드 */}
  <div
    className="Team-Card-New-Team-Card"
    onClick={handleCreateTeam}
  >
    <Image
      className="TeamAddButton"
      src="/images/TeamAddButton.png"
      alt="teamAdd"
      width={50}
      height={50}
    />
  </div>

  {/* 로딩 상태 처리 (선택) */}
  {loading && <p style={{ padding: '20px' }}>로딩 중…</p>}

  {/* 실제 팀 카드 */}
  {teamList.map((team) => (
    <div key={team.id} className="Team-Card">
      <div className="Team-Name">{team.teamName}</div>

      {/* 일정 정보가 아직 없으므로 임시 표기 */}
      <div className="Team-Schedule">다음 회의 일정</div>
      <div className="Team-Date">미정</div>
    </div>
  ))}
</div>

        </div>
      </div>

      {/* 팀 검색 모달 */}
      {showSearchModal && (
        <TeamSearchModal
          onClose={() => setShowSearchModal(false)}
        />
      )}

      {/* 녹음 / 요약 영역 */}
      {recordingPhase === 'idle' ? (
        <div className="idle-Quick-Record-Box">
          <div className="idle-Record-Header">
            <Image className="idle-Record-Header-Img" src="/images/blackmic.png" alt="MicLogo" width={24} height={24} />
            <p className="idle-Record-Header-Text">빠른 녹음 및 요약</p>
          </div>

          <div className="idle-Record-Voice-Box">
            <div className="idle-Voice-Header">
              <Image className="idle-Voice-Header-Img" src="/images/whitemic.png" alt="MicLogo2" width={24} height={24} />
              <p className="idle-Voice-Header-Text">실시간 음성 기록 및 요약</p>
            </div>

            <div className="idle-Voice-Content">
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

          {/* 요약 입력 영역 */}
          <div className="Record-Voice-Summary">
            <div className="Record-Voice-Summary-Header">
              <Image className="Record-Voice-Summary-Header-Img" src="/images/SummaryIcon.png" alt="SummaryLogo" width={16.31} height={20} />
              <p className="Record-Voice-Summary-Header-Text">텍스트 회의록 요약</p>
            </div>
            <div className="Record-Voice-Summary-Content">
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

      <Footer />
    </div>
  );
}
