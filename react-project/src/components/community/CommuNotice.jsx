import '../../css/community/CommuNotice.css';
import CommuMenuBar from './CommuMenuBar';

const CommuNotice = () => {
   
    return (
    <>
        <div className="notice-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>공지사항</h1>
        </div>
    <CommuMenuBar/>
        <h1>
            공지사항 페이지 입니다.
        </h1>
    </>
    );
};

export default CommuNotice;