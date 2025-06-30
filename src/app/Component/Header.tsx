import React from 'react';
import '../Styles/component.css';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Image className='login-logo-image' src="/images/logo.png" alt="usersImg" width={25} height={30} />
        <span className="logo-title">Brief-</span>
        <span className="logo-title-yellow">Log</span>
      </div>
    </header>
  );
};