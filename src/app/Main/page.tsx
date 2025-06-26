'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import QuickRecord from '../Component/QuickRecord';
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import '../Styles/main.css';
import Image from 'next/image';

export default function MainPage() {
  const router = useRouter();

  const sliderRef   = useRef<HTMLDivElement>(null);
  const isDragging  = useRef(false);
  const startX      = useRef(0);
  const scrollLeft  = useRef(0);

  const [recordingPhase, setRecordingPhase] = useState<'idle' | 'recording'>('idle');

  const teamList = [
    { name: '두유즈',       schedule: '5/8 (목) 21:00' },
    { name: '못난이사자들2', schedule: '5/9 (목) 22:00' },
    { name: '아이디어팟',    schedule: '5/11 (토) 20:00' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    if (sliderRef.current) {
      sliderRef.current.classList.add('dragging');
      startX.current = e.pageX - sliderRef.current.offsetLeft;
      scrollLeft.current = sliderRef.current.scrollLeft;
    }
  };

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
          <Image className="MyTeam-Search" src="/images/search.png" alt="SearchImg" width={24} height={24} />
        </div>

        <div className="MyTeam-Content">
          <div
            className="MyTeam-Slider"
            ref={sliderRef}
            onMouseDown={handleMouseDown}
          >
            {teamList.map((team, idx) => (
              <div key={idx} className="Team-Card">
                <div className="Team-Name">{team.name}</div>
                <div className="Team-Schedule">다음 회의 일정</div>
                <div className="Team-Date">{team.schedule}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
              <textarea className="Voice-Summary" placeholder="회의록 텍스트를 입력해주세요." />
            </div>
          </div>
        </div>
      ) : (
        <QuickRecord onStop={() => setRecordingPhase('idle')} />
      )}

      <Footer />
    </div>
  );
}
