import CommuMenuBar from './CommuMenuBar';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/community/CommuNotice_detail.css';

const CommuNoticeDetail = () => {
    const { boardNo } = useParams();
    const [notice, setNotice] = useState(null);

    const formatDate = (rawDate) => {
        const date = new Date(rawDate);
        if (isNaN(date.getTime())) return '';
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    useEffect(() => {
        axios.get(`/api/community/detail/${boardNo}`)
            .then(res => {
                setNotice(res.data);
            })
            .catch(err => console.error('공지 상세 조회 실패', err));
    }, [boardNo]);

    if (!notice) return <div>불러오는 중...</div>;

    return (
        <>
            <div className="notice-banner">
                <img src="/resources/img/banner.png" alt="Banner" />
                <h1>공지사항</h1>
            </div>
            <CommuMenuBar />
            <div className="notice-detail-container">
                <div className="notice-detail-wrapper">
                    <h1 className="notice-detail-title">{notice.title}</h1>
                    <div className="notice-detail-meta">
                        <span>작성자: {notice.authorName}</span>
                        <span>작성일: {formatDate(notice.writeDate)}</span>
                    </div>

                    <div
                        className="notice-detail-content"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default CommuNoticeDetail;
