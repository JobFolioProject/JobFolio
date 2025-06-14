import axios from 'axios';
import '../../css/community/CommuInfo.css';
import CommuMenuBar from './CommuMenuBar';
import { useState , useEffect } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


const CommuInfo = () => {
  const [ infoList, setInfoList ] = useState([]);
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
    axios.get('/api/board/list')
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

        <ul className="info-list">
        {infoList.map((item) => (
          <li key={item.id} className={`info-item ${openItem === item.id ? 'open' : ''}`}>
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