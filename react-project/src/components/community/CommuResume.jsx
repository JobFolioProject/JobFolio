import { useEffect, useState } from 'react';
import '../../css/community/CommuResume.css';
import CommuMenuBar from './CommuMenuBar';
import Pagination from '../common/Pagination.jsx';
import axios from "../../utils/axiosConfig";

const CommuResume = () => {
  const [tempList, setTempList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const totalPages = Math.ceil(tempList.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentTemplates = tempList.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
  const fetchResumes = async () => {
    try {
      const res = await axios.get('/api/resume/selectResume', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          search: '디자인', // 필요 시 동적 상태로 처리
        },
      });

      setTempList(res.boardList);
      console.log(res);
      
    } catch (err) {
      console.error('이력서 게시판 데이터 호출 실패:', err);
    }
  };

  fetchResumes();
}, [currentPage]);

  

  return (
    <>
      <div className="resume-banner">
        <img src="/resources/img/banner.png" alt="Banner" />
        <h1>이력서</h1>
      </div>

      <CommuMenuBar />

      <div className="resume-template-wrapper">
        <h2>이력서 목록</h2>

        {tempList.length === 0 ? (
          <p>선택 가능한 템플릿이 없습니다.</p>
        ) : (
          <div className="resume-template-grid">
            {currentTemplates.map((template) => (
              <div
                id={`resume-template-grid-${template.resume_no}`}
                key={template.resume_no}
                className="template-slide"
              >
                <iframe
                  src={template.resume_file_lopath}
                  title={`템플릿 미리보기 ${template.title}`}
                  className="resume-template-preview-image"
                  width="100%"
                  height="300px"
                ></iframe>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="community-notice-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CommuResume;
