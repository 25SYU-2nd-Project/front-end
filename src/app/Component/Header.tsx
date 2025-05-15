'use client'
import Image from 'next/image'
import './component.css'


export default function Header(){
    return(
        <div className="header-box">
            <Image className='header-logo' src="/images/headerLogo.png" alt="HeaderLogo" width={25} height={25} />
            <p className="header-text">Brief-<span className="header-text-yellow">Log</span></p> 
        </div>
    )
}