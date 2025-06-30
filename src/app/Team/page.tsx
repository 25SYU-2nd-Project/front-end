'use client'
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import '../Styles/Team.css';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import api from '../api';

type Member = {
  name: string;
  picture: string;
  role: string;
  state: string;
};

type Team = {
  name: string;
  mem: Member[];
};



export default function Team() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');

  // 팀 선택
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('두유즈');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

   

  useEffect(() => {
    const data: Team[] = [
      {
        name: '두유즈',
        mem: [
          { picture: 'null', name: 'a', role: '팀장', state: '수락됨'},
          { picture: 'null', name: 'b', role: '팀원', state: '수락됨'},
          { picture: 'null', name: 'c', role: '팀원', state: '수락됨'},
          { picture: 'null', name: 'd', role: '팀원', state: '수락안됨'},
          { picture: 'null', name: 'e', role: '팀원', state: '수락안됨'},
          { picture: 'null', name: 'f', role: '팀원', state: '수락안됨'},
          { picture: 'null', name: 'g', role: '팀원', state: '수락안됨'},
    ],
      },
      {
        name: '삼유즈',
        mem: [
          { picture: 'null', name: '1', role: '팀장', state: '수락됨'},
          { picture: 'null', name: '22', role: '팀원', state: '수락안됨'},
    ],
      },
      {
        name: '마유네즈',
        mem: [
          { picture: 'null', name: '가', role: '팀장', state: '수락됨'},
          { picture: 'null', name: '나', role: '팀원', state: '수락안됨'},
    ],
      },
    ]
    setTeamList(data);
  }, []); // 추후 수정

  const selectedTeamObj = teamList.find(t => t.name === selectedTeam);
  const memList = selectedTeamObj?.mem ?? [];

  const isLeader = true; // 팀장인지 확인 // 추후 수정

  // 팀원 수락하기
  const handleMemberAccept = (index: number) => {
    const updated = teamList.map(team => {
      if (team.name !== selectedTeam) return team;
      const newMem = [...team.mem];
      newMem[index].state = '수락됨';
      return { ...team, mem: newMem };
    });
    setTeamList(updated);
  }

  // 팀원 삭제하기
  const handleMemberDelete = (index: number) => {
    const updated = teamList.map(team => {
      if (team.name !== selectedTeam) return team;
      const newMem = team.mem.filter((_, i) => i !== index);
      return { ...team, mem: newMem };
    });
    setTeamList(updated);
  }

  // 캘린더
  const [baseDate, setBaseDate] = useState(new Date());
  const weekDates = getWeekDates(baseDate);

  const handlePrevWeek = () => {
    const prevWeek = new Date(baseDate);
    prevWeek.setDate(baseDate.getDate() - 7);
    setBaseDate(prevWeek);
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(baseDate);
    nextWeek.setDate(baseDate.getDate() + 7);
    setBaseDate(nextWeek);
  };
  // 캘린더
const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayArr = ['일', '월', '화', '수', '목', '금', '토'];
const scheduleData = [
  { date: '2025-06-26', title: '회의' },
  { date: '2025-07-02', title: '회의' },
]; // 추후 수정

function getWeekDates(baseDate: Date): string[] {
  const day = baseDate.getDay();
  const sunday = new Date(baseDate);
  sunday.setDate(baseDate.getDate() - day);

  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    result.push(d.toISOString().slice(0, 10));
  }
  return result;
}

// 주차 구하기
const getWeekNumber = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayWeekDay = firstDayOfMonth.getDay();
  const currentDate = date.getDate();

  return Math.ceil((currentDate + firstDayWeekDay) / 7);
}
 
