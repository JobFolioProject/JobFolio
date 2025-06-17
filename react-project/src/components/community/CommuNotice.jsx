import '../../css/community/CommuNotice.css';
import { Link, NavLink } from 'react-router-dom';
import CommuMenuBar from './CommuMenuBar';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../common/Pagination.jsx';

const CommuNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  const fetchNotices = () => {
    axios.get("/api/community/list", {
      params: {
        boardType: "N",
        page: currentPage,
        pageSize: pageSize,
        search: searchKeyword
      }
    }).then(res => {
      setPriorityList(res.data.priorityList);
      setNoticeList(res.data.boardList);
      setTotalCount(res.data.totalCount);
    }).catch(err => {
      console.error("공지사항 조회 실패", err);
    });
  };

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <>
      <div className="notice-banner">
        <img src="/resources/img/banner.png" alt="Banner" />
        <h1>공지사항</h1>
      </div>
      <CommuMenuBar />
      <div className='community-notice-container'>
        <div className="community-notice-wrapper">
          <div className="communitiy-notice-title">
            <h1>공지사항</h1>
          </div>

          <div className='community-notice-category'>
            <div className='community-notice-tap'>
              <ul className='notice-tap-list'>
                <li><NavLink to="/">전체</NavLink></li>
                <li><NavLink to="/">중요</NavLink></li>
                <li><NavLink to="/">안내</NavLink></li>
              </ul>
            </div>
            <div className='community-notice-search'>
              <div className="community-notice-search-container">
                <input className='community-notice-search-input' type="text" value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setCurrentPage(1);     // 검색은 항상 1페이지부터
                      fetchNotices();        // 검색 실행
                    }
                  }}
                />
                <button
                  className="community-notice-search-btn"
                  onClick={() => {
                    setCurrentPage(1);
                    fetchNotices();
                  }}
                >
                  <SearchIcon className='community-notice-search-icon' />
                  검색
                </button>
              </div>
            </div>
          </div>

          <div className="community-notice-section">
            <div className="community-notice-head">
              <div className='notice-head-col num'>번호</div>
              <div className='notice-head-col title'>제목</div>
              <div className='notice-head-col write'>작성일</div>
              <div className='notice-head-col author'>작성자</div>
            </div>

            <div className="community-notice-body">
              <ul className="community-notice-list">
                {/* 항상 상단에 표시되는 우선순위 글 */}
                {priorityList.map(item => (
                  <li className="community-notice-list-item notice-priority" key={item.boardNo}>
                    <Link to={`/community/detail/${item.boardNo}`}>
                      <div className='notice-body-col num'></div>
                      <div className='notice-body-col title'>{item.title}</div>
                      <div className='notice-body-col write'>{formatDate(item.writeDate)}</div>
                      <div className='notice-body-col author'>{item.authorName}</div>
                    </Link>
                  </li>
                ))}

                {/* 일반글 (페이지네이션 대상) */}
                {noticeList.map((item, index) => (
                  <li className="community-notice-list-item" key={item.boardNo}>
                    <Link to={`/community/detail/${item.boardNo}`}>
                      <div className='notice-body-col num'>
                        {totalCount - ((currentPage - 1) * pageSize + index)}
                      </div>
                      <div className='notice-body-col title'>{item.title}</div>
                      <div className='notice-body-col write'>{formatDate(item.writeDate)}</div>
                      <div className='notice-body-col author'>{item.authorName}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="community-notice-pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommuNotice;