import { useEffect, useState } from 'react';
import axios from "axios";
import '../../css/interview/Interview.css';

const Interview = () => {
    const [applyCompany, setApplyCompany] = useState("");
    const [applyPosition, setApplyPosition] = useState("");
    const [introduce, setIntroduce] = useState("");
    
    const makeInterview = async () => {        
        const checkValue = {
            applyCompany:applyCompany,
            applyPosition:applyPosition,
            introduce:introduce,
        }
        console.log(checkValue);        
        
        await axios.post("/chatgpt/connectchatgpt4.do", new URLSearchParams(Object.entries(checkValue)))
            .then((res) => {
                console.log(res.data.answer);
                document.getElementById("interviewGpt").value = res.data.answer;
            })
            .catch((error) => {
                console.error(error);
            })
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
                        <hr />
                        <h1>
                            지원 회사
                        </h1>
                        <input type="text" name="applyCompany" id="applyCompany" value={applyCompany} onChange={e => setApplyCompany(e.target.value)}/>
                        <h1>
                            직무
                        </h1>
                        <input type="text" name="applyPosition" id="applyPosition" value={applyPosition} onChange={e => setApplyPosition(e.target.value)}/>
                        <hr />
                        <h1>자기소개</h1>
                        <textarea name="interviewIntro" id="interviewIntro" value={introduce} onChange={e => setIntroduce(e.target.value)}></textarea>
                        <div>
                            <button onClick={makeInterview}>면접 질문 생성</button>
                        </div>
                    </div>
                </div>
                <div className='interview-container-right'>
                    <div className="interview-container-right-content">
                        <h1>
                            GPT 모의 면접 출력 영역
                        </h1>
                        <div className='interview-gpt-practice'>
                            <textarea name="interviewGpt" id="interviewGpt" readOnly={true}></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default Interview;