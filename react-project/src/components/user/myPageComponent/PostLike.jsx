import '../../../css/user/myPageComponent/PostLike.css';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import axios from '../../../utils/axiosConfig';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Pagination from '../../common/Pagination.jsx';

const PostLike = () => {
    const [resumeList, setResumeList] = useState([]);
    const { user, isAuthenticated } = useAuth();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 6;
    const totalPages = Math.ceil(totalCount / pageSize);

    // 팝업 열기 유틸
    const openResumePopup = (physicalPath) => {
        // "X:/resume_output/..." → "/resumes/..."
        const path = physicalPath.replace(/^.*?resume_output/, '/resumes').replace(/\\/g, '/');
        const url = `http://localhost:80${path}`;
        window.open(url, '_blank', 'width=900,height=700');
    };

    const axiosResumeInfo = async (page = currentPage) => {
        try {
            const userNo = user.userNo;
            if (!userNo) {
                setResumeList([]);
                setTotalCount(0);
                return;
            }

            // JSON 바디에 userNo 담아 POST
            const response = await axios.post('/api/resume/resume/liked', {
                userNo: userNo,
                page,
                pageSize,
            });
            console.log(response);

            const fetchedResumeList = response.resumeList || [];
            const fetchedTotalCount = response.totalCount || 0;
            if (Array.isArray(fetchedResumeList)) {
                // 첫 번째 이력서를 resumeInfo에 세팅
                setResumeList(fetchedResumeList);
                setTotalCount(fetchedTotalCount);
            }
        } catch (err) {
            console.error('Failed to fetch userInfo:', err);
        }
    };

    const unlikeResume = async (resumeNo) => {
        if (window.confirm('좋아요를 취소 하시겠습니까?')) {
            try {
                const userNo = user.userNo;
                if (!userNo) return;

                // JSON 바디에 userNo 담아 POST
                const response = await axios.post('/api/resume/unlikeResume', {
                    userNo: userNo,
                    resumeNo: resumeNo,
                });

                if (response.message !== null) {
                    alert(response.message);
                    axiosResumeInfo();
                } else {
                    alert('취소 요청에 실패했습니다.');
                }

                // 좋아요 취소 후 페이지가 줄어들 때
                if (resumeList.length === 1 && currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                } else {
                    axiosResumeInfo();
                }
            } catch (error) {
                console.error('취소 요청 실패:', error);
                alert('취소 중 오류가 발생했습니다.');
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            axiosResumeInfo();
        }
    }, [currentPage, isAuthenticated, user]);

    return (
        <div className="postLikeDetail">
            {resumeList.length === 0 ? (
                <div className="emptyPstLikeList">
                    <span>좋아요 내역이 없습니다. ❤️‍🩹</span>
                </div>
            ) : (
                // 3) map으로 반복 렌더링
                <>
                    {resumeList.map((item) => (
                        <div key={item.resume_no} className="postLikeItem">
                            <div className="postLikeItemCon">
                                <div className="postLikeItemHeader">
                                    <h3 onClick={() => openResumePopup(item.resume_file_pypath)}>
                                        {item.title || '제목 없음'}
                                    </h3>
                                    <FavoriteIcon
                                        className="likeIcon"
                                        color="error"
                                        onClick={() => unlikeResume(item.resume_no)}
                                    />
                                </div>
                                <div className="postLikeItemDetail">
                                    <p className="resumeItemJob">{item.desired_position || '희망 직무 없음'}</p>
                                    {/* 서버에 생성일(create_at) 필드가 있다면 출력 */}
                                    <p className="resumeItemDate">
                                        {item.create_date.slice(0, 16) || '날짜 정보 없음'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="community-notice-pagination">
                        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                    </div>
                </>
            )}
        </div>
    );
};

export default PostLike;
