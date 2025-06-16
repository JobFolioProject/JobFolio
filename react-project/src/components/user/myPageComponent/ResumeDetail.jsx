import '../../../css/user/myPageComponent/ResumeDetail.css';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import axios from '../../../utils/axiosConfig';
import { useEffect, useState } from 'react';

const ResumeDetail = () => {

    const [resumeList, setResumeList] = useState([]);

    

    // 팝업 열기 유틸
  const openResumePopup = (physicalPath) => {
  // "X:/resume_output/..." → "/resumes/..."
  const path = physicalPath
    .replace(/^.*?resume_output/, '/resumes')
    .replace(/\\/g,'/');
  const url = `http://localhost:80${path}`;
  window.open(url, '_blank', 'width=900,height=700');
};

    const axiosResumeInfo = async () => {
        try {
            const raw = sessionStorage.getItem('user');
            if (!raw) return;
            const { userNo } = JSON.parse(raw);
            if (!userNo) return;

            // JSON 바디에 userNo 담아 POST
            const response = await axios.post('/api/myPage/resumeDetail', {
            userNo: userNo
            });
            console.log(response.data);

            const { resumeList } = response.data;

            if (Array.isArray(resumeList) && resumeList.length > 0) {
                // 첫 번째 이력서를 resumeInfo에 세팅
                setResumeList(resumeList);
            }
            
        } catch (err) {
            console.error('Failed to fetch userInfo:', err);
        }
    };

    useEffect(() => {
        axiosResumeInfo();
    }, []);

    return (
        <div className="resumeDetail">
            {
        // 3) map으로 반복 렌더링
        resumeList.map(item => (
          <div key={item.resume_no} className="resumeItem">
            <div className="resumeItemCon">
              <div className="resumeItemHeader">
                <h3 onClick={() => openResumePopup(item.resume_file_pypath)}>{item.title || '제목 없음'}</h3>
                <FavoriteIcon className="likeIcon" />
              </div>
              <div className="resumeItemDetail">
                <p className="resumeItemJob">
                  {item.desired_position || '희망 직무 없음'}
                </p>
                {/* 서버에 생성일(create_at) 필드가 있다면 출력 */}
                <p className="resumeItemDate">
                  {item.resume_file_name || '날짜 정보 없음'}
                </p>
              </div>
            </div>
          </div>
        ))
      }
        </div>
    );
};

export default ResumeDetail;