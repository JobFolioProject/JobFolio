import "../../css/community/CommuNotice.css";
import { Link } from "react-router-dom";
import CommuMenuBar from "./CommuMenuBar";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import axios from "../../utils/axiosConfig";
import Pagination from "../common/Pagination.jsx";
import Banner from "../common/Banner.jsx";

const CommuNotice = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchCategory, setSearchCategory] = useState("titleContent");
  const [category, setCategory] = useState("all");
  const pageSize = 10;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 페이지가 바뀔 때마다, 검색어 또는 검색 카테고리가 바뀔 때마다 목록 갱신
  useEffect(() => {
    fetchNotices();
  }, [currentPage, searchCategory]);

  // 공지사항 목록 조회 함수
  const fetchNotices = ({
    page = currentPage,
    search = searchKeyword,
    type = searchCategory,
  } = {}) => {
    const params = {
      boardType: "N",
      page,
      pageSize,
    };
    if (search.trim()) {
      params.search = search.trim();
      params.searchCategory = type;
    }

    axios
      .get("/api/community/list", { params })
      .then((res) => {
        setPriorityList(res.priorityList);
        setNoticeList(res.boardList);
        setTotalCount(res.totalCount);
      })
      .catch((err) => console.error("공지사항 조회 실패", err));
  };

  const formatDate = (rawDate) => {
    const d = new Date(rawDate);
    return isNaN(d)
      ? ""
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // 카테고리(전체, 중요, 일반) 탭 클릭 핸들러
  const handleTabClick = (newCategory) => {
    setCategory(newCategory);
    setSearchKeyword("");
    setCurrentPage(1);
    if (newCategory === "all") {
      // 전체일 땐 검색 없이 전체 조회
      fetchNotices({ page: 1, search: "", type: "" });
    } else {
      // 중요/일반 탭에선 기존 searchCategory & searchKeyword 사용
      fetchNotices({ page: 1, search: searchKeyword, type: searchCategory });
    }
  };

  // 검색 버튼 또는 엔터 클릭 핸들러
  const handleSearch = () => {
    setCurrentPage(1);
    fetchNotices({ page: 1, search: searchKeyword, type: searchCategory });
  };

  return (
    <>
      <Banner pageName="공지사항" />
      <CommuMenuBar />

      <div className="community-notice-container">
        <div className="community-notice-wrapper">
          {/* 탭 */}
          <div className="community-notice-category">
            <div className="community-notice-tap">
              <ul className="notice-tap-list">
                {["all", "important", "normal"].map((type) => (
                  <li key={type}>
                    <button
                      onClick={() => handleTabClick(type)}
                      className={category === type ? "active" : ""}
                    >
                      {type === "all"
                        ? "전체"
                        : type === "important"
                        ? "중요"
                        : "일반"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* 검색 */}
            <div className="community-notice-search">
              <div className="community-notice-search-container">
                <select
                  className="community-notice-search-select"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="titleContent">제목+본문</option>
                  <option value="title">제목</option>
                  <option value="content">본문</option>
                </select>
                <input
                  className="community-notice-search-input"
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="검색어를 입력하세요"
                />
                <button
                  className="community-notice-search-btn"
                  onClick={handleSearch}
                  type="button"
                >
                  <SearchIcon fontSize="small" />
                </button>
              </div>
            </div>
          </div>

          {/* 리스트 */}
          <div className="community-notice-section">
            <div className="community-notice-head">
              <div className="notice-head-col num">번호</div>
              <div className="notice-head-col title">제목</div>
              <div className="notice-head-col write">작성일</div>
              <div className="notice-head-col author">작성자</div>
            </div>
            <div className="community-notice-body">
              <ul className="community-notice-list">
                {(category === "all" || category === "important") &&
                  priorityList.map((item) => (
                    <li
                      key={item.boardNo}
                      className="community-notice-list-item notice-priority"
                    >
                      <Link to={`/community/detail/${item.boardNo}`}>
                        <div className="notice-body-col num"></div>
                        <div className="notice-body-col title">
                          {item.title}
                        </div>
                        <div className="notice-body-col write">
                          {formatDate(item.writeDate)}
                        </div>
                        <div className="notice-body-col author">
                          {item.authorName}
                        </div>
                      </Link>
                    </li>
                  ))}
                {(category === "all" || category === "normal") &&
                  noticeList.map((item, idx) => (
                    <li
                      key={item.boardNo}
                      className="community-notice-list-item"
                    >
                      <Link to={`/community/detail/${item.boardNo}`}>
                        <div className="notice-body-col num">
                          {totalCount - ((currentPage - 1) * pageSize + idx)}
                        </div>
                        <div className="notice-body-col title">
                          {item.title}
                        </div>
                        <div className="notice-body-col write">
                          {formatDate(item.writeDate)}
                        </div>
                        <div className="notice-body-col author">
                          {item.authorName}
                        </div>
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
