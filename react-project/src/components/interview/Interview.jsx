import { useEffect, useState, useRef } from "react";
import axios from "../../utils/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../../css/interview/Interview.css";
import Banner from "../common/Banner";
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, Select, MenuItem, TextareaAutosize } from '@mui/material';

const Interview = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 지원 회사/직무, 자기소개
  const [applyCompany, setApplyCompany] = useState("");
  const [applyPosition, setApplyPosition] = useState("");
  const [introduce, setIntroduce] = useState("");

  // 이력서 목록 & 선택
  const [resumeList, setResumeList] = useState([]);
  const [selectedResumeNo, setSelectedResumeNo] = useState("");

  // 질문 관리
  const [questions, setQuestions] = useState([]); // 누적된 질문 배열
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보고 있는 질문 인덱스

  // 답변 & 피드백 히스토리
  const [answers, setAnswers] = useState([]); // 사용자 답변 모음
  const [feedbacks, setFeedbacks] = useState([]); // 평가 피드백 모음
  const [improvementsList, setImprovementsList] = useState([]); // 개선할 점

  // 사용자 입력 답변 상태
  const [userAnswer, setUserAnswer] = useState("");

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 1) 이력서 목록 불러오기
  useEffect(() => {
    if (!isAuthenticated || !user?.userNo) return;
    (async () => {
      try {
        const res = await axios.post("/api/resume/resumeDetail", {
          user_no: user.userNo,
          pageSize: "all",
        });
        const list = res.resumeList || [];
       setResumeList(list);
       // 목록이 비어 있으면 확인창 띄우고, 동의 시 이동
        if (list.length === 0) {
          const ok = window.confirm("저장된 이력서가 없습니다.\n이력서 작성 페이지로 이동하시겠습니까?");
          if (ok) {
            navigate("/resume/write");
          }
        }
      } catch (err) {
        console.error("이력서 목록 불러오기 실패:", err);
      }
    })();
  }, [isAuthenticated, user, navigate]);

  // 2) 자기소개 추출
  const extractBySelector = (htmlStr, selector) => {
    const doc = new DOMParser().parseFromString(htmlStr, "text/html");
    const el = doc.querySelector(selector);
    return el ? el.textContent.trim() : null;
  };
  const handleLoadIntroduce = async () => {
    if (!selectedResumeNo) return;
    const resume = resumeList.find(
      (r) => String(r.resume_no) === selectedResumeNo
    );
    if (!resume) return;
    try {
      const htmlStr = await axios.get("/api/resume/selectOneResume", {
        params: { resume_file_path: resume.resume_file_pypath },
      });
      const intro = extractBySelector(htmlStr, ".introduction");
      // 탭, 줄바꿈 제거, 2회 이상 공백 제거
      const cleanedIntro = intro.replace(/[\t\r\n]/g, "").replace(/ {2,}/g, " ");
      setIntroduce(cleanedIntro || "");
      if (resume.desired_position) setApplyPosition(resume.desired_position);
    } catch {
      setIntroduce("");
    }
  };

  // 질문 파싱
  const parseQuestions = (content) => {
    const arr = [];
    const regex = /(\d+)\.\s*(.*?)(?=\n\d+\.|\n*$)/gs;
    let m;
    while ((m = regex.exec(content)) !== null) {
      arr.push(m[2].trim());
    }
    return arr;
  };

  // 3) 첫 질문 생성
  const generateFirstBatch = async () => {
    if (!introduce.trim()) return alert("자기소개를 입력해주세요.");
    if (!applyCompany.trim()) return alert("지원할 회사명을 입력해주세요.");
    if (!applyPosition.trim()) return alert("지원할 직무를 입력해주세요.");

    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setFeedbacks([]);
    setUserAnswer("");

    try {
      const payload = {
        resumeNo: selectedResumeNo,
        introduce,
        applyCompany,
        applyPosition,
      };
      const res = await axios.post("/api/interview/generate", payload);
      if (res.result !== "Y") {
        return alert(`GPT 오류: ${res.answer}`);
      }
      const content = JSON.parse(res.answer).choices[0].message.content;
      setQuestions(parseQuestions(content));
    } catch (err) {
      console.error(err);
      alert("질문 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 4) 추가 질문 생성
  const generateMore = async () => {
    setLoading(true);
    try {
      const payload = {
        resumeNo: selectedResumeNo,
        introduce,
        applyCompany,
        applyPosition,
        offset: questions.length,
      };
      const res = await axios.post("/api/interview/generateMore", payload);
      if (res.result !== "Y") {
        return alert(`GPT 오류: ${res.answer}`);
      }
      const content = JSON.parse(res.answer).choices[0].message.content;
      setQuestions((prev) => [...prev, ...parseQuestions(content)]);
    } catch (err) {
      console.error(err);
      alert("추가 질문 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 5) 답변 평가 및 다음으로
  const submitAndNext = async () => {
    if (!userAnswer.trim()) return alert("답변을 입력해주세요.");
    setLoading(true);
    try {
      // API 호출—interceptor 덕에 res는 response.data 입니다
      const res = await axios.post("/api/interview/evaluate", {
        question: questions[currentIndex],
        answer: userAnswer,
      });
      // res.feedback, res.improvements 로 바로 접근
      const fb = res.feedback || "피드백을 받지 못했습니다.";
      const im = res.improvements || "개선할 점을 받지 못했습니다.";

      setAnswers((prev) => [...prev, userAnswer]);
      setFeedbacks((prev) => [...prev, fb]);
      setImprovementsList((prev) => [...prev, im]);

      setCurrentIndex((idx) => idx + 1);
      setUserAnswer("");
    } catch (err) {
      console.error(err);
      alert("평가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  //  스크롤 컨테이너 ref
  const scrollContainerRef = useRef(null);

  //  답변이 추가될 때마다 맨 아래로
  useEffect(() => {
    const c = scrollContainerRef.current;
    if (c) {
      c.scrollTo({ top: c.scrollHeight, behavior: "auto" });
    }
  }, [answers.length, feedbacks.length, improvementsList.length]);

  if (!isAuthenticated) return <div>로그인이 필요합니다</div>;

  return (
    <>
      <Banner pageName="면접연습" />
      <div className="interview">
        <div className="interview-container">
          <div className="interview-wrapper">
            {/* 좌측 폼 */}
            <div className="interview-container-left">
              <div className="interview-container-left-content">
                {/* 이력서 선택 */}
                <div className="resume-load-group">
                  <div className="controls-row">
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="resumeSelect-label">이력서 선택</InputLabel>
                      <Select
                        labelId="resumeSelect-label"
                        id="resumeSelect"
                        value={selectedResumeNo}
                        onChange={(e) => setSelectedResumeNo(e.target.value)}
                        label="이력서 선택"
                      >
                        {resumeList.length === 0
                          ? <MenuItem value=""><em>불러오는 중...</em></MenuItem>
                          : resumeList.map((r) => (
                            <MenuItem key={r.resume_no} value={String(r.resume_no)}>
                              {r.title}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                    <button
                      onClick={handleLoadIntroduce}
                      className="get-my-introduce-button"
                    >
                      <span className="button-line">내 자기소개</span>
                      <span className="button-line">가져오기</span>
                    </button>
                  </div>
                </div>

                {/* 지원 회사/직무 */}
                <div className="customInput">
                  <TextField
                    required
                    id="outlined-required"
                    label="지원 회사"
                    defaultValue=""
                    value={applyCompany}
                    onChange={(e) => setApplyCompany(e.target.value)}
                  />
                </div>
                <div className="customInput">

                  <TextField
                    required
                    id="outlined-required"
                    label="지원 직무"
                    defaultValue=""
                    value={applyPosition}
                    onChange={(e) => setApplyPosition(e.target.value)}
                  />
                </div>

                {/* 자기소개 */}
                <div className="customInput">
                  <TextField
                    id="outlined-textarea"
                    label="자기소개 *"
                    value={introduce}
                    onChange={(e) => setIntroduce(e.target.value)}
                    placeholder="여기에 자기소개를 입력하세요."
                    multiline
                  />
                </div>

                {/* 첫 질문 생성 버튼 */}
                <div className="interview-button">
                  <button onClick={generateFirstBatch} disabled={loading}>
                    {loading ? "불러오는 중..." : "모의 면접 시작"}
                  </button>
                </div>
              </div>
            </div>

            {/* 우측 Q&A 히스토리 */}
            <div className="interview-container-right">
              <div className="interview-gpt-title">모의 면접 질문</div>
              <div
                className="interview-container-right-content"
                ref={scrollContainerRef}
              >
                {/* 이전 Q&A 히스토리 */}
                {answers.map((ans, idx) => (
                  <div key={idx} className="qa-block history-block">
                    <div className="interview-qna-block">
                      <div className="question-block">
                        <p>
                          <strong>질문 {idx + 1}.</strong> {questions[idx]}
                        </p>
                      </div>
                      <div className="answer-block">
                        <p>
                          <strong>답변 {idx + 1}.</strong> {ans}
                        </p>
                      </div>
                    </div>
                    <div className="feedback-block">
                      <p>
                        <strong>총평:</strong> {feedbacks[idx]}
                      </p>
                    </div>
                    <div className="improvements-block">
                      <p>
                        <strong>개선할 점:</strong> {improvementsList[idx]}
                      </p>
                    </div>
                  </div>
                ))}

                {/* 현재 질문 & 입력 & 버튼 */}
                {!loading && currentIndex < questions.length && (
                  <div className="qa-block current-block">
                    {/* 질문 블록 */}
                    <div className="qa-block question-block">
                      <p>
                        <strong>질문 {currentIndex + 1}.</strong>{" "}
                        {questions[currentIndex]}
                      </p>
                    </div>
                    {/* 답변 입력 블록 */}
                    <div className="qa-block answer-block">
                      <TextareaAutosize
                        id="outlined-textarea"
                        label="답변 입력"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="여기에 답변을 입력하세요."
                      />
                    </div>
                    {/* 버튼 블록 */}
                    <div className="qa-block action-block">
                      <button onClick={submitAndNext}>제출 및 평가</button>
                    </div>
                  </div>
                )}

                {/* 추가 질문 생성 버튼 */}
                {!loading &&
                  currentIndex >= questions.length &&
                  questions.length > 0 && (
                    <div className="qa-block action-block">
                      <button onClick={generateMore} disabled={loading}>
                        {loading ? "추가 생성 중..." : "추가 질문 생성"}
                      </button>
                    </div>
                  )}

                {/* 초기 상태 & 로딩 */}
                {!loading && questions.length === 0 && (
                  <p style={{ padding: 20, color: "#666" }}>질문이 없습니다.</p>
                )}
                {loading && <div className="spinner" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Interview;
