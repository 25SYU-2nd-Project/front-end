'use client'
import '../Styles/Signup.css';

export default function Signup() {

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
          <h1 className='login-title'>회원가입</h1>
          <form className='login'>
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
            <input
              type='password'
              className='input'
              placeholder='비밀번호 재확인'
              required>
            </input>
            <input 
              type='text'
              className='input'
              placeholder='이름'
              required>
            </input>
            <button type='submit' className='btn'>회원가입</button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};