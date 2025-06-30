'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../api'; // api.ts 경로에 맞게 조정

export default function TeamCreatePage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateTeam = async () => {
    setMessage('');

    if (!teamName.trim()) {
      setMessage('팀 이름을 입력해주세요.');
      return;
    }

    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await api.post(
        '/teams/create',
        { teamName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(' 팀이 성공적으로 생성되었습니다!');
      setTimeout(() => router.push('/main'), 1000); // 홈으로 이동
    } catch (error: any) {
      const errMsg = error?.response?.data?.message || '팀 생성에 실패했습니다.';
      setMessage(errMsg);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '360px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>팀 생성</h2>
      <input
        type="text"
        placeholder="팀 이름을 입력하세요"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          marginBottom: '12px',
        }}
      />
      <button
        onClick={handleCreateTeam}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#2c73f5',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        팀 생성하기
      </button>
      {message && (
        <p style={{ marginTop: '12px', color: '#333' }}>{message}</p>
      )}
    </div>
  );
}