/*
useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      setError('로그인이 필요합니다.');
      return;
    }

    api.get('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
  console.log('유저정보 응답:', res.data);
  setUser(res.data);
})

      .catch(err => setError(err.response?.data?.message || '유저 정보 조회 실패'));
  }, []);

  if (error) return <div>{error}</div>;
  if (!user) return <div>유저 정보 불러오는 중...</div>;*/

  return (
    <div className='teampage-container'>
    <Header />
    <div className='team-container'>
      <div className='team-box'>
        <div className='team-header'>
          <div className='team-header-select'>
            <Image className='team-header-select-img' src="/images/users.png" alt="usersImg" width={24} height={24} />
            <p className='team-header-select-text'>마이 팀 -</p>
            <div onClick={toggleDropdown} className='dropdown'>
              <span className='dropdown-teamname'>{selectedTeam}</span>
              <Image className='down-img' src="/images/caret-down.png" alt="downImg" width={24} height={24} />
              {isDropdownOpen && (
                <div className='dropdown-content'>
                  {teamList.map((team, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSelectedTeam(team.name);
                        
                    }}>
                      <Image
                        className='star-img'
                        src={
                          selectedTeam === team.name
                            ? "/images/yellowstar.png"
                            : "/images/star.png"
                        }
                        alt="starImg"
                        width={11}
                        height={11}
                      />
                      {team.name}
                    </li>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Image className='search-img' src="/images/search.png" alt="searchImg" width={24} height={24}></Image>
        </div>

        <div onClick={() => router.push('/Brief')} className='team-list-box'>
          <span className='team-list-text'> 팀 회의록 보기</span>
          <Image className='team-list-vector-img' src="/images/Vector-next.png" alt="vectorImg" width={20} height={30}></Image>
        </div>

        <div className='team-calendar-box'>
          <div className='team-calendar-title'>
            <Image
              className='vector-img'
              src="/images/Vector-prev.png"
              alt="vectorPrevImg"
              width={9}
              height={11}
              onClick={handlePrevWeek}
            />
            <span className='title-month'>{monthArr[baseDate.getMonth()]}</span>
            <span>-</span>
            <span className='title-week'>{getWeekNumber(baseDate)}주</span>
            <Image
              className='vector-img'
              src="/images/Vector-next.png"
              alt="vectorNextImg"
              width={9}
              height={11}
              onClick={handleNextWeek}
            />
          </div>
          <div className='calendar-content'>
            {
              dayArr.map((day, idx) => {
                const dateStr = weekDates[idx];
                const schedule = scheduleData.find((s) => s.date === dateStr);
                let colorClass ='';

                if (idx === 0) colorClass = 'red';
                else if (idx === 6) colorClass = 'blue';
                return (
                  <div key={idx} className='calendar-oneday'>
                    <div className={`oneday-day ${colorClass}`}>{day}</div>
                    <div className='oneday-date'>
                      <div className={`date-btn ${schedule ? 'schedule' : ''}`}>
                        <div className={`date-text ${colorClass}`}>{parseInt(dateStr.slice(8, 10), 10)}</div>
                      </div>
                      {schedule && (
                        <div className='schedule-text'>회의일</div>
                      )}
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div className='team-member-box'>
          <div className='team-member-title'>
            <Image className='list-img' src="/images/list.png" alt="listImg" width={30} height={30} />
            <span className='member-title-text'>팀원</span>
          </div>
          <div className='member-content'>
            {
              memList.map((member, idx) => {
                return (
                  <div key={idx} className='member-block'>
                    <div className='member-profile'>
                      <div className='member-info'>
                        <div className='profile-backimg'>
                          <Image
                            className='profile-img'
                            src={member.picture === 'null' ? "/images/profile.png" : member.picture}
                            alt="profileImg"
                            width={24}
                            height={24} 
                          />
                        </div>
                        <div className='profile-name'>{member.name}</div>
                        <div className={member.role === '팀장' ? 'profile-role-leader' : 'profile-role'}>{member.role}</div>
                      </div>
                      {isLeader && (
                      <div className='member-state'>
                        {member.state === '수락안됨' ? (
                          <Image
                            className='member-state-accept-img'
                            src="/images/AcceptButton.png"
                            alt="AcceptButton"
                            width={24}
                            height={24}
                            onClick={() => handleMemberAccept(idx)}
                          />
                        ) : null
                        }
                        <Image
                          className='member-state-reject-img'
                          src="/images/RejectButton.png"
                          alt="RejectButton"
                          width={24}
                          height={24}
                          onClick={() => handleMemberDelete(idx)}
                        />
                      </div>
                      )}
                    </div>
                    {idx !== memList.length - 1 && <div className='team-member-line'></div>}
                  </div>
                )
              })
            }
          </div>
        </div>

      </div>
    </div>
    <Footer />
    </div>
  );
}
