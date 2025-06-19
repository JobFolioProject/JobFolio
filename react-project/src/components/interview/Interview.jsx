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

  const [resumeList, setResumeList] = useState([]);
  const [selectedResumeNo, setSelectedResumeNo] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user?.userNo) return;
    (async () => {
      try {
        const res = await axios.post("/api/resume/resumeDetail", { userNo: user.userNo });
        const list = res.resumeList || [];
        setResumeList(list);
        if (list.length) setSelectedResumeNo(String(list[0].resume_no));
      } catch (err) {
        console.error("이력서 목록 불러오기 실패:", err);
      }
    })();
  }, [isAuthenticated, user]);

  const extractBySelector = (htmlStr, selector) => {
    const doc = new DOMParser().parseFromString(htmlStr, "text/html");
    const el = doc.querySelector(selector);
    return el ? el.textContent.trim() : null;
  };

  const handleLoadIntroduce = async () => {
    if (!selectedResumeNo) return;
    const resume = resumeList.find(r => String(r.resume_no) === selectedResumeNo);
    if (!resume) return;

    try {
      const htmlStr = await axios.get("/api/resume/selectOneResume", {
        params: { resume_file_path: resume.resume_file_pypath }
      });
      const introText = extractBySelector(htmlStr, ".introduction");
      setIntroduce(introText || "자기소개가 없습니다.");
      if (resume.desired_position) setApplyPosition(resume.desired_position);
    } catch {
      setIntroduce("자기소개를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const makeInterview = async () => {
    if (!introduce || introduce === "자기소개가 없습니다.") {
      alert("먼저 자기소개를 불러오고 편집해주세요.");
      return;
    }

    setLoading(true);
    setQuestions([]);

    try {
      const userPrompt =
        `다음은 저의 1분 자기소개입니다:\n${introduce}\n\n` +
        `${applyCompany} 회사의 ${applyPosition} 직무 면접관이라면 ` +
        `어떤 질문을 7개나 묻겠습니까? 번호를 붙여서 알려주세요.`;

      const payload = new URLSearchParams({
        applyCompany,
        applyPosition,
        introduce,
        sendmsg: userPrompt
      });

      const res = await axios.post(
        "/chatgpt/connectchatgpt4.do",
        payload,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      console.log("💡 GPT 전체 응답:", res);

      if (res.result !== "Y") {
        // result가 N 이면 error 메시지
        alert(`GPT 오류: ${res.answer}`);
      } else {
        // 정상
        const content = JSON.parse(res.answer)
          .choices[0].message.content;
        console.log("🔎 GPT 콘텐츠:", content);

        const parsed = [];
        const regex = /(\d+)\.\s*(.*?)(?=\n\d+\.|\n*$)/gs;
        let m;
        while ((m = regex.exec(content)) !== null) {
          parsed.push({ number: m[1], question: m[2].trim() });
        }
        setQuestions(parsed);
      }
    } catch (err) {
      console.error("질문 생성 중 에러:", err);
      alert("질문 생성 중 예기치 않은 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return <div>로그인이 필요합니다</div>;

  return (
    <div className="interview">
      <div className="interview-banner">
        <img src="/resources/img/banner.png" alt="Banner" />
        <h1>면접연습</h1>
      </div>

      <div className="interview-container">
        <div className="interview-wrapper">

          {/* 좌측 */}
          <div className="interview-container-left">
            <div className="interview-container-left-content">

              {/* 이력서 선택 */}
              <div className="resume-load-group">
                <div className="label-row">
                  <label htmlFor="resumeSelect" className="text">이력서 선택</label>
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

              {/* 지원회사/직무 */}
              <div className="customInput">
                <label htmlFor="applyCompany" className="text">지원 회사</label>
                <input
                  id="applyCompany"
                  className="input"
                  value={applyCompany}
                  onChange={e => setApplyCompany(e.target.value)}
                />
              </div>
              <div className="customInput">
                <label htmlFor="applyPosition" className="text">지원 직무</label>
                <input
                  id="applyPosition"
                  className="input"
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

              {/* 버튼 */}
              <div className="interview-button">
                <button className="save-my-introduce-button">
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
                  {loading ? "불러오는 중..." : "면접 질문 생성"}
                  <div className="interview-button-arrow-wrapper">
                    <div className="interview-button-arrow" />
                  </div>
                </button>
              </div>
            </div>
          </div>


          {/* 우측 */}
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
                  <p style={{ padding: "20px", color: "#666" }}>
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
