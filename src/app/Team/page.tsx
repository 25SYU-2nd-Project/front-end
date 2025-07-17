'use client'
import Header from '../Component/Header';
import Footer from '../Component/Footer';
import '../Styles/Team.css';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import api from '../api';
import TeamSearchModal from '../Component/TeamSearchModal';


interface Team {
  id: number;
  teamName: string;
};

interface members {
  id: number;
  userId: string;
  userName: string;
}

interface pendingMembers {
  userTeamId: number;
  userId: number;
  userLoginId: string;
  userName: string;
}

interface Meeting {
  id: number
  sessionNumber: number
  meetingDate: string
  meetingTime: string
  content: string
  attendees: string[]
}


export default function Team() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');

  // 팀 검색 모달
  const [showSearchModal, setShowSearchModal] = useState(false);
  const handleSearchModal = () => setShowSearchModal(true);

  // 로그인한 사용자 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        console.error('로그인이 필요합니다.');
        return;
      }

      try {
        const res = await api.get('/users/me');
        const userId = res.data.split(':')[1]?.trim();
        console.log('유저정보 응답:', userId);
        setUserId(userId);
      } catch (err: any) {
        console.error(err.response?.data?.message || '유저 정보 조회 실패');
      }
    }

    fetchUserInfo();
  }, []);

  // 팀 선택
  const [teamList, setTeamList] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [teamId, setTeamId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // 팀 목록 조회
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await api.get('/teams/my-teams');
        const data: Team[] = res.data;
        console.log('팀 목록:', data);
        setTeamList(data);
        setSelectedTeam(data[0]?.teamName || '');
        setTeamId(data[0]?.id || null);
      } catch (err) {
        console.error('팀 불러오기 실패:', err);
      }
    }

    fetchTeams();
  }, []);

  // 팀장 여부 확인
  const [leaderId, setLeaderId] = useState<string>('');
  const isLeader = userId === leaderId;

  useEffect(() => {
    if (!teamId) return;

    const fetchisLeader = async () => {
      try {
        const res = await api.get(`/teams/${teamId}/leader`);
        setLeaderId(res.data);
      } catch (err) {
        console.error('팀장 여부 조회 실패', err);
      }
    };
    
    fetchisLeader();
  }, [teamId]);

  // 대기자, 멤버 목록 조회
  const [pendingList, setPendingList] = useState<pendingMembers[]>([]);
  const [memberList, setMemberList] = useState<members[]>([]);

  // 멤버 목록 조회
   useEffect(() => {
    if (!teamId) return;

    const fetchMembers = async () => {
      try {
        const res = await api.get(`/teams/${teamId}/members`);
        // 멤버 리스트
        setMemberList(
          res.data.map((m: any) => ({
            id: m.id,
            userId: m.userId,
            userName: m.userName,
          }))
        );

      } catch (err: any) {
        console.error(err.response?.data?.message || "멤버 목록 조회 실패");
      } 
    };

    fetchMembers();
  }, [teamId]);

  // 대기자 목록 조회 (팀장만)
   useEffect(() => {
    if (!teamId || !userId || !leaderId) return;
    if (!isLeader) return;

    const fetchPendingMembers = async () => {
      try {
        const res = await api.get(`/teams/${teamId}/pending-members`);
        // 대기자 리스트
        setPendingList (
          res.data.map((m: any) => ({
            userTeamId: m.userTeamId,
            userId: m.userId,
            userName: m.userName,
            userLoginId: m.userLoginId,
          }))
        );

      } catch (err: any) {
        setPendingList([]);
        console.error(err.response?.data?.message || "대기자 목록 조회 실패");
      }
    };

    fetchPendingMembers();
  }, [teamId, userId, leaderId, isLeader]);

  // 가입 신청 팀원 수락하기
  const handleAcceptMember = async (userTeamId: number) => {
    if (!teamId) return;

    try {
      await api.post(`/teams/${teamId}/accept/${userTeamId}`);

      // 수락된 사용자 pendingList에서 찾기
      const acceptedMember = pendingList.find((m) => m.userTeamId === userTeamId);
      if (!acceptedMember) return;

      // pendingList에서 제거
      setPendingList((prev) => prev.filter((m) => m.userTeamId !== userTeamId));

      // memberList에 추가
      setMemberList((prev) => [
        ...prev,
        {
          id: acceptedMember.userId,
          userId: acceptedMember.userLoginId,
          userName: acceptedMember.userName,
        },
      ]);

      alert('수락되었습니다.');
    } catch (err: any) {
      console.error(err.res?.data?.message || '수락 실패');
    }
  };

  // 가입 신청 팀원 거절하기
  const handleDeleteMember = async (userTeamId: number) => {
    if (!teamId) return;

    try {
      await api.post(`/teams/${teamId}/reject/${userTeamId}`);

      // pendingList에서 해당 멤버 제거
      setPendingList((prev) => prev.filter((m) => m.userTeamId !== userTeamId));

      alert('거절되었습니다.');
    } catch (err: any) {
      console.error(err.response?.data?.message || '거절 실패');
    }
  };


  // 캘린더
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayArr = ['일', '월', '화', '수', '목', '금', '토'];

  const getWeekDates = (baseDate: Date): string[] => {
    const day = baseDate.getDay();
    const sunday = new Date(baseDate);
    sunday.setDate(baseDate.getDate() - day);

    const result: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      result.push(d.toISOString().slice(0, 10));
    }
    return result;
  };

  // 주차 구하기
  const getWeekNumber = (date: Date): number => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayWeekDay = firstDayOfMonth.getDay();
    const currentDate = date.getDate();

    return Math.ceil((currentDate + firstDayWeekDay) / 7);
  };

  const [baseDate, setBaseDate] = useState(new Date());
  const weekDates = getWeekDates(baseDate);

  // 이전 주 조회
  const handlePrevWeek = () => {
    const prevWeek = new Date(baseDate);
    prevWeek.setDate(baseDate.getDate() - 7);
    setBaseDate(prevWeek);
  };

  // 다음 주 조회
  const handleNextWeek = () => {
    const nextWeek = new Date(baseDate);
    nextWeek.setDate(baseDate.getDate() + 7);
    setBaseDate(nextWeek);
  };

  // 회의 일정
  const [meetingData, setMeetingData] = useState<Meeting[]>([])

  // 회의 일정 조회
   useEffect(() => {
    if (!teamId) return;

    const fetchMeetings = async () => {
      try {
        const res = await api.get(`/meetings/list/${teamId}`);
        setMeetingData(res.data);
      } catch (err) {
        console.error('회의 목록 불러오기 실패', err);
      }
    };
    
    fetchMeetings();
  }, [teamId]);

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
                          setSelectedTeam(team.teamName);
                          setTeamId(team.id);
                        }}>
                        <Image
                          className='star-img'
                          src={
                            selectedTeam === team.teamName
                              ? "/images/yellowstar.png"
                              : "/images/star.png"
                          }
                          alt="starImg"
                          width={11}
                          height={11}
                        />
                        {team.teamName}
                      </li>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Image className='search-img' src="/images/search.png" alt="searchImg" width={24} height={24} onClick={() => setShowSearchModal(true)}></Image>
          </div>

        {/* 팀 검색 모달 */}
        {showSearchModal && (
          <TeamSearchModal
            onClose={() => setShowSearchModal(false)}
          />
        )}

        <div onClick={() => router.push('/brief')} className='team-list-box'>
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
                const meeting = meetingData.find((s) => s.meetingDate === dateStr);
                let colorClass ='';

                if (idx === 0) colorClass = 'red';
                else if (idx === 6) colorClass = 'blue';
                return (
                  <div key={idx} className='calendar-oneday'>
                    <div className={`oneday-day ${colorClass}`}>{day}</div>
                    <div className='oneday-date'>
                      <div className={`date-btn ${meeting ? 'meeting' : ''}`}>
                        <div className={`date-text ${colorClass}`}>{parseInt(dateStr.slice(8, 10), 10)}</div>
                      </div>
                      {meeting && (
                        <div className='meeting-text'>회의일</div>
                      )}

                    </div>
                    {idx !== memberList.length + pendingList.length - 1 && <div className='team-member-line'></div>}
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
            {memberList.map((member, idx) => {
              return (
                <div key={`member-${idx}`} className='member-block'>
                  <div className='member-profile'>
                    <div className='member-info'>
                      <div className='profile-backimg'>
                        <Image
                          className='profile-img'
                          src="/images/profile.png"
                          alt="profileImg"
                          width={24}
                          height={24} 
                        />
                      </div>
                      <div className='profile-name'>{member.userName}</div>
                      {member.userId === leaderId ? <div className='profile-role-leader'>팀장</div> : <div className='profile-role'>팀원</div>}
                    </div>
                  </div>
                  {idx !== memberList.length + pendingList.length - 1 && <div className='team-member-line'></div>}
                </div>
              )
            })}
            {isLeader && pendingList.map((member, idx) => {
              return (
                <div key={`pending-${idx}`} className='member-block'>
                  <div className='member-profile'>
                    <div className='member-info'>
                      <div className='profile-backimg'>
                        <Image
                          className='profile-img'
                          src="/images/profile.png"
                          alt="profileImg"
                          width={24}
                          height={24} 
                        />
                      </div>
                      <div className='profile-name'>{member.userName}</div>
                      {member.userLoginId === leaderId && <div className='profile-role-leader'>팀장</div> || <div className='profile-role'>팀원</div>}
                    </div>
                    {isLeader && (
                    <div className='member-state'>
                      
                        <Image
                          className='member-state-accept-img'
                          src="/images/AcceptButton.png"
                          alt="AcceptButton"
                          width={24}
                          height={24}
                          onClick={() => handleAcceptMember(member.userTeamId)}
                        />
                      
                      <Image
                        className='member-state-reject-img'
                        src="/images/RejectButton.png"
                        alt="RejectButton"
                        width={24}
                        height={24}
                        onClick={() => handleDeleteMember(member.userTeamId)}
                      />
                    </div>
                    )}
                  </div>
                  {idx !== pendingList.length - 1 && <div className='team-member-line'></div>}
                </div>
              )
            })}
          </div>
        </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
