import '../../../css/admin/adminComponents/NoticeManagement.css';
import AdminSideBar from '../AdminSideBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../../common/Pagination.jsx';
import SearchIcon from '@mui/icons-material/Search';

const NoticeManagement = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = () => {
    axios
      .get('/community/list', {
        params: {
          boardType: 'N',
          page: currentPage,
          pageSize: pageSize,
          search: searchKeyword,
        },
      })
      .then((res) => {
        setNoticeList(res.data.boardList);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => {
        console.error('공지사항 조회 실패', err);
      });
  };

  const handleDeleteSelected = () => {
    alert('삭제 기능은 구현되지 않았습니다.');
  };

  const openNewPostModal = () => {
    alert('게시글 등록 기능은 구현되지 않았습니다.');
  };

  const formatDateTime = (isoStr) => {
    const dateObj = new Date(isoStr);
    const pad = (num) => String(num).padStart(2, '0');
    const date = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}`;
    const time = `${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    return { date, time };
  };

  return (
    <div className="noticeManagement">
      <AdminSideBar />
      <div className="notice-content">
        <div className="notice-section-title-box">
          <div className="notice-inner-box">
            <h2>커뮤니티 관리</h2>
          </div>
        </div>

        <div className="notice-section-content-box">
          <div className="notice-inner-box">
            <div className="notice-header">
              <h3>공지사항</h3>
              <p className="notice-warning">
                삭제할 경우 복구가 어려우며, JobFolio 이용자에게 해당 항목이 즉시 비노출됩니다. 삭제 시 신중히 선택 바랍니다.
              </p>

              <div className="notice-controls">
                <div className="notice-left-controls">
                  <button className="notice-button" onClick={handleDeleteSelected}>선택 삭제</button>
                </div>
                <div className="notice-right-controls">
                  <div className="notice-search-group">
                    <input
                      className="community-notice-search-input"
                      type="text"
                      placeholder="검색어를 입력하세요"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setCurrentPage(1);
                          fetchNotices();
                        }
                      }}
                    />
                    <button
                      className="notice-button"
                      onClick={() => {
                        setCurrentPage(1);
                        fetchNotices();
                      }}
                    >
                      <SearchIcon className="search-icon" />
                      검색
                    </button>
                  </div>
                  <button className="notice-button" onClick={openNewPostModal}>공지 등록</button>
                </div>
              </div>
            </div>

            <table className="notice-table">
              <thead>
                <tr>
                  <th className="col-checkbox"><input type="checkbox" disabled /></th>
                  <th className="col-number">번호</th>
                  <th className="col-title">제목</th>
                  <th className="col-date">작성일</th>
                  <th className="col-priority">우선순위</th>
                  <th className="col-writer">작성자</th>
                </tr>
              </thead>
              <tbody>
                {noticeList.map((item, index) => {
                  const { date, time } = formatDateTime(item.writeDate);
                  return (
                    <tr key={item.boardNo}>
                      <td className="col-checkbox"><input type="checkbox" disabled /></td>
                      <td className="col-number">{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className="col-title notice-title">{item.title}</td>
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

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeManagement;
