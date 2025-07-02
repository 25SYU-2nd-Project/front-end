'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import './Styles/Login.css';
import api from './api';

export default function Login() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [userPw, setUserPw] = useState('');
  const [error, setError] = useState('');

  const [keepLogin, setKeepLogin] = useState(false); 

  // 로그인 상태 유지
  const handleKeepLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeepLogin(e.target.checked);
  };

  // 로그인 함수
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    if (!userId || !userPw ) {
      setError('아이디/이메일 또는 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/users/login',{
        userId,
        userPw,
      });
      const token = response.data.token;

      if (keepLogin) {
        localStorage.setItem('token', token); // 로그인 상태 유지 버튼 체크 시

      } else {
        sessionStorage.setItem('token', token);
      }
      
      const res = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
console.log('내 정보 응답:', res.data);
      window.location.replace('/main');
    } catch (err: any) { 
      console.error('로그인 에러: ', err);
      setError(err.response?.data?.message || '로그인에 실패하였습니다.');
    }
  }

  return (
    <>
      <div className='login-container'>
      <header className="login-header">
        <div className="login-logo">
          <Image className='login-logo-image' src="/images/logo.png" alt="usersImg" width={75} height={85} />
          <span className="login-logo-title">Brief-</span>
          <span className="login-logo-title-yellow">Log</span>
        </div>
      </header>

      <div className='login-body'>
        <div className='login-box'>
          <h1 className='login-title'>로그인</h1>
          <form onSubmit={handleLogin} className='login'>
            <input 
              type='text'
              className='login-input'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder='아이디/이메일'
              required
            />
            <input
              type='password'
              className='login-input'
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              placeholder='비밀번호'
              required 
            />
            <div className='login-state'>
              <input
                type='radio'
                className='login-state-btn'
                onChange={handleKeepLogin}
              />
              로그인 상태 유지
            </div>
            <button type='submit' className='login-btn'>접속</button>
            {error && <div className='login-error'>{error}</div>}
            <div className='login-toSignup'>
              <p className='login-toSignup-text'>Brief-Log가 처음이라면? </p>
              <p onClick={() => router.push('/join')} className='login-toSignup-router'>회원가입</p>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};