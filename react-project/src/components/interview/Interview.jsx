import { useEffect, useState } from 'react';
import axios from "../../utils/axiosConfig";
import { useAuth } from '../../context/AuthContext';
import '../../css/interview/Interview.css';

const Interview = () => {
    const [applyCompany, setApplyCompany] = useState("");
    const [applyPosition, setApplyPosition] = useState("");
    const { user, isAuthenticated } = useAuth();
    const [introduce, setIntroduce] = useState("");
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    // 내 이력서 목록 및 선택된 이력서 번호
    const [resumeList, setResumeList] = useState([]);
    const [selectedResumeNo, setSelectedResumeNo] = useState("");

    // 로그인된 유저의 이력서 목록 불러오기
    useEffect(() => {
        // user.userNo 로 체크
        if (!isAuthenticated || !user?.userNo) {
            console.warn(
                !isAuthenticated ? "로그인 상태 아님" : "userNo가 없음"
            );
            return;
        }

        (async () => {
            try {
                const userNo = user.userNo;
                console.log("📡 resumeDetail 요청 시작, userNo=", userNo);
                // interceptor 덕분에 res === response.data
                const res = await axios.post("/api/resume/resumeDetail", { userNo });
                console.log("📥 resumeDetail 응답:", res);
                const list = res.resumeList || [];
                console.log("📑 이력서 리스트:", list);
                setResumeList(list);
                if (list.length > 0) {
                    setSelectedResumeNo(String(list[0].resume_no));
                }
            } catch (err) {
                console.error("❌ 이력서 목록 불러오기 실패:", err);
            }
        })();
    }, [isAuthenticated, user]);

    // HTML 문자열에서 selector에 해당하는 부분만 추출
    const extractBySelector = (htmlStr, selector) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlStr, "text/html");
        const el = doc.querySelector(selector);
        return el ? el.innerHTML.trim() : null;
    };

    // 2) 선택된 이력서의 HTML 불러오기
    const handleLoadIntroduce = async () => {
        if (!selectedResumeNo) return;

        // 선택된 이력서 찾기
        const resume = resumeList.find(r => String(r.resume_no) === selectedResumeNo);
        if (!resume) return;

        try {
            // 전체 HTML 가져오기
            const htmlStr = await axios.get("/api/resume/selectOneResume", {
                params: { resume_file_path: resume.resume_file_pypath }
            });
            console.log("전체 HTML:", htmlStr);

            // .introduction 클래스 부분만 추출
            const introHtml = extractBySelector(htmlStr, ".introduction");
            console.log("추출된 introHtml:", introHtml);

            // 없으면 기본 텍스트, 있으면 그 내용으로 설정
            if (introHtml) {
                setIntroduce(introHtml);
            } else {
                setIntroduce("자기소개가 없습니다.");
            }

            // 4) desired_position 자동 채우기
            if (resume.desired_position) {
                setApplyPosition(resume.desired_position);
            }

        } catch (err) {
            console.error("자기소개 불러오기 실패:", err);
            setIntroduce("자기소개를 불러오는 중 오류가 발생했습니다.");
        }
    };

    // 3) 면접 질문 생성
    const makeInterview = async () => {
        setLoading(true);
        setQuestions([]);
        try {
            const checkValue = {
                applyCompany,
                applyPosition,
                introduce,
                sendmsg: `${introduce}\n\n이건 나의 1분 자기소개야. ${applyCompany} 회사의 ${applyPosition} 직무에 지원하려고 하는데, 면접관 입장에서 예상 질문 7개를 알려줘.`
            };
            const res = await axios.post(
                "/chatgpt/connectchatgpt4.do",
                new URLSearchParams(Object.entries(checkValue))
            );
            console.log("🤖 chatgpt 응답:", res);
            const answer = JSON.parse(res.answer)
                .choices[0].message.content;
            const parsed = [];
            const regex = /(\d+)\.\s*(.*?)(?=\n\d+\.|\n*$)/gs;
            let m;
            while ((m = regex.exec(answer)) !== null) {
                parsed.push({ number: m[1], question: m[2].trim() });
            }
            setQuestions(parsed);
        } catch (error) {
            console.error("질문 생성 중 에러:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <div>로그인이 필요합니다</div>;
    }

    return (
        <div className="interview">
            <div className="interview-banner">
                <img src="/resources/img/banner.png" alt="Banner" />
                <h1>면접연습</h1>
            </div>

            <div className="interview-container">
                <div className="interview-wrapper">
                    {/* 좌측 입력 폼 */}
                    <div className="interview-container-left">
                        <div className="interview-container-left-content">

                            {/* 이력서 선택 + 불러오기 */}
                            <div className="resume-load-group">
                                <div className="label-row">
                                    <label htmlFor="resumeSelect" className="text">
                                        이력서 선택
                                    </label>
                                </div>

                                <div className="controls-row">
                                    <select
                                        id="resumeSelect"
                                        className="input"
                                        value={selectedResumeNo}
                                        onChange={e => setSelectedResumeNo(e.target.value)}
                                    >
                                        <option value="">선택하세요</option>
                                        {resumeList.map(r => (
                                            <option key={r.resume_no} value={r.resume_no}>
                                                {r.title}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className="get-my-introduce-button"
                                        onClick={handleLoadIntroduce}
                                    >
                                        <span className="button-line">내 자기소개</span>
                                        <span className="button-line">가져오기</span>
                                    </button>
                                </div>
                            </div>

                            {/* 지원 회사/직무 */}
                            <div className="customInput">
                                <label htmlFor="applyCompany" className="text">지원 회사</label>
                                <input
                                    id="applyCompany"
                                    className="input"
                                    type="text"
                                    value={applyCompany}
                                    onChange={e => setApplyCompany(e.target.value)}
                                />
                            </div>
                            <div className="customInput">
                                <label htmlFor="applyPosition" className="text">지원 직무</label>
                                <input
                                    id="applyPosition"
                                    className="input"
                                    type="text"
                                    value={applyPosition}
                                    onChange={e => setApplyPosition(e.target.value)}
                                />
                            </div>

                            {/* 자기소개 편집 */}
                            <div className="customInput">
                                <label htmlFor="introduceTextarea" className="text">자기소개</label>
                                <textarea
                                    id="introduceTextarea"
                                    className="textarea"
                                    value={introduce}
                                    onChange={e => setIntroduce(e.target.value)}
                                />
                            </div>

                            {/* 저장 & 질문 생성 */}
                            <div className="interview-button">
                                <button
                                    className="save-my-introduce-button"
                                    onClick={() => { /* 저장 핸들러 */ }}
                                >
                                    내 이력서에 저장하기
                                    <div className="interview-button-arrow-wrapper">
                                        <div className="interview-button-arrow" />
                                    </div>
                                </button>
                                <button
                                    className="interview-make-button"
                                    onClick={makeInterview}
                                    disabled={loading}
                                >
                                    {loading ? '불러오는 중...' : '면접 질문 생성'}
                                    <div className="interview-button-arrow-wrapper">
                                        <div className="interview-button-arrow" />
                                    </div>
                                </button>
                            </div>

                        </div>
                    </div>

                    {/* 우측 질문 리스트 */}
                    <div className="interview-container-right">
                        <div className="interview-gpt-title">모의 면접 질문</div>
                        <div className="interview-container-right-content">
                            {questions.length > 0 ? (
                                <ul className="interview-gpt-question-list">
                                    {questions.map(({ number, question }) => (
                                        <li key={number} className="interview-gpt-question-list-item">
                                            {question}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !loading && (
                                    <p style={{ padding: '20px', color: '#666' }}>
                                        아직 생성된 질문이 없습니다.
                                    </p>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Interview;
