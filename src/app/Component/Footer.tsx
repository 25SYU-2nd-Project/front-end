'use client'
import Image from 'next/image'
import './component.css'
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Footer() {
    const router = useRouter();
    const pathname = usePathname();
    const [selected, setSelected] = useState('');

    useEffect(() => {
        // 현재 경로 기준 초기 선택 상태 설정
        if (pathname.includes('/Main')) setSelected('home');
        else if (pathname.includes('/Team')) setSelected('team');
    }, [pathname]);

    const handleClick = (page: string, path: string) => {
        setSelected(page);
        router.push(path);
    };

    return (
        <div className="footer-box">
            <Image
                className="home-button"
                src={selected === 'home' ? "/images/HomeSelect.png" : "/images/HomeButton.png"}
                alt="home"
                width={50}
                height={50}
                onClick={() => handleClick('home', '/main')}
                style={{ cursor: 'pointer' }}
            />
            <Image
                className="team-button"
                src={selected === 'team' ? "/images/TeamSelect.png" : "/images/TeamButton.png"}
                alt="team"
                width={50}
                height={50}
                onClick={() => handleClick('team', '/team')}
                style={{ cursor: 'pointer' }}
            />
            <Image
                className="mypage-button"
                src="/images/MyPageButton.png"
                alt="mypage"
                width={50}
                height={50}
                style={{ cursor: 'pointer' }}
                // 클릭 이벤트 없음 (선택 미적용 상태)
            />
        </div>
    );
}
