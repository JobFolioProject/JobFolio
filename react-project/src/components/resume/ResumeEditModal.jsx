import { useEffect, useRef, useState } from "react";
import "../../css/resume/ResumeEditModal.css";

const ResumeEditModal = ({ open, onClose, props }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [resumeInfo, setResumeInfo] = useState({
    name: "",
    address: "",
    email: "",
    hp: "",
    desired_position: "",
    link: "",
    education: {},
    career: {},
    skills: {},
    languages: {},
    certifications: {},
    coverLetter: "",
  });
  const [selectedRadio, setSelectedRadio] = useState("");
  const [fixedPath, setFixedPath] = useState(props.fixedPath);
  const iframeRef = useRef(null);

  //html 파일 호출 후 text로 변수에 저장
  useEffect(() => {
    fetch(fixedPath + "example.html")
      .then((res) => res.text())
      .then((html) => setHtmlContent(html));
  }, []);

  // htmlContent에 있는 특정 class별로 변수 set
  useEffect(() => {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const nameDiv = doc.querySelector(".userName");
    const posDiv = doc.querySelector(".desired_position");
    const addressDiv = doc.querySelector(".address");
    const emailDiv = doc.querySelector(".email");
    const hpDiv = doc.querySelector(".hp");
    setResumeInfo({
      name: nameDiv ? nameDiv.innerText : "",
      desired_position: posDiv ? posDiv.innerText : "",
      address: addressDiv ? addressDiv.innerText : "",
      email: emailDiv ? emailDiv.innerText : "",
      hp: hpDiv ? hpDiv.innerText : "",
    });
  }, [htmlContent]);

  // 수정할때마다 실시간으로 iframe에 변경된 사항 적용
  const getPreviewHtml = () => {
    if (!htmlContent) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const nameDiv = doc.querySelector(".userName");
    const posDiv = doc.querySelector(".desired_position");
    const addressDiv = doc.querySelector(".address");
    const emailDiv = doc.querySelector(".email");
    const hpDiv = doc.querySelector(".hp");

    //사용자가 입력한 textarea값을 각각 class 값에 적용

    nameDiv.innerText = resumeInfo.name;
    posDiv.innerText = resumeInfo.desired_position;
    addressDiv.innerText = resumeInfo.address;
    emailDiv.innerText = resumeInfo.email;
    hpDiv.innerText = resumeInfo.hp;

    return doc.documentElement.outerHTML;
  };

  //iframe html적용에 따른 크기 변경
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const resizeIframe = () => {
      try {
        if (
          iframe.contentWindow &&
          iframe.contentWindow.document &&
          iframe.contentWindow.document.body
        ) {
          const contentHeight = iframe.contentWindow.document.body.scrollHeight;
          iframe.style.height = contentHeight + "px";
        }
      } catch (e) {}
    };
    iframe.addEventListener("load", resizeIframe);
    return () => {
      iframe.removeEventListener("load", resizeIframe);
    };
  }, [resumeInfo, htmlContent]);

  const toggleRadio = (event) => {
    setSelectedRadio(event.target.id);
  };

  if (!open) return null;
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <iframe
          className="htmlContent"
          ref={iframeRef}
          srcDoc={getPreviewHtml()}
        ></iframe>
        <label>
          <div>
            <span>이름</span>
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={resumeInfo.name}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  name: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>희망직무</span>
          </div>
          <div>
            <input
              type="text"
              name="position"
              value={resumeInfo.desired_position}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  desired_position: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>주소</span>
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={resumeInfo.address}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  address: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>이메일</span>
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={resumeInfo.email}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  email: e.target.value,
                });
              }}
            />
          </div>
        </label>
        <label>
          <div>
            <span>전화번호</span>
          </div>
          <div>
            <input
              type="text"
              name="phoneNum"
              value={resumeInfo.hp}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  hp: e.target.value,
                });
              }}
            />
          </div>
        </label>

        <label>
          <div>
            <span>변경 필드 선택</span>
          </div>
          <div className="checkbox_list">
            <input type="radio" name="list" id="link" onChange={toggleRadio} />
            <label htmlFor="link">링크</label>

            <input type="radio" name="list" id="edu" onChange={toggleRadio} />
            <label htmlFor="edu">경력</label>
            <input
              type="radio"
              name="list"
              id="career"
              onChange={toggleRadio}
            />
            <label htmlFor="career">학력</label>
            <input type="radio" name="list" id="skill" onChange={toggleRadio} />
            <label htmlFor="skill">기술스택</label>
            <input
              type="radio"
              name="list"
              id="language"
              onChange={toggleRadio}
            />
            <label htmlFor="language">외국어 역량</label>
            <input
              type="radio"
              name="list"
              id="certification"
              onChange={toggleRadio}
            />
            <label htmlFor="certification">자격증</label>
            <input
              type="radio"
              name="list"
              id="cover_letter"
              onChange={toggleRadio}
            />
            <label htmlFor="cover_letter">자기소개서</label>
          </div>
        </label>

        {selectedRadio === "link" && (
          <div className="toggleInput">
            <input
              type="text"
              placeholder="링크를 입력하세요"
              value={resumeInfo.link}
              onChange={(e) => {
                setResumeInfo({
                  ...resumeInfo,
                  link: e.target.value,
                });
              }}
            />
          </div>
        )}

        <div className="buttonRow">
          <button className="secondaryBtn">수정 사항 저장</button>
          <button className="modal-close secondaryBtn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditModal;
