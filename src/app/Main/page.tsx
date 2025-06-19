'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import QuickRecord from '../Component/QuickRecord'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import '../Styles/main.css'
import Image from 'next/image'

export default function MainPage() {
  const router = useRouter()

  // Idle(기본) - Recording(녹음 시작 및 요약 컴포넌트) 전환 
  const [recordingPhase, setRecordingPhase] = useState<'idle' | 'recording'>('idle');



  return (
    <div className='Main-Container'>
      <Header />
      <div className='MyTeam-Box'>
        <div className='MyTeam-Header'>
          <div className='MyTeam-Header-Left'>
            <Image className='MyTeam-Logo' src="/images/userImg.png" alt="MyteamLogo" width={24} height={24} />
            <p className='MyTeam-Header-Text'>마이 팀</p>
          </div>
          <Image className='MyTeam-Search' src="/images/search.png" alt="SearchImg" width={24} height={24} />
        </div>
        <div className='MyTeam-Content'>
          <div className='MyTeam-List'>
          </div>
          <button onClick={() => router.push('/team')} style={{ marginBottom: '1rem' }}>
            팀 페이지로 이동
          </button>
        </div>
      </div>
      {recordingPhase === 'idle' ? (
        <div className='idle-Quick-Record-Box'>
          <div className='idle-Record-Header'>
            <Image className='idle-Record-Header-Img' src="/images/blackmic.png" alt="MicLogo" width={24} height={24} />
            <p className='idle-Record-Header-Text'>빠른 녹음 및 요약</p>
          </div>

          <div className='idle-Record-Voice-Box'>
            <div className='idle-Voice-Header'>
              <Image className='idle-Voice-Header-Img' src="/images/whitemic.png" alt="MicLogo2" width={24} height={24} />
              <p className='idle-Voice-Header-Text'>실시간 음성 기록 및 요약</p>
            </div>

            <div className='idle-Voice-Content'>
              <div className='idle-Voice-Content-Timer'>00:00:00</div>
              <div className='idle-Voice-Content-StartButton'>
                <Image
                  className='idle-Voice-Button'
                  src="/images/RecordButton.png"
                  alt="RecButton"
                  width={27}
                  height={27}
                  onClick={() => setRecordingPhase('recording')}
                />
              </div>
            </div>
          </div>
          <div className='Record-Voice-Summary'>
            <div className='Record-Voice-Summary-Header'>
              <Image className='Record-Voice-Summary-Header-Img' src="/images/SummaryIcon.png" alt="SummaryLogo" width={16.31} height={20} />
              <p className='Record-Voice-Summary-Header-Text'>텍스트 회의록 요약</p>
            </div>
            <div className='Record-Voice-Summary-Content'>
              <textarea className='Voice-Summary' placeholder='회의록 텍스트를 입력해주세요.'></textarea>
            </div>
          </div>
        </div>
      ) : (
        <QuickRecord />
      )}






      <Footer />
    </div>
  )
}
