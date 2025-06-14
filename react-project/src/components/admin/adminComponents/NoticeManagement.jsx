import React, { useState, useEffect } from 'react';
import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx';
import SearchIcon from '@mui/icons-material/Search';
import '../../../css/admin/adminComponents/NoticeManagement_detail.css';
import NoticeManagementDetail from './NoticeManagement_detail';
import axios from 'axios';
import '../../../css/admin/adminComponents/NoticeManagement.css';

const NoticeManagement = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 10;

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] = useState('create'); // 'create' | 'view'
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = () => {
    axios
      .get('/api/community/list', {
        params: {
          boardType: 'N',
          page: currentPage,
          pageSize,
          search: searchKeyword,
        },
      })
      .then((res) => {
        setNoticeList(res.data.boardList);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => console.error('공지사항 조회 실패', err));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchNotices();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleDeleteSelected = () => {
    alert('삭제 기능은 구현되지 않았습니다.');
  };

  const handleCreate = () => {
    setSelectedNotice(null);
    setDetailMode('create');
    setDetailOpen(true);
  };

  const handleView = (item) => {
    setSelectedNotice(item);
    setDetailMode('view');
    setDetailOpen(true);
  };

  const formatDateTime = (isoStr) => {
    const d = new Date(isoStr);
    const pad = (n) => String(n).padStart(2, '0');
    return {
      date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
    };
  };

  return (
    <div className="noticeManagement">
      <AdminSideBar />
      <div className="notice-content">
        {/* 제목 영역 */}
        <div className="notice-section-title-box">
          <div className="notice-inner-box">
            <h2>커뮤니티 관리</h2>
          </div>
        </div>

        {/* 내용 영역 */}
        <div className="notice-section-content-box">
          <div className="notice-inner-box">
            {/* 헤더: 검색, 삭제, 등록 */}
            <div className="notice-header">
              <h3>공지사항</h3>
              <p className="notice-warning">
                삭제할 경우 복구가 어려우며, JobFolio 이용자에게 해당
                항목이 즉시 비노출됩니다. 삭제 시 신중히 선택 바랍니다.
              </p>

              <div className="notice-controls">
                <div className="notice-left-controls">
                  <button
                    className="notice-button"
                    onClick={handleDeleteSelected}
                  >
                    선택 삭제
                  </button>
                </div>

                <div className="notice-right-controls">
                  <div className="notice-search-group">
                    <input
                      className="community-notice-search-input"
                      type="text"
                      placeholder="검색어를 입력하세요"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button className="notice-button" onClick={handleSearch}>
                      <SearchIcon className="search-icon" />
                      검색
                    </button>
                  </div>

                  <button className="notice-button" onClick={handleCreate}>
                    공지 등록
                  </button>
                </div>
              </div>
            </div>

            {/* 공지사항 테이블 */}
            <table className="notice-table">
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <input type="checkbox" disabled />
                  </th>
                  <th className="col-number">번호</th>
                  <th className="col-title">제목</th>
                  <th className="col-date">작성일</th>
                  <th className="col-priority">우선순위</th>
                  <th className="col-writer">작성자</th>
                </tr>
              </thead>
              <tbody>
                {noticeList.map((item, idx) => {
                  const { date, time } = formatDateTime(item.writeDate);
                  return (
                    <tr key={item.boardNo}>
                      <td className="col-checkbox">
                        <input type="checkbox" disabled />
                      </td>
                      <td className="col-number">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td
                        className="col-title notice-title"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleView(item)}
                      >
                        {item.title}
                      </td>
                      <td className="col-date">
                        <div>{date}</div>
                        <div>{time}</div>
                      </td>
                      <td className="col-priority">{item.priority}</td>
                      <td className="col-writer">{item.authorName}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 페이지네이션 */}
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalCount / pageSize)}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* 상세 모달 */}
      <NoticeManagementDetail
        open={detailOpen}
        mode={detailMode}
        noticeData={selectedNotice}
        onClose={() => setDetailOpen(false)}
        onSaved={() => {
          fetchNotices();
          setDetailOpen(false);
        }}
        onEdit={() => setDetailMode('edit')}
      />
    </div>
  );
};

export default NoticeManagement;
