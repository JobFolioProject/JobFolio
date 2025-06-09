import '../../css/community/CommuResume.css';
import CommuMenuBar from './CommuMenuBar';

const CommuResume = () => {
   
    return (
    <>
        <div className="resume-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>이력서</h1>
        </div>
    <CommuMenuBar/>
        <h1>
            이력서 게시 페이지 입니다.
        </h1>
    </>
    );
};

export default CommuResume;