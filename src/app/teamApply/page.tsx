'use client';
import { useState } from 'react';
import api from '../api';

interface Team {
  id: number;
  teamName: string;
}

export default function TeamApply() {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 팀 검색
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const response = await api.get(`/teams/search?name=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTeams(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || '검색 실패');
    } finally {
      setLoading(false);
    }
  };
  
  // 가입 신청
  const handleRequestJoin = async (teamId: number) => {
    setError('');
    setMessage('');
    try {
      const response = await api.post(
        `/teams/${teamId}/request`,
        {}, // POST body는 없음
        
      );
      setMessage(response.data || '가입 신청 완료! 대기 중입니다.');
    } catch (err: any) {
      setError(err.response?.data?.message || '신청 실패');
    }
  };

return(
  <div>
    <h2>팀 검색</h2>
      <input
        type="text"
        value={searchTerm}
        placeholder="팀 이름을 입력하세요"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>

      {loading && <p>검색 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <ul>
       {teams.map((team) => (
          <li key={team.id} style={{ marginTop: '10px' }}>
            {team.teamName}
            <button onClick={() => handleRequestJoin(team.id)} style={{ marginLeft: '10px' }}>
              가입 신청
            </button>
          </li>
        ))}
      </ul>
  </div>
);}