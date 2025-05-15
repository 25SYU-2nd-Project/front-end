'use client'
import Image from 'next/image'
import './component.css'


export default function Footer(){
    return(
        <div className="footer-box">
            <Image className='home-button' src="/images/HomeButton.png" alt="home" width={50} height={50} />
            <Image className='team-button' src="/images/TeamButton.png" alt="team" width={50} height={50} />
            <Image className='mypage-button' src="/images/MyPageButton.png" alt="mypage" width={50} height={50} />
        </div>
    )
}