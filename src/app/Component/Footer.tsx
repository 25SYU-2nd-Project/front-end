'use client'
import Image from 'next/image'
import './component.css'
import { useRouter } from 'next/navigation';


export default function Footer(){
    const router = useRouter();
    return(
        <div className="footer-box">
            <Image className='home-button' 
            src="/images/HomeButton.png" 
            alt="home" 
            width={50} height={50}
            onClick={() => router.push('/main')} // 홈으로 이동
        style={{ cursor: 'pointer' }} 
            />
            <Image className='team-button' 
            src="/images/TeamButton.png" 
            alt="team" 
            width={50} height={50} 
            onClick={() => router.push('/team')} // team 페이지로 이동
            style={{ cursor: 'pointer' }}
            />
            <Image className='mypage-button' src="/images/MyPageButton.png" alt="mypage" width={50} height={50} />
        </div>
    )
}