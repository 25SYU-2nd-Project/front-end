'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import api from '../api'
import '../Styles/MeetingCreateModal.css' // 기존 모달 스타일 그대로 사용

interface MeetingCreateModalProps {
  teamId: number
  onClose: () => void
  onSuccess: () => void
}

interface User {
  id: number
  name: string
}

export default function MeetingCreateModal({ teamId, onClose, onSuccess }: MeetingCreateModalProps) {
  const [sessionNumber, setSessionNumber] = useState<number>(1)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [attendees, setAttendees] = useState<number[]>([])
  const [content, setContent] = useState('')
  const [message, setMessage] = useState('')
  const [userList, setUserList] = useState<User[]>([])

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  useEffect(() => {
    if (!token) return
    api.get(`/teams/${teamId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setUserList(res.data))
      .catch(() => setUserList([]))
  }, [teamId])

  const handleSubmit = async () => {
    if (!sessionNumber || !date || !time ||  !content.trim()) {
      setMessage('모든 항목을 입력해주세요.')
      return
    }

    try {
      await api.post(`/meetings/${teamId}/create`, {
        sessionNumber,
        date,
        time,
        attendeeUserIds: attendees,
        content,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      onSuccess()
      setTimeout(onClose, 700)
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || '회의 생성에 실패했습니다.'
      setMessage(errMsg)
    }
  }

  const toggleAttendee = (id: number) => {
    setAttendees(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    )
  }

  return (
    <>
      <div className="Meeting-Modal-Overlay" onClick={onClose} />
      <div className="Meeting-Modal-Container">
        <div className="Meeting-Modal-Header">
          <div className="Meeting-Modal-Header-Left">
            <Image src="/images/BriefDetailBlack.png" alt="logo" width={24} height={24} />
            <p className="Meeting-Modal-Header-Text">회의록 생성</p>
          </div>
          <Image
            src="/images/close.png"
            alt="닫기"
            width={20}
            height={20}
            onClick={onClose}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <input
          className="Meeting-Modal-Input"
          type="number"
          placeholder="회의 회차 (예: 11)"
          value={sessionNumber}
          onChange={(e) => setSessionNumber(Number(e.target.value))}
        />
        <input
          className="Meeting-Modal-Input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          className="Meeting-Modal-Input"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <textarea
          className="Meeting-Modal-Input"
          placeholder="회의 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ height: '80px' }}
        />

        <div className='Meeting-Modal-Error-Box'>
          {message && <p className="Meeting-Modal-Error-Message">{message}</p>}
        </div>

        <div className="Meeting-Modal-Submit" onClick={handleSubmit} style={{ cursor: 'pointer' } }>
          <p>생성</p>
        </div>
      </div>
    </>
  )
}
