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
              <div key={template.resume_no}>
                <div className="template-slide">
                    <iframe
                    srcDoc={template.html}
                    title={`템플릿 미리보기 ${template.title}`}
                    className="resume-template-preview-image"
                    width="100%"
                    height="300px"
                    ></iframe>
                </div>
                <div className='resume-template-data'>
                    <table>
                        <thead>
                            <td>{template.title.length > 8
                                ? template.title.slice(0, 7) + '...'
                                : template.title}
                            </td>
                            <td className='right'>{template.user_name}</td>
                        </thead>
                        <tr>
                            <td>{template.desired_position.length > 8
                                ? template.desired_position.slice(0, 7) + '...'
                                : template.desired_position}
                            </td>
                            <td className='right'>
                                {template.create_date?.split('.')[0].slice(0, 16) || '날짜없음'}
                            </td>
                        </tr>
                    </table>
                </div>
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
