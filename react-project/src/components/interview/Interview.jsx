import { useEffect, useState } from 'react';
import axios from "axios";
import '../../css/interview/Interview.css';

const Interview = () => {
    const [applyCompany, setApplyCompany] = useState("");
    const [applyPosition, setApplyPosition] = useState("");
    const [introduce, setIntroduce] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);  // 로딩 상태
    
    const makeInterview = async () => {        
        setLoading(true);
        setQuestions([]); // 이전 질문 지우기

        const checkValue = {
            applyCompany:applyCompany,
            applyPosition:applyPosition,
            introduce:introduce,
            sendmsg: `${introduce} 이건 나의 1분 자기소개야 ${applyCompany} 회사에 ${applyPosition} 직무에 지원하려고 하는데 면접관의 입장에서 예상 질문 7개 알려줘`
        }
        console.log(checkValue);        
        
        try {
            const res = await axios.post(
                "/chatgpt/connectchatgpt4.do",
                new URLSearchParams(Object.entries(checkValue))
            );

            console.log(res.data.answer);

            const responseAnswer = JSON.parse(res.data.answer);
            const answer = responseAnswer.choices[0].message.content;
            console.log(answer);

            const questions = [];
            const regex = /(\d+)\.\s*(.*?)(?=\n\d+\.|\n*$)/gs;

            let match;
            while ((match = regex.exec(answer)) !== null) {
                    questions.push({
                    number: match[1],
                    question: match[2].trim(),
                });
            }

            console.log(questions);
            setQuestions(questions);

            } catch (error) {
            console.error("에러 발생:", error);
            } finally {
            console.log("로딩 종료");
            setLoading(false);
            }

    }
    return (
    <div className='interview'>
        <div className="interview-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>면접연습</h1>
            <div className="interview-description">
                <p>자기소개서 내용을 수정할 수도 있고,</p>
                <p>면접질문과 답변도 생성할 수 있어요</p>
            </div>
        </div>
        <div className="interview-wrapper">
            <div className="interview-container">
                <div className='interview-container-left'>
                    <div className="interview-container-left-content">
                        <div className="customInput">
                            <label for="input" className="text">지원 회사</label>                            
                            <input className="input" type="text" name="applyCompany" id="applyCompany" value={applyCompany} onChange={e => setApplyCompany(e.target.value)}/>
                        </div>
                        <div className="customInput">
                            <label for="input" className="text">지원 직무</label>                            
                            <input className="input" type="text" name="applyPosition" id="applyPosition" value={applyPosition} onChange={e => setApplyPosition(e.target.value)}/>
                        </div>
                        <hr />
                        <div className="customInput">
                            <label for="textarea" className="text">자기소개</label>  
                            <textarea className="textarea" name="interviewIntro" id="interviewIntro" value={introduce} onChange={e => setIntroduce(e.target.value)}></textarea>
                        </div>
                        <div className="interview-button">
                            <button className="interview-make-button" onClick={makeInterview}>                                
                                면접 질문 생성
                                <div className="interview-button-arrow-wrapper">
                                    <div className="interview-button-arrow"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='interview-container-right'>
                    <div className="interview-gpt-title">모의 면접 질문</div>  
                    <div className="interview-container-right-content">
                        <div className='interview-gpt-practice'>
                            {loading && <p>불러오는 중...</p>}

                            {questions.length > 0 && (
                                <ul className='interview-gpt-question-list'>
                                {questions.map(({ number, question }) => (
                                    <li key={number} className='interview-gpt-question-list-item'>
                                        {question}
                                    </li>
                                ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Interview;