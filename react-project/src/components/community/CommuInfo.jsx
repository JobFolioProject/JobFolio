import '../../css/community/CommuInfo.css';
import CommuMenuBar from './CommuMenuBar';

const CommuInfo = () => {
   
    return (
    <>
        <div className="info-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>이용안내</h1>
        </div>
    <CommuMenuBar/>
        <h1>
            이용안내 페이지 입니다.
        </h1>
    </>
    );
};

export default CommuInfo;