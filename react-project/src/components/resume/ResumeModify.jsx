import { useEffect, useRef, useState } from "react";
import "../../css/resume/ResumeModify.css";
import ResumeSidebar from "./ResumeSidebar";
import ResumeEditModal from "./ResumeEditModal";

const ResumeModify = () => {
  const [fixedPath, setFixedPath] = useState("/resources/html/");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const getAiComment = () => {
    alert("AI COMMENT");
  };

  const handleOpenModal = () => setIsEditModalOpen(true);
  const handleCloseModal = () => setIsEditModalOpen(false);

  return (
    <>
      <div className="resume-banner">
        <img src="/resources/img/banner.png" alt="Banner" />
      </div>
      <div className="resume_wrap">
        <ResumeSidebar />
        <div className="resumeContent">
          <div className="resumeModifyPart">
            <div>
              <h2 className="title">이력서 수정</h2>
            </div>
            <iframe ref={iframeRef} src={fixedPath + "example.html"} />
          </div>
          <div className="buttonRow">
            <button className="primaryBtn" onClick={handleOpenModal}>
              이력서 수정
            </button>
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
            <button className="secondaryBtn" onClick={getAiComment}>
              AI comment
            </button>
            <button className="primaryBtn">저장</button>
          </div>
        </div>
      </div>

      <ResumeEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        props={{
          fixedPath,
        }}
      ></ResumeEditModal>
    </>
  );
};

export default ResumeModify;
