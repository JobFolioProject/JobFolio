import '../../../css/user/myPageComponent/ResumeDetail.css';

const PostLike = () => {
   
    return (
        <div className="resumeDetail">
            <div className="resumeItem">
                <div className="resumeItemCon">
                    <div className="resumeItemHeader">
                        <h3>이력서 제목</h3>
                        {/* CORRECTED PATH: Reference directly from the root */}
                        <img src="/like2.png" alt="좋아요" className="likeIcon" />
                    </div>
                    <div className="resumeItemDetail">
                        <p className="resumeItemJob">대기업 | 개발자</p>
                        <p className="resumeItemDate">2025-06-10</p>
                    </div>
                </div>
            </div>

            <div className="resumeItem">
                <div className="resumeItemCon">
                    <div className="resumeItemHeader">
                            <h3>이력서 제목</h3>
                            {/* CORRECTED PATH */}
                            <img src="/like2.png" alt="좋아요" className="likeIcon" />
                    </div>
                    <div className="resumeItemDetail">
                        <p className="resumeItemJob">SI | 개발자</p>
                        <p className="resumeItemDate">2025-06-10</p>
                    </div>
                </div>
            </div>

            <div className="resumeItem">
                <div className="resumeItemCon">
                <div className="resumeItemHeader">
                            <h3>이력서 제목</h3>
                            {/* CORRECTED PATH */}
                            <img src="/like2.png" alt="좋아요" className="likeIcon" />
                    </div>
                    <div className="resumeItemDetail">
                        <p className="resumeItemJob">중소기업 | 총무</p>
                        <p className="resumeItemDate">2025-06-10</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostLike;
