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
  const [showQuickRecord, setShowQuickRecord] = useState(false)

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
      <div className='Quick-Record-Box'>
        <div className='Quick-Record-Header'>
          <Image className='Quick-Record-Header-Img' src="/images/blackmic.png" alt="MicLogo" width={24} height={24} />
          <p className='Quick-Record-Header-Text'>빠른 녹음 및 요약</p>
        </div>
        <div className='Record-Voice-Box'>
          <div className='Record-Voice-Header'>
            <Image className='Record-Voice-Header-Img' src="/images/whitemic.png" alt="MicLogo2" width={24} height={24} />
            <p className='Record-Voice-Header-Text'>실시간 음성 기록 및 요약</p>
          </div>
          <div className='Record-Voice-Content'>
            <div className='Record-Voice-Content-Timer'>
              00:00:00
            </div>
            <div className='Record-Voice-Content-StartButton'>
              <Image
                className='Record-Voice-Button'
                src="/images/RecordButton.png"
                alt="RecButton"
                width={27}
                height={27}
                onClick={() => setShowQuickRecord(true)}
              />
            </div>
              {showQuickRecord && <QuickRecord />}
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
