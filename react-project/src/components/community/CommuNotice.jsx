import '../../css/community/CommuNotice.css';
import { Link } from 'react-router-dom';
import CommuMenuBar from './CommuMenuBar';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import axios from "../../utils/axiosConfig";
import Pagination from '../common/Pagination.jsx';
import Banner from '../common/Banner.jsx';

const CommuNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 페이지가 바뀔 때마다 (검색어/카테고리 상태는 fetchNotices 내부 기본값으로)
  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  // 통합 목록 조회 
  const fetchNotices = ({ page = currentPage, search = searchKeyword } = {}) => {
    const params = {
      boardType: 'N',
      page,
      pageSize,
    };
    if (search.trim()) {
      params.search = search.trim();
    }
    axios.get('/api/community/list', { params })
      .then(res => {
        setPriorityList(res.priorityList);
        setNoticeList(res.boardList);
        setTotalCount(res.totalCount);
      })
      .catch(err => console.error('공지사항 조회 실패', err));
  };

  const formatDate = rawDate => {
    const d = new Date(rawDate);
    return isNaN(d) ? '' : 
      `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  // 탭 클릭
  const handleTabClick = newCategory => {
    setCategory(newCategory);
    setSearchKeyword('');      // 입력창 클리어
    setCurrentPage(1);         // 첫 페이지로
    fetchNotices({ page: 1, search: '' });
  };

  // 검색 실행
  const handleSearch = () => {
    setCurrentPage(1);
    fetchNotices({ page: 1 });
  };

  return (
    <>
      <Banner pageName="공지사항" />
      <CommuMenuBar />

      <div className='community-notice-container'>
        <div className="community-notice-wrapper">

          {/* 탭 */}
          <div className='community-notice-category'>
            <div className='community-notice-tap'>
              <ul className='notice-tap-list'>
                {['all','important','normal'].map(type => (
                  <li key={type}>
                    <button
                      onClick={() => handleTabClick(type)}
                      className={category===type?'active':''}
                    >
                      {type==='all' ? '전체'
                        : type==='important' ? '중요'
                        : '일반'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 검색 */}
            <div className='community-notice-search'>
              <div className="community-notice-search-container">
                <input
                  className='community-notice-search-input'
                  type="text"
                  value={searchKeyword}
                  onChange={e=>setSearchKeyword(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleSearch()}
                />
                <button className="community-notice-search-btn" onClick={handleSearch}>
                  <SearchIcon className='community-notice-search-icon' /> 검색
                </button>
              </div>
            </div>
          </div>

          {/* 리스트 */}
          <div className="community-notice-section">
            <div className="community-notice-head">
              <div className='notice-head-col num'>번호</div>
              <div className='notice-head-col title'>제목</div>
              <div className='notice-head-col write'>작성일</div>
              <div className='notice-head-col author'>작성자</div>
            </div>
            <div className="community-notice-body">
              <ul className="community-notice-list">
                {(category==='all'||category==='important') && priorityList.map(item=>(
                  <li key={item.boardNo} className="community-notice-list-item notice-priority">
                    <Link to={`/community/detail/${item.boardNo}`}>
                      <div className='notice-body-col num'></div>
                      <div className='notice-body-col title'>{item.title}</div>
                      <div className='notice-body-col write'>{formatDate(item.writeDate)}</div>
                      <div className='notice-body-col author'>{item.authorName}</div>
                    </Link>
                  </li>
                ))}
                {(category==='all'||category==='normal') && noticeList.map((item,idx)=>(
                  <li key={item.boardNo} className="community-notice-list-item">
                    <Link to={`/community/detail/${item.boardNo}`}>
                      <div className='notice-body-col num'>
                        { totalCount - ((currentPage-1)*pageSize + idx) }
                      </div>
                      <div className='notice-body-col title'>{item.title}</div>
                      <div className='notice-body-col write'>{formatDate(item.writeDate)}</div>
                      <div className='notice-body-col author'>{item.authorName}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 페이지네이션 */}
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
