'use client'
import '../Styles/QuickRecord.css'
import Image from 'next/image'
// import Gemeni from '../../../public/images/Gemini.png'
// import Pause from '../../../public/images/QuickRecordPause.png'
// import Play from '../../../public/images/QuickRecordPlay.png'

export default function QuickRecord() {
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
          <div className='Recording-Voice-Content-Timer'>00:00:00</div>
          <div className='Recording-Voice-Content-ButtonBox'>
            <Image
              className='Recording-Play-Button'
              src="/images/QuickRecordPlay.png"
              alt="PlayButton"
              width={30}
              height={30}
            />
            <Image
              className='Recording-Gemini-Button'
              src="/images/Gemini.png"
              alt="GemButton"
              width={27}
              height={27}
            />
            <Image
              className='Recording-Pause-Button'
              src="/images/QuickRecordPause.png"
              alt="PauseButton"
              width={30}
              height={30}
            />
          </div>
          <div className='Recording-Gemini-Summary'>
              회의 요약
          </div>
          <div className='Recording-Gemini-Save'>
              <p className='Save-Label'>요약본 클립보드에 저장</p>
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

  )
}