'use client'
import React from 'react';
import '../Styles/component.css';
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Footer() {
  const router = useRouter();
  return (
    <div className="footer">
      <div className="footer-box">
        <button onClick={() => router.push('/Main')} className='footer-btn'>
          <Image className='img-home' src="/images/home.png" alt="homeImg" width={30} height={30}></Image>
        </button>
        <button onClick={() => router.push('/Team')} className='footer-btn'>
          <Image className='img-team' src="/images/people.png" alt="teamImg" width={30} height={30}></Image>
        </button>
        <button onClick={() => router.push('/Main')} className='footer-btn'>
          <Image className='img-user' src="/images/user.png" alt="userImg" width={30} height={30}></Image>
        </button>
      </div>
    </div>
  );
};