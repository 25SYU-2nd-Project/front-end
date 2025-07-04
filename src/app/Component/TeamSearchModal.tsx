'use client';
import Image from 'next/image'
import { useState } from 'react';
import api from '../api';
import '../Styles/TeamSearchModal.css'

interface TeamSearchModalProps {
    // 모달 닫기
    onClose: () => void;
}

interface Team {
  id: number;
  teamName: string;
}

export default function TeamSearchModal({ onClose }: TeamSearchModalProps) {
  const [searchTeam, setSearchTeam] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 팀 이름 검색
  const handleSearchTeam = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    if (!searchTeam.trim())  {
        setError('검색어를 입력하세요.');
        setLoading(false);
        return;
    }

    try {
      const response = await api.get(`/teams/search?name=${searchTeam}`);
      setTeams(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '검색 실패');
    } finally {
      setLoading(false);
    }
  };
  
  // 팀 가입 신청
  const handleRequestTeam = async (teamId: number) => {
    setError('');
    setMessage('');

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        setError('로그인이 필요합니다.');
        return;
    }

    try {
      const response = await api.post(`/teams/${teamId}/request`);
      setMessage(response.data || '가입 신청이 완료되었습니다.');
    } catch (err: any) {
      setError(err.response?.data?.message || '이미 신청한 팀이거나 속한 팀입니다.');
    }
  };

    return (
        <>
            {/* 오버레이 */}
            <div className="Modal-Overlay" onClick={onClose} />

            {/* 모달 창 */}
            <div className="Modal-Container">
                <div className="Team-Search-Modal-Header">
                    <div className="Team-Search-Modal-Header-Left">
                        <Image src="/images/userImg.png" alt="logo" width={24} height={24} />
                        <p className="Modal-Header-Text">마이 팀 - 팀 찾기</p>
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
                <div className="Team-Search-Modal-Input-Box">
                    <Image
                        src="/images/search.png"
                        alt="검색"
                        width={28}
                        height={28}
                        onClick={handleSearchTeam}
                        style={{ cursor: 'pointer' }}
                    />
                    <input
                        className="Team-Search-Modal-Input"
                        placeholder="가입 신청 팀 명을 기입해주세요."
                        value={searchTeam}
                        onChange={(e) => setSearchTeam(e.target.value)}
                    />
                </div>
                <div className='Modal-Error-Box'>
                    {loading && <p className="Modal-Loading-Message">검색 중...</p>}
                    {message && <p className="Modal-Success-Message">{message}</p>}
                    {error && <p className="Modal-Error-Message">{error}</p>}
                </div>
                <div className="Team-Search-Modal-Teamlist">
                     {teams.map((team) => (
                  <div key={team.id} className="Team-Search-Modal-Teamlist-Block">
                    <div className='Team-Search-Modal-Teamlist-Content'>
                        <div className='Team-Search-Modal-Teamlist-Name'>{team.teamName}</div>
                        <Image
                            src="/images/EntryAddButton.png"
                            alt="팀신청"
                            width={28}
                            height={28}
                            onClick={() => handleRequestTeam(team.id)}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    <div className='Team-Search-Modal-Teamlist-Line' />
                  </div>
                     ))}
                </div>

            </div>
        </>
    );
}