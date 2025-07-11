'use client'
import '../Styles/Signup.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Image from 'next/image'
import api from '../api';

export default function Signup() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [confirmUserPw, setConfirmUserPw] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!userId || !userPw || !confirmUserPw || !userName) {
      setError('모든 항목을 입력해주세요.');
      return;
    }
    if (userPw !== confirmUserPw) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await api.post('/users/join', {
        userId,
        userPw,
        userName,
      });
      alert('회원가입이 완료되었습니다.')
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패하였습니다.');
    }
  }

  return (
    <>
      <div className='signup-container'>
      <header className="signup-header">
        <div className="signup-logo">
          <Image className='signup-logo-image' src="/images/logo.png" alt="usersImg" width={75} height={85} />
          <span className="signup-logo-title">Brief-</span>
          <span className="signup-logo-title-yellow">Log</span>
        </div>
      </header>

      <div className='signup-body'>
        <div className='signup-box'>
          <h1 className='signup-title'>회원가입</h1>
          <form onSubmit={handleSignup} className='signup'>
            <input 
              type='text'
              className='signup-input'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder='아이디/이메일'
              required>
            </input>
            <input
              type='password'
              className='signup-input'
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              placeholder='비밀번호'
              required>
            </input>
            <input
              type='password'
              className='signup-input'
              value={confirmUserPw}
              onChange={(e) => setConfirmUserPw(e.target.value)}
              placeholder='비밀번호 재확인'
              required>
            </input>
            <input 
              type='text'
              className='signup-input'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder='이름'
              required>
            </input>
            <button type='submit' className='signup-btn'>회원가입</button>
            {error && <div className='signup-error'>{error}</div>}
          </form>
        </div>
      </div>
      </div>
    </>
  );
};