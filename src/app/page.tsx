'use client'
import { useRouter } from 'next/navigation'
import './Styles/Login.css';

export default function Login() {
  const router = useRouter();
  


  return (
    <>
      <div className='container'>
      <header className="header">
        <div className="logo">
          
          <span className="logo-title">Brief-</span>
          <span className="logo-title-yellow">Log</span>
        </div>
      </header>

      <div className='body'>
        <div className='box'>
          <h1 className='login-title'>로그인</h1>
          <form  className='login'>
            <input 
              type='id'
              className='input'
              
              placeholder='아이디/이메일'
              required>
            </input>
            <input
              type='password'
              className='input'
              
              placeholder='비밀번호'
              required>
            </input>
            <div className='state'>
              <input
                type='checkbox'
                className='state-btn'>
              </input>
              로그인 상태 유지
            </div>
            <button type='submit' className='btn'>접속</button>
            <div className='signup'>
              <span className='signup-text'>Brief-Log가 처음이라면? </span>
              <span onClick={() => router.push('/Signup')} className='signup-router'>회원가입</span>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};