import '../../../css/admin/adminComponents/ResumeManagement.css';
import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx';
import { useState, useEffect } from 'react';
import axios from '../../../utils/axiosConfig';
import { Select, MenuItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ResumeManagement = () => {
    const [tempList, setTempList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selected, setSelected] = useState([]);
    const [searchField, setSearchField] = useState('title');
    const [searchTerm, setSearchTerm] = useState('');
    const pageSize = 12;

    const totalPages = Math.ceil(tempList.length / pageSize);
    const startIdx = (currentPage - 1) * pageSize;
    const currentTemplates = tempList.slice(startIdx, startIdx + pageSize);


  const handleToggleSelect = (resumeNo) => {
    setSelected((prev) =>
      prev.includes(resumeNo)
        ? prev.filter((id) => id !== resumeNo)
        : [...prev, resumeNo]
    );
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) {
      alert("삭제할 항목 선택해라");
      return;
    }

    if (!window.confirm("삭제할? 되돌리기 x")) return;

    axios.post('/api/resume/deleteSelectedResume', selected)
      .then(() => {
        return axios.get('/api/resume/selectResume', {
          params: {
            page: currentPage,
            pageSize: pageSize,
            search: '디자인',
          },
        });
      })
      .then(async (res) => {
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
        setSelected([]);
      })
      .catch((err) => {
        console.error('이력서 게시판 데이터 호출 실패:', err);
        alert("오류 오류 오류 ");
      });
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await axios.get('/api/resume/selectResume', {
          params: {
            page: currentPage,
            pageSize: pageSize,
            searchField: searchField,
            search: searchTerm,
          },
        });

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
        };


        setTempList(withHtml);
      } catch (err) {
        console.error('이력서 게시판 데이터 호출 실패:', err);
      }
    };

    fetchResumes();
  }, [currentPage, searchTerm, searchField]);

  const openResumePopup = (physicalPath) => {
    const path = physicalPath.replace(/^.*?resume_output/, '/resumes').replace(/\\/g, '/');
    const url = `http://localhost:80${path}`;
    window.open(url, '_blank', 'width=900,height=700');
  };

  const handleStatusChange = (resumeNo, newStatus) => {
    axios.post('/api/resume/updateResumeStatus', {
      resume_no: resumeNo,
      status_yn: newStatus,
    })
      .then(() => {
        return axios.get('/api/resume/adminSelectResumeInfo', {
          params : {
            page : currentPage,
            pageSize : pageSize,
            searchField : searchField,
            search : searchTerm,
            admin: true
          },
        });
      })
      .then(async (res) => {
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
      })
      .catch((err) => {
        console.error('이력서 게시판 데이터 호출 실패:', err);
        alert("오류 오류 오류 ");
      });
  };

  return (
    <div className='resumeManagement'>
      <AdminSideBar />
      <div className='info-content'>
        <div className='info-section-title-box'>
          <h2>커뮤니티 관리</h2>
        </div>

        <div className='info-section-content-box'>
          <div className='info-header'>
            <h3>이력서</h3>
            <p className='info-warning'>
              삭제할 경우 복구가 어려우며, JobFolio 이용자에게 해당 항목이 즉시 비노출됩니다. 삭제 시 신중히 선택 바랍니다.
            </p>
            <div className='info-controls search-bar'>
              <div className="search-group">
                <select
                  className="search-select"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                >
                  <option value="title">제목</option>
                  <option value="user_name">작성자</option>
                  <option value="resume_no">이력서 번호</option>
                </select>

                <input
                  className="search-input"
                  type="text"
                  placeholder="검색어 입력"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <button onClick={() => setCurrentPage(1)}>검색</button>
              </div>
              <button onClick={handleDeleteSelected}>선택 삭제</button>
            </div>
          </div>
        </div>

        <div className="resume-template-wrapper">
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
                    <div
                      className="template-slide"
                      onClick={() => openResumePopup(template.resume_file_pypath)}
                    >
                      <input
                        type="checkbox"
                        className='resume-select-checkbox'
                        checked={selected.includes(template.resume_no)}
                        onChange={() => handleToggleSelect(template.resume_no)}
                      />
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
                      <p><strong>작성일:</strong> {template.create_date ? template.create_date.slice(0, 16) : '날짜 없음'}</p>
                      <p><strong>작성자:</strong> {template.user_name}</p>

                      <div className='status-select-container'>
                        <Select
                          className='input-status-select'
                          value={template.status_yn ?? "N"}
                          onChange={(e) => handleStatusChange(template.resume_no, e.target.value)}
                        >
                          <MenuItem value="N"><VisibilityIcon /> 노출</MenuItem>
                          <MenuItem value="Y"><VisibilityOffIcon /> 숨김</MenuItem>
                        </Select>
                      </div>
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
    </div>
  );
        
};

export default ResumeManagement;
