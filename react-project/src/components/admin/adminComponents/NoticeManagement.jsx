import React, { useState, useEffect } from 'react';
import AdminSideBar from '../AdminSideBar';
import Pagination from '../../common/Pagination.jsx';
import SearchIcon from '@mui/icons-material/Search';
import '../../../css/admin/adminComponents/NoticeManagement_detail.css';
import NoticeManagementDetail from './NoticeManagement_detail';
import axios from 'axios';
import '../../../css/admin/adminComponents/NoticeManagement.css';

const NoticeManagement = () => {
  // 공지사항 관련 상태
  const [noticeList, setNoticeList] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [allCheckedPinned, setAllCheckedPinned] = useState(false);
  const [checkedPinned, setCheckedPinned] = useState([]);

  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const pageSize = 10;

  // 상세 보기 모달 상태
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailMode, setDetailMode] = useState('create');
  const [selectedNotice, setSelectedNotice] = useState(null);

  // 페이지 변경 시 공지사항 목록 조회
  useEffect(() => {
    fetchNotices();
  }, [currentPage]);

  // 공지사항 및 고정 공지사항 데이터 조회
  const fetchNotices = () => {
    axios.get('/api/community/list', {
      params: {
        boardType: 'N',
        page: currentPage,
        pageSize,
        search: searchKeyword,
      },
    })
      .then((res) => {
        setPriorityList(res.data.priorityList || []);
        setNoticeList(res.data.boardList || []);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => console.error('공지사항 조회 실패', err));
  };

  // 검색 버튼 클릭
  const handleSearch = () => {
    setCurrentPage(1);
    fetchNotices();
  };

  // Enter 키로 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // 일괄 삭제 버튼
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 항목을 선택하세요.');
      return;
    }

    const confirmed = window.confirm('정말로 선택된 공지사항을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await axios.post('/api/admin/community/delete', selectedIds, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('삭제가 완료되었습니다.');
      setSelectedIds([]);
      fetchNotices();
    } catch (err) {
      console.error('삭제 실패', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  // 공지 등록 버튼 클릭
  const handleCreate = () => {
    setSelectedNotice(null);
    setDetailMode('create');
    setDetailOpen(true);
  };

  // 공지 상세 보기 클릭
  const handleView = (item) => {
    setSelectedNotice(item);
    setDetailMode('view');
    setDetailOpen(true);
  };

  // 일반 공지사항 선택 토글
  const handleSelect = (boardNo) => {
    setSelectedIds((prev) =>
      prev.includes(boardNo)
        ? prev.filter((id) => id !== boardNo)
        : [...prev, boardNo]
    );
  };

  // 전체 선택 토글
  const handleSelectAll = () => {
    if (!noticeList.length) return;
    const allIds = noticeList.map((item) => item.boardNo);
    setSelectedIds((prev) =>
      prev.length === noticeList.length ? [] : allIds
    );
  };

  // 고정 공지 전체 선택 토글
  const handleToggleAllPinned = () => {
    if (allCheckedPinned) {
      setCheckedPinned([]);
    } else {
      const allBoardNos = priorityList.map((item) => item.boardNo);
      setCheckedPinned(allBoardNos);
    }
    setAllCheckedPinned(!allCheckedPinned);
  };

  // 고정 공지 전체 선택 여부 확인
  useEffect(() => {
    const allChecked =
      priorityList.length > 0 &&
      priorityList.every((item) => checkedPinned.includes(item.boardNo));
    setAllCheckedPinned(allChecked);
  }, [checkedPinned, priorityList]);

  // 선택한 일반 공지를 고정 처리
  const handleFixPriority = () => {
    if (selectedIds.length === 0) {
      alert("선택된 항목이 없습니다.");
      return;
    }

    const maxPriority = priorityList.length > 0 ? Math.max(...priorityList.map(item => item.priority)) : 0;
    const updateList = selectedIds.map((id, idx) => ({
      boardNo: id,
      priority: maxPriority + idx + 1
    }));

    axios.post('/api/admin/community/updatePriorityBatch', updateList)
      .then(() => {
        alert('선택된 공지사항이 상단 고정되었습니다.');
        fetchNotices();
        setSelectedIds([]);
      })
      .catch((err) => {
        console.error('우선순위 고정 실패', err);
        alert('고정 처리 중 오류가 발생했습니다.');
      });
  };

  // 고정 공지 체크박스 개별 처리
  const handlePinnedCheck = (boardNo) => {
    setCheckedPinned((prev) =>
      prev.includes(boardNo)
        ? prev.filter((no) => no !== boardNo)
        : [...prev, boardNo]
    );
  };

  // 선택된 고정 공지 해제
  const handleUnpinSelected = async () => {
    if (checkedPinned.length === 0) {
      alert('선택된 고정 공지가 없습니다.');
      return;
    }

    try {
      await axios.post('/api/admin/community/unpin', checkedPinned.map(Number), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('고정이 해제되었습니다.');
      setCheckedPinned([]);
      fetchNotices();
    } catch (err) {
      console.error('고정 해제 실패', err);
      alert('고정 해제 중 오류 발생');
    }
  };

  // 고정 공지 우선순위 스왑 처리
  const handlePriorityChange = async (item, direction) => {
    const idx = sortedPriorityList.findIndex(i => i.boardNo === item.boardNo);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sortedPriorityList.length - 1)) return;

    const swapWith = sortedPriorityList[direction === 'up' ? idx - 1 : idx + 1];

    try {
      await axios.post('/api/admin/community/swapPriority', {
        boardNo1: item.boardNo,
        boardNo2: swapWith.boardNo
      });
      fetchNotices();
    } catch (err) {
      console.error('우선순위 스왑 실패', err);
      alert('우선순위 변경 중 오류가 발생했습니다.');
    }
  };

  // 우선순위 정렬
  const sortedPriorityList = [...priorityList].sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return new Date(b.writeDate) - new Date(a.writeDate);
  });

  // 가장 위 고정 공지 확인
  const topFixedBoardNo = sortedPriorityList.length > 0 ? sortedPriorityList[0].boardNo : null;

  // 날짜 포맷 함수
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
      {/* 관리자 사이드바 */}
      <AdminSideBar />
      <div className="notice-content">
        {/* 상단 안내 영역 */}
        <div className="notice-section-title-box">
          <div className="notice-inner-box">
            <h2>커뮤니티 관리</h2>
            <p className="notice-warning">
              삭제할 경우 복구가 어려우며, JobFolio 이용자에게 해당 항목이 즉시 비노출됩니다. 삭제 시 신중히 선택 바랍니다.
            </p>
          </div>
        </div>

        {/* 고정 공지 영역 */}
        <div className="notice-section-content-box">
          <div className="notice-inner-box">
            {/* 고정 공지 헤더 */}
            <div className="notice-header">
              <h3>고정 공지사항</h3>
              <div className="notice-controls">
                <div className="notice-left-controls">
                  <button className="notice-button" onClick={handleDeleteSelected} disabled={checkedPinned.length === 0}>선택 삭제</button>
                  <button className="notice-button" onClick={handleUnpinSelected} disabled={checkedPinned.length === 0}>고정 해제</button>
                </div>
              </div>
            </div>

            {/* 고정 공지 리스트 */}
            {priorityList.length > 0 && (
              <table className="notice-table notice-table-pinned">
                <thead>
                  <tr>
                    <th className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={allCheckedPinned}
                        onChange={handleToggleAllPinned}
                      />
                    </th>
                    <th className="col-title">제목</th>
                    <th className="col-date">작성일</th>
                    <th className="col-writer">작성자</th>
                    <th className="col-priority">우선순위</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityList.map((item) => {
                    const { date, time } = formatDateTime(item.writeDate);
                    return (
                      <tr key={item.boardNo} className="pinned-row">
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={checkedPinned.includes(item.boardNo)}
                            onChange={() => handlePinnedCheck(item.boardNo)}
                          />
                        </td>
                        <td className="col-title notice-title" style={{ cursor: 'pointer' }} onClick={() => handleView(item)}>
                          {item.title}
                        </td>
                        <td className="col-date">
                          <div>{date}</div>
                          <div>{time}</div>
                        </td>
                        <td className="col-writer">{item.authorName}</td>
                        <td className="col-priority">
                          <button
                            onClick={() => handlePriorityChange(item, 'up')}
                            disabled={item.boardNo === topFixedBoardNo}
                          >▲</button>
                          <button onClick={() => handlePriorityChange(item, 'down')}>▼</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 일반 공지 영역 */}
        <div className="notice-section-content-box">
          <div className="notice-inner-box">
            <div className="notice-header">
              <h3>공지사항</h3>
              <div className="notice-controls">
                <div className="notice-left-controls">
                  <button className="notice-button" onClick={handleDeleteSelected} disabled={selectedIds.length === 0}>선택 삭제</button>
                  <button className="notice-button" onClick={handleFixPriority} disabled={selectedIds.length === 0}>선택 고정</button>
                </div>
                <div className="notice-right-controls">
                  {/* 검색창 */}
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
                  {/* 공지 등록 버튼 */}
                  <button className="notice-button" onClick={handleCreate}>공지 등록</button>
                </div>
              </div>
            </div>

            {/* 일반 공지 리스트 */}
            <table className="notice-table">
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === noticeList.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="col-number">번호</th>
                  <th className="col-title">제목</th>
                  <th className="col-date">작성일</th>
                  <th className="col-writer">작성자</th>
                </tr>
              </thead>
              <tbody>
                {noticeList.length > 0 ? (
                  noticeList.map((item, idx) => {
                    const { date, time } = formatDateTime(item.writeDate);
                    return (
                      <tr key={item.boardNo}>
                        <td className="col-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.boardNo)}
                            onChange={() => handleSelect(item.boardNo)}
                          />
                        </td>
                        <td className="col-number">{totalCount - ((currentPage - 1) * pageSize + idx)}</td>
                        <td className="col-title notice-title" style={{ cursor: 'pointer' }} onClick={() => handleView(item)}>
                          {item.title}
                        </td>
                        <td className="col-date">
                          <div>{date}</div>
                          <div>{time}</div>
                        </td>
                        <td className="col-writer">{item.authorName}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="notice-empty-row">조회된 공지사항이 없습니다.</td>
                  </tr>
                )}
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

      {/* 상세 모달 컴포넌트 */}
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
