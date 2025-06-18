import '../../../css/admin/adminComponents/ResumeManagement.css';
import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx'; 
import { useState, useEffect } from 'react';
import axios from "../../../utils/axiosConfig";

const ResumeManagement = () => {
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
      console.log(res);

        // HTML 파일 내용을 개별 fetch
        const withHtml = await Promise.all(
          res.boardList.map(async (item) => {
            const filePath = `http://localhost:80${item.resume_file_pypath.replace(/^.*?resume_output/, '/resumes').replace(/\\/g, '/')}`;
            try {
              const htmlRes = await fetch(filePath);
              const htmlText = await htmlRes.text();
              return { ...item, html: htmlText };
            } catch (e) {
              return { ...item, html: `<p>불러오기 실패</p>` };
            }
          })
        );

        setTempList(withHtml);
      
    } catch (err) {
      console.error('이력서 게시판 데이터 호출 실패:', err);
    }
  };

  fetchResumes();
}, [currentPage]);
   
    return (
    <div className='resumeManagement'>
    <AdminSideBar/>

    <div className="resume-template-wrapper">
        <h2>이력서 목록</h2>

        {tempList.length === 0 ? (
          <p>선택 가능한 템플릿이 없습니다.</p>
        ) : (
            <>
          <div className="resume-template-grid">
            {currentTemplates.map((template) => (
            
              <div
                id={`resume-template-grid-${template.resume_no}`}
                key={template.resume_no}
                className="resume-card-wrapper"
              >
                <div className="template-slide">
                <iframe
                  srcDoc={template.html}
                  title={`템플릿 미리보기 ${template.title}`}
                  className="resume-template-preview-image"
                  width="100%"
                  height="300px"
                ></iframe>
                </div>

                 <div className="resume-info-box">
                    <p><strong>이력서 번호:</strong> {template.resume_no}</p>
                    <p><strong>제목:</strong> {template.title}</p>
                    <p><strong>작성일:</strong> {template.create_date.slice(0,16)}</p>
                    <p><strong>작성자:</strong> {template.user_name}</p>
                </div>
              </div>
            ))}
          </div> 
            </>
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
      </div>
    );
};

export default ResumeManagement;