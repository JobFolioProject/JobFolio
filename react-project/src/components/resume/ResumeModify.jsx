import { useEffect, useRef, useState } from "react";
import "../../css/resume/ResumeModify.css";
import ResumeSidebar from "./ResumeSidebar";

const ResumeModify = () => {
  const [aiComment, setAiComment] = useState({});
  const [fixedPath, setFixedPath] = useState("/resources/html/");
  const [profileText, setProfileText] = useState("");

  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const onLoad = () => {
      if (iframe.contentWindow && iframe.contentWindow.document.body) {
        iframe.style.height =
          iframe.contentWindow.document.body.scrollHeight + "px";
      }
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, []);

  // useEffect(() => {
  //   async function fetchAndExtract() {
  //     const res = await fetch(fixedPath + "example.html");
  //     const htmlString = await res.text();

  //     const parser = new window.DOMParser();
  //     const doc = parser.parseFromString(htmlString, "text/html");

  //     const profileDiv = doc.querySelector(".section-content.profile");
  //     if (profileDiv) {
  //     }
  //   }
  // }, []);

  return (
    <div>
      <ResumeSidebar/>
      <div className="resume">
        <div className="resumeContent">
          <h2 className="title">이력서 수정</h2>
          <iframe ref={iframeRef} src={fixedPath + "example.html"} />
          <div className="buttonRow">
            <button className="primaryBtn">이력서 수정</button>
          </div>
          <div className="aiSection">
            <h2 className="aiTitle">AI Comment</h2>
            <textarea
              className="aiInput"
              rows={4}
              placeholder="AI 코멘트를 확인하세요"
            />
          </div>
          <div className="buttonRow">
            <button className="secondaryBtn">AI comment</button>
            <button className="primaryBtn">저장</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModify;
