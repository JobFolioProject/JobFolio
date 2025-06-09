import '../../css/community/CommuFaq.css';
import CommuMenuBar from './CommuMenuBar';

const CommuFaq = () => {
   
    return (
    <>
        <div className="faq-banner">
            <img src="/resources/img/banner.png" alt="Banner" />
            <h1>자주묻는질문</h1>
        </div>
    <CommuMenuBar/>
        <h1>
            자주묻는질문 페이지 입니다.
        </h1>
    </>
    );
};

export default CommuFaq;