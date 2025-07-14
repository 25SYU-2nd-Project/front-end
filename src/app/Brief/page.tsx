'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from "../Component/Header"
import Footer from "../Component/Footer"
import Image from "next/image"
import '../Styles/brief.css'

import api from '../api'
import MeetingCreateModal from '../Component/MeetingCreateModal'

interface Meeting {
  id: number
  sessionNumber: number
  meetingDate: string
  meetingTime: string
  content: string
  attendees: string[]
}

export default function BriefPage() {
  const router = useRouter()
  // const [teamId, setTeamId] = useState<number | null>(null)
  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const [showModal, setShowModal] = useState(false)
  const searchParams = useSearchParams();
  const teamIdParam = searchParams.get('teamId');
  const teamId = teamIdParam ? parseInt(teamIdParam, 10) : null;



  // 회의 목록 불러오기
  const fetchMeetings = async () => {
    if (!teamId) return

    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    try {
      const res = await api.get(`/meetings/list/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMeetingList(res.data)
    } catch (err) {
      console.error('회의 목록 불러오기 실패', err)
    }
  }

  // 팀 ID 설정되면 회의 목록 가져오기
  useEffect(() => {
    if (teamId) fetchMeetings()
  }, [teamId])

  const handleSuccess = () => {
    fetchMeetings()
  }

  return (
    <div className="Brief-Main-Container">
      <Header />
      <div className="Brief-Box">
        <div className="Brief-Header">
          <Image className='Brief-Header-Img' src='/images/BriefList.png' alt='ListImg' width={32.37} height={30} />
          <p className='Brief-Header-Text'>회의록 목록</p>
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
                <p className="Brief-Date">{item.meetingDate}</p>
                <p className="Brief-Times">{item.sessionNumber}차시</p>
                <p className="Brief-Brief">
                  {item.content.length > 20
                    ? item.content.slice(0, 20) + '...'
                    : item.content}
                </p>
                <Image src="/images/arrow.png" alt="arrow" width={5.4} height={9.42} />
              </div>
            ))}
          </div>

          <Image
            src="/images/AddButton.png"
            alt="AddButton"
            width={28}
            height={28}
            className="Brief-AddButton"
            onClick={() => setShowModal(true)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
      <Footer />

      {showModal && teamId && (
        <MeetingCreateModal
          teamId={teamId}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  )
}
