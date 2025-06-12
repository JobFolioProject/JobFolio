import axios from 'axios';
import '../../css/community/CommuInfo.css';
import CommuMenuBar from './CommuMenuBar';
import { useState , useEffect } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/*
const mockData = [
  {
    id: 1,
    question: '사용권은 어디에서 사용할 수 있나요?',
    answer:
      '구매한 사용권은 하이잡 사이트 내에서 제공하는 이력서 첨삭, 면접 코칭 등 프리미엄 서비스에서 사용할 수 있습니다.'
  },
  {
    id: 2,
    question: '구매한 사용권의 환불 기준',
    answer:
      '결제일로부터 7일 이내에 사용 이력이 없는 경우 100% 환불이 가능합니다. 일부 사용 시 비례 환불 기준이 적용됩니다.'
  },
  {
    id: 3,
    question: '구매한 사용권은 양도/양수가 가능한가요?',
    answer:
      '사용권은 본인만 사용할 수 있으며, 타인에게 양도 또는 판매가 불가합니다.'
  },
  {
    id: 4,
    question: '사용권을 사용하여 받은 서비스의 품질은 어떻게 검증할 수 있나요?',
    answer:
      '서비스 만족도 평가는 완료된 서비스에 대해 리뷰 작성 기능을 통해 가능합니다.'
  },
  {
    id: 5,
    question: '자기소개서 첨삭 중 오류 메시지가 표시되었습니다.',
    answer:
      '네트워크 문제이거나 서버 오류일 수 있습니다. 잠시 후 다시 시도하거나 고객센터로 문의해주세요.'
  }
];
*/


const CommuInfo = () => {
  const [ infoList, setInfoList ] = useState([]);
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    axios.get('/api/info/list')
      .then((res) => {
        console.log('받은 데이터:', res.data);
        setInfoList(res.data);
      })
      .catch((err) => {
        console.error('이용안내 불러오기 대실패:', err);
      });
  },[])

  const toggleItem = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };
   
    return (
    <>
        <div className="info-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>이용안내</h1>
        </div>
    <CommuMenuBar/>

        <ul className="faq-list">
        {infoList.map((item) => (
          <li key={item.id} className={`faq-item ${openItem === item.id ? 'open' : ''}`}>
            <div className="question" onClick={() => toggleItem(item.id)}>
              <ChevronRightIcon className="icon" /> 
              <span> {item.question}</span>
            </div>
            {openItem === item.id && (
              <div className="answer">
                <p>{item.answer}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
    );
};

export default CommuInfo;