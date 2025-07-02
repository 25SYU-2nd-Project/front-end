'use client';
import Image from 'next/image'

import { useState } from 'react';
import api from '../api';
import '../Styles/TeamCreateModal.css'

interface TeamCreateModalProps {
    /** 모달 닫기 */
    onClose: () => void;
    /** 팀 생성 성공 시 실행(팀 리스트 갱신용) */
    onSuccess: () => void;
}

export default function TeamCreateModal({ onClose, onSuccess }: TeamCreateModalProps) {
    const [teamName, setTeamName] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateTeam = async () => {
        setMessage('');

        if (!teamName.trim()) {
            setMessage('팀 이름을 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            setMessage('로그인이 필요합니다.');
            return;
        }

        try {
            await api.post(
                '/teams/create',
                { teamName },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // setMessage('팀이 성공적으로 생성되었습니다!');
            onSuccess();          // 팀 목록 재조회
            setTimeout(onClose, 700); // 0.7초 후 모달 닫기
        } catch (error: any) {
            const errMsg = error?.response?.data?.message || '팀 생성 과정에서 오류가 생겼습니다.';
            setMessage(errMsg);
        }
    };

    return (
        <>
            {/* 오버레이 */}
            <div className="Modal-Overlay" onClick={onClose} />

            {/* 모달 창 */}
            <div className="Modal-Container">
                <div className="Team-Create-Modal-Header">
                    <div className="Team-Create-Modal-Header-Left">
                        <Image src="/images/userImg.png" alt="logo" width={24} height={24} />
                        <p className="Modal-Header-Text">마이 팀 - 팀 생성</p>
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
                    className="Team-Create-Modal-Input"
                    placeholder="생성할 팀 명을 기입해주세요."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                />
                <div className='Modal-Error-Box'>
                    {message && <p className="Modal-Error-Message">{message}</p>}
                </div>
                <div
                    className="Team-Create-Modal-Button"
                    onClick={handleCreateTeam}
                    style={{ cursor: 'pointer' }}
                >
                    <p>생성</p>
                </div>

            </div>
        </>
    );
}
