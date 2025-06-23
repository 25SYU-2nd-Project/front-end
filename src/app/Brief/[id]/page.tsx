'use client'

import Header from "../../Component/Header"
import Footer from "../../Component/Footer"
import Image from "next/image"
import "../../Styles/BriefDetail.css"


import { useParams } from 'next/navigation'

const meetingList = [
    { id: 1, date: '2025.05.08', times: '10차시' },
    { id: 2, date: '2025.05.01', times: '9차시' },
    { id: 3, date: '2025.04.24', times: '8차시' },
]

export default function BriefDetailPage() {
    const params = useParams()
    const id = Number(params.id)

    const meeting = meetingList.find(m => m.id === id)

    const participants = [
        { name: '정서우', role: '팀장' },
        { name: '장준익', role: '팀원' },
        { name: '유광렬', role: '팀원' },
        { name: '김도영', role: '팀원' },
        { name: '윤동희', role: '팀원' },
        { name: '감보아', role: '팀원' },
    ]


    if (!meeting) return <p className="Brief-Error-Message">회의를 찾을 수 없습니다.</p>

    return (

        <div className="BriefDetail-Container">
            <Header />
            <div className="BriefDetail-Box">
                <div className="BriefDetail-Header">
                    <Image className='BriefDetail-Header-Img' src='/images/BriefDetail.png' alt='BriefDetailImg' width={32.37} height={30} />
                    <p>{meeting.times} 회의</p>
                </div>
                <div className="BriefDetail-Content">
                    <div className="Content-Times-Header">
                        <p className="Brief-Times-Label">{meeting.times} 회의</p>
                        <p className="Brief-Times-Label-Ans">{meeting.date} 진행</p>
                    </div>
                    <div className="Content-Team-Header">
                        <p className="Brief-Team-Label">회의 참가자</p>
                        <p className="Brief-Team-Label-Ans">정서우 장준익 유광렬 (추후 백엔드 연결)</p>
                    </div>
                    <div className="BriefDetail-Content-Entry">
                        <div className="Content-Entry-Title">회의 참가자 관리</div>

                        <div className="Entry-List">
                            {participants.map((user, idx) => (
                                <div className="Entry-Item" key={idx}>
                                    <div className="Entry-Name">
                                        <p className="Entry-Name-Label">{user.name}</p>
                                        <span className={user.role === '팀장' ? 'Role Leader' : 'Role'}>{user.role}</span>
                                    </div>
                                    <Image src="/images/EntryAddButton.png" alt="add" width={24} height={24} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}
