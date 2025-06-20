import CommuMenuBar from './CommuMenuBar';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from "../../utils/axiosConfig";
import '../../css/community/CommuNotice_detail.css';
import Banner from '../common/Banner';

const CommuNoticeDetail = () => {
  const { boardNo } = useParams();
  const [notice, setNotice] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0); // 스크롤 초기화

    Promise.all([
      axios.get(`/api/community/detail/${boardNo}`),
      axios.get(`/api/community/nav/${boardNo}`)
    ])
      .then(([detailRes, navRes]) => {
        setNotice(detailRes);
        setPrevPost(navRes.prev || null);
        setNextPost(navRes.next || null);
      })
      .catch(err => {
        console.error('공지사항 데이터 조회 실패', err);
        alert('공지사항 정보를 불러오는 데 실패했습니다.');
      });
  }, [boardNo]);

  if (!notice) return <div>불러오는 중...</div>;

  return (
    <>
      <Banner pageName="공지사항" />

      <CommuMenuBar />

      <div className="notice-detail-container">
        <div className="notice-detail-wrapper">
          <div className="notice-detail-header">
            <div className="notice-detail-title">
              <h1>{notice.title}</h1>
            </div>
            <div className="notice-detail-sub-info-box">
              <div className="notice-detail-write-date">
                <span>작성일: {formatDate(notice.writeDate)}</span>
              </div>
            </div>
          </div>

          <div
            className="notice-detail-content"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          ></div>

          <div className="notice-detail-page-control">
            {prevPost && (
              <div className="notice-detail-previous">
                <span>이전글</span>
                <Link to={`/community/detail/${prevPost.boardNo}`} className="notice-detail-previous-title">
                  {prevPost.title}
                </Link>
              </div>
            )}
            {nextPost && (
              <div className="notice-detail-next">
                <span>다음글</span>
                <Link to={`/community/detail/${nextPost.boardNo}`} className="notice-detail-next-title">
                  {nextPost.title}
                </Link>
              </div>
            )}
          </div>

          <div className="notice-detail-btn-group">
            <Link to="/community/notice" className="notice-detail-list-btn">목록</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommuNoticeDetail;
