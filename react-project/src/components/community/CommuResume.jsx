import { useEffect, useState } from 'react';
import '../../css/community/CommuResume.css';
import CommuMenuBar from './CommuMenuBar';
import Pagination from '../common/Pagination.jsx';
import axios from "../../utils/axiosConfig";
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Banner from '../common/Banner.jsx';

const CommuResume = () => {

  const [tempList, setTempList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const totalPages = Math.ceil(tempList.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentTemplates = tempList.slice(startIdx, startIdx + pageSize);
  const { user, isAuthenticated } = useAuth();


  // 이력서 불러오기
  const fetchResumes = async () => {
    try {
      const userNo = user.userNo
      if (!userNo) return;

      const res = await axios.get('/api/resume/selectResume', {
        params: {
          page: currentPage,
          pageSize: pageSize,
          user_no: user.userNo
        },

      });
      console.log(res);

      // HTML 파일 내용을 개별 fetch
      const list = Array.isArray(res.boardList) ? res.boardList : [];
      const withHtml = await Promise.all(
        list.map(async (item) => {
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
      console.log(withHtml);
      
      
    } catch (err) {
      console.error('이력서 게시판 데이터 호출 실패:', err);
    }
  };

  useEffect(() => {

    fetchResumes();

  }, [currentPage, user]);

  // 이력서 좋아요
  const resumeLike = async (resume_no) => {
    try {
      const userNo = user.userNo
      if (!userNo) return;

      const res = await axios.post('/api/resume/likeResume', {
        resumeNo: resume_no,
        userNo: user.userNo
      });
      console.log(res);
    } catch (err) {
      console.error('게시물 좋아요 실패:', err);
    }
    fetchResumes();
  }

  // 이력서 좋아요 취소
  const resumeUnLike = async (resume_no) => {
    try {
      const userNo = user.userNo
      if (!userNo) return;

      const res = await axios.post('/api/resume/unlikeResume', {
        resumeNo: resume_no,
        userNo: user.userNo
      });
      console.log(res);
    } catch (err) {
      console.error('게시물 좋아요 실패:', err);
    }
    fetchResumes();
  }

  // 팝업 열기 유틸
  const openResumePopup = (physicalPath) => {
    const path = physicalPath
      .replace(/^.*?resume_output/, '/resumes')
      .replace(/\\/g, '/');
    const url = `http://localhost:80${path}`;
    window.open(url, '_blank', 'width=900,height=700');
  };

  // hover이벤트 추가
  const handleMouseEnterIcon = (e) => {
    e.currentTarget.closest('.template-view-wrapper')?.classList.add('no-hover');
  };

  const handleMouseLeaveIcon = (e) => {
    e.currentTarget.closest('.template-view-wrapper')?.classList.remove('no-hover');
  };

  return (
    <div className='CommuResume'>
      <Banner pageName="이력서" />

      <CommuMenuBar />
      <div className="resume-template-wrapper">
        <h2>이력서 목록</h2>

        {tempList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <CircularProgress />
            <p>로딩 중입니다...</p>
          </div>
        ) : (
          <div className="resume-template-grid">
            {currentTemplates.map((template) => (
              <div key={template.resume_no} className="template-view-wrapper">
                <div className="like-count">
                  {template.like_count}
                </div>
                <FavoriteIcon
                  className="likeIcon"
                  color={template.resume_liked === 1 ? 'error' : 'inherit'}
                  onClick={(e) => {
                    e.stopPropagation();
                    template.resume_liked === 0
                      ? resumeLike(template.resume_no)
                      : resumeUnLike(template.resume_no);
                  }}
                  onMouseEnter={handleMouseEnterIcon}
                  onMouseLeave={handleMouseLeaveIcon}
                ></FavoriteIcon>
                <div className="template-slide" onClick={() => openResumePopup(template.resume_file_pypath)}>
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
                      <tr>
                        <td>
                          {(template.title ?? '').length > 8
                            ? (template.title ?? '').slice(0, 7) + '...'
                            : (template.title ?? '')}
                        </td>
                        <td className='right'>{template.user_name}</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {(template.desired_position ?? '').length > 8
                            ? (template.desired_position ?? '').slice(0, 7) + '...'
                            : (template.desired_position ?? '')}
                        </td>
                        <td className='right'>
                          {template.create_date?.split('.')[0].slice(0, 16) || '날짜없음'}
                        </td>
                      </tr>
                    </tbody>
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
    </div>
  );
};

export default CommuResume;
