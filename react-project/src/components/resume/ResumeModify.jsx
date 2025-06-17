import { useEffect, useRef, useState } from "react";
import "../../css/resume/ResumeModify.css";
import ResumeSidebar from "./ResumeSidebar";
import ResumeEditModal from "./ResumeEditModal";
import FavoriteIcon from "@mui/icons-material/FavoriteBorder";
import axios from "../../utils/axiosConfig";
import { useAuth } from '../../context/AuthContext';

const ResumeModify = () => {
  const [resumeList, setResumeList] = useState([]);
  const [htmlString, setHtmlString] = useState("");
  const [showDetailResume, setShowDetailResume] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const iframeRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  //이력서 리스트 출력
  const getResumeList = async () => {


    const userNo = user.userNo;
    if (!userNo) return;

    await axios
      .post("/api/resume/resumeDetail", { userNo: userNo })
      .then((res) => {
        console.log(res);
        const { resumeList } = res;
        if (Array.isArray(resumeList) && resumeList.length > 0) {
          setResumeList(resumeList);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //해당 이력서 상세 정보 렌더링
  const openResumeDetail = async (resumeFilePath) => {
    console.log(resumeFilePath);
    await axios
      .get("/resume/selectOneResume", {
        params: {
          resume_file_path: resumeFilePath,
        },
      })
      .then((res) => {
        setHtmlString(res.data);
        setShowDetailResume(true);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 이력서 목록으로 돌아가기
  const showList = () => {
    setShowDetailResume(false);
  };

  useEffect(() => {
    getResumeList();
  }, []);

  //iframe html파일 크기에 맞춰 출력
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

  const handleOpenModal = () => setIsEditModalOpen(true);
  const handleCloseModal = () => setIsEditModalOpen(false);

  return (
    <>
      <div className="resume-banner">
        <img src="/resources/img/banner.png" alt="Banner" />
      </div>
      <div className="resume_wrap">
        <ResumeSidebar />

        {!showDetailResume && (
          <div className="resumeList">
            {resumeList.map((item) => (
              <div key={item.resume_no} className="resumeEachItem">
                <div className="resumeItemContent">
                  <div className="resumeItemTitle">
                    <h3
                      onClick={() => openResumeDetail(item.resume_file_pypath)}
                    >
                      {item.title || "제목 없음"}
                    </h3>
                    <FavoriteIcon className="likeIcon"></FavoriteIcon>
                  </div>
                  <div className="resumeItemDetail">
                    <p className="resumeItemJob">
                      {item.desired_position || "희망 직무 없음"}
                    </p>
                    <p className="resumeItemDate">
                      {item.resume_file_name || "날짜 정보 없음"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {showDetailResume && (
          <div className="resumeContent">
            <div className="resumeModifyPart">
              <div>
                <h2 className="title">이력서 수정</h2>
              </div>
              <iframe ref={iframeRef} srcDoc={htmlString} />
            </div>
            <div className="buttonRow">
              <button className="primaryBtn" onClick={showList}>
                목록보기
              </button>
              <button className="primaryBtn" onClick={handleOpenModal}>
                이력서 수정
              </button>
            </div>
          </div>
        )}
      </div>

      <ResumeEditModal
        open={isEditModalOpen}
        onClose={handleCloseModal}
        htmlString={htmlString}
      ></ResumeEditModal>
    </>
  );
};

export default ResumeModify;
