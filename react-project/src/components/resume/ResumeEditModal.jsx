import { useEffect, useRef, useState } from "react";
import "../../css/resume/ResumeEditModal.css";

const ResumeEditModal = ({ open, onClose, props }) => {
  const [htmlContent, setHtmlContent] = useState("");
  const [profileText, setProfileText] = useState("");
  const [careerText, setCareerText] = useState("");
  const [fixedPath, setFixedPath] = useState(props.fixedPath);
  const iframeRef = useRef(null);

  //html 파일 호출 후 text로 변수에 저장
  useEffect(() => {
    fetch(fixedPath + "test.html")
      .then((res) => res.text())
      .then((html) => setHtmlContent(html));
  }, []);

  // htmlContent에 있는 특정 class별로 변수 set
  useEffect(() => {
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const profileDiv = doc.querySelector(".profile");
    setProfileText(profileDiv?.innerText || "");
  }, [htmlContent]);

  // 수정할때마다 실시간으로 iframe에 변경된 사항 적용
  const getPreviewHtml = () => {
    if (!htmlContent) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const profileDiv = doc.querySelector(".profile");
    // const careerDiv = doc.querySelector(".section-content.career");

    //사용자가 입력한 textarea값을 각각 class 값에 적용

    profileDiv.innerText = profileText;
    // careerDiv.innerText = careerText;

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
  }, [profileText, htmlContent]);

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
            <input type="text" name="title" />
          </div>
        </label>
        <label>
          <div>
            <span>주소</span>
          </div>
          <div>
            <input type="text" name="address" />
          </div>
        </label>
        <label>
          <div>
            <span>이메일</span>
          </div>
          <div>
            <input type="email" name="email" />
          </div>
        </label>
        <label>
          <div>
            <span>전화번호</span>
          </div>
          <div>
            <input type="email" name="phoneNum" />
          </div>
        </label>

        {/* <textarea
          className="profileInput"
          value={profileText}
          onChange={(e) => setProfileText(e.target.value)}
        ></textarea> */}

        <button>수정 사항 저장</button>
        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ResumeEditModal;
