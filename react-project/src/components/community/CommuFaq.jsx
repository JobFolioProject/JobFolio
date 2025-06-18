import axios from "../../utils/axiosConfig";
import '../../css/community/CommuFaq.css';
import CommuMenuBar from './CommuMenuBar';
import { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CommuFaq = () => {
    const [ faqList, setFaqList ] = useState([]);
    const [ openItem, setOpenItem ] = useState(null);

    useEffect(() => {
        axios.get('/api/board/user/faq/list', {
            params : {
                board_type : "F"
            }
        })
          .then((res) => {
            console.log('받은 데이터 : ', res);
            setFaqList(res);
          })  
          .catch((err) => {
            console.error('FAQ 불러오기 실패 : ', err);
          });
    }, [])

    const toggleItem = (id) => {
        setOpenItem((prev) => (prev === id ? null : id));
    };
   
    return (
    <>
        <div className="faq-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>자주묻는질문</h1>
        </div>
    <CommuMenuBar/>

        <ul className="faq-list">
            {faqList.map((item) => (
                <li key={item.id} className={`faq-item ${openItem === item.id ? 'open' : ''}`}>
                    <div className="faq-box">
                        <div className="question" onClick={() => toggleItem(item.id)}>
                            <div className="question-left">
                                <span className="faq-q">Q.</span>
                                <span className="faq-question-text">{item.question}</span>
                            </div>    
                            <KeyboardArrowDownIcon className="icon"/>
                        </div>

                    {openItem === item.id && (
                        <div className="answer">
                            <span className="faq-a">A.</span>
                            <div className="faq-answer-text">
                                {item.answer.split('\n\n').map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))}
                            </div>
                        </div>
                    )}
                    </div>
                </li>
            ))}

        </ul>

    </>
    );
};

export default CommuFaq;