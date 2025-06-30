import Header from '../Component/Header';
import Footer from '../Component/Footer';
import '../Styles/List.css';
import Image from 'next/image'

export default function List() {

  const logList = [
    {date: '2025-05-08', times: '10차시', brief: '기록된 회의 내용이 없습니다.'},
    {date: '2025-05-01', times: '9차시', brief: '기록된 회의 내용이 없습니다.'},
  ]
  return (
    <>
    <Header />
    <div className='list-container'>
      <div className='list-box'>
        <div className='list-title'>
          <Image className='list-img' src="/images/list.png" alt="listImg" width={30} height={30} />
          <span className='title-text'>회의록 목록</span>
        </div>
        <div className='list-category'>
          <div className='category-date'><p>Date</p></div>
          <div className='category-times'><p>Times</p></div>
          <div className='category-brief'><p>Brief</p></div>
        </div>
        <div className='list-content'>
          {
            logList.map((log, idx) => {
              return (
                <div key={idx} className='log-block'>
                  <div className='log-content'>
                    <div className='log-date'><p>{log.date}</p></div>
                    <div className='log-times'><p>{log.times}</p></div>
                    <div className='log-brief'><p>{log.brief}</p></div>
                    <Image className='log-vector-img' src="/images/redVector.png" alt="redVectorImg" width={7} height={11} />
                  </div>
                  {idx !== 12 && <div className='line'></div>}
                </div>
                )
            })
            }
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
