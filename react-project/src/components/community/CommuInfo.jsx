import axios from "../../utils/axiosConfig";
import '../../css/community/CommuInfo.css';
import CommuMenuBar from './CommuMenuBar';
import { useState , useEffect } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';



const CommuInfo = () => {
  const [ infoList, setInfoList ] = useState([]);
  const [openItem, setOpenItem] = useState(null);

  useEffect(() => {
   
    axios.get('/api/board/user/info/list', {
      params : {
        board_type : "I"
      }
    })
      .then((res) => {
        console.log('받은 데이터:', res);
        setInfoList(res);
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
          <li key={item.id} className={`info-item ${openItem === item.id ? 'inactive' : ''}`}>
            <div className="question-info" onClick={() => toggleItem(item.id)}>
              <div className='question-left'>
              <span className="info-Q">Q.</span>
              <span className={`info-question ${openItem === item.id ? 'active' : 'inactive'}`}> {item.question}</span>
              </div>
              <KeyboardArrowDownIcon className="iconA" />
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