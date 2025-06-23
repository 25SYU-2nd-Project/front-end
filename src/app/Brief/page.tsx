'use client'

import { useRouter } from 'next/navigation'
import Header from "../Component/Header"
import Footer from "../Component/Footer"
import Image from "next/image"
import '../Styles/brief.css'

const meetingList = [
  { id: 1, date: '2025.05.08', times: '10차시', brief: '기록된 회의 내용이 없습니다.' },
  { id: 2, date: '2025.05.01', times: '9차시', brief: "2분기 신제품 'NX-02'의 개발 ..." },
  { id: 3, date: '2025.04.24', times: '8차시', brief: '회의내용회의내용회의내용회의...' },
]

export default function BriefPage() {
  // 라우팅 설정 -> 회의 상세 페이지 
  const router = useRouter()

  return (
    <div className="Brief-Main-Container">
      <Header />
      <div className="Brief-Box">
        <div className="Brief-Header">
          <Image className='Brief-Header-Img' src='/images/BriefList.png' alt='ListImg' width={32.37} height={30} />
          <p>회의록 목록</p>
        </div>

        <div className="Brief-Category">
          <p className="Brief-Category-Date">Date</p>
          <p className="Brief-Category-Times">Times</p>
          <p className="Brief-Category-Brief">Brief</p>
        </div>

        <div className="Brief-Main-Content">
          <div className="Brief-List-Wrapper">
            {meetingList.map((item) => (
              <div
                key={item.id}
                className="Brief-Item"
                onClick={() => router.push(`/brief/${item.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <p className="Brief-Date">{item.date}</p>
                <p className="Brief-Times">{item.times}</p>
                <p className="Brief-Brief">{item.brief}</p>
                <Image src="/images/arrow.png" alt="arrow" width={5.4} height={9.42} />
              </div>
            ))}
          </div>
          <Image src="/images/AddButton.png" alt="AddButton" width={28} height={28} className="Brief-AddButton" />
        </div>
      </div>
      <Footer />
    </div>
  )
}
