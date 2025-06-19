import '../../../css/user/myPageComponent/ResumeDetail.css';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import { ResumeEditContext } from '../../../context/ResumeEditContext';
import axios from '../../../utils/axiosConfig';
import { useContext, useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ResumeDetail = () => {

    const [resumeList, setResumeList] = useState([]);

    const { user, isAuthenticated } = useAuth();
    const { setEditResumeData } = useContext(ResumeEditContext);
    const [redirect, setRedirect] = useState(false);
    
    useEffect(() => {
        axiosResumeInfo();
    }, []);
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
            const userNo = user.userNo;
            

            // JSON 바디에 userNo 담아 POST
            const response = await axios.post('/api/resume/resumeDetail', {
            userNo: userNo
            });
            console.log(response);

            const { resumeList } = response;

            if (Array.isArray(resumeList) && resumeList.length >= 0) {
                // 첫 번째 이력서를 resumeInfo에 세팅
                setResumeList(resumeList);
            }
            
        } catch (err) {
            console.error('Failed to fetch userInfo:', err);
        }
    };

    const modifyResume = (path, title, publication) => {
    setEditResumeData({ path, title, publication });
    setRedirect(true);
  };

    if (redirect) {
    return <Navigate to="/resume/edit" replace />;
    }

    const deleteResume = async (resume_no)=>{
      if(window.confirm("이력서를 삭제 하시겠습니까?")){

        await axios.post("/api/resume/deleteResume", {resume_no: resume_no})
        .then((res)=>{

          const { message, errorDetail } = res;
          if (message === "Y") {
            alert("삭제되었습니다");
            axiosResumeInfo();
            // TODO: 삭제 후 처리 (리스트 갱신, 모달 닫기 등)
        } else if (message === "N") {
            alert("삭제 실패: 서버에서 N 응답");
            // TODO: 사용자에게 실패 안내
        } else { // "ERROR" 케이스
            console.error("서버 오류:", errorDetail);
            // TODO: 사용자에게 에러 안내 (예: "서버 오류가 발생했습니다.")
        }

        })
        .catch((err)=>{
            console.log(err)
        })
      }
        
        
    }

    

    return (
        <div className="resumeDetail">
            {
        // 3) map으로 반복 렌더링
        resumeList.map(item => (
          <div key={item.resume_no} className="resumeItem">
            <div className="resumeItemCon">
              <div className="resumeItemHeader">
                <h3 onClick={() => openResumePopup(item.resume_file_pypath)}>{item.title || '제목 없음'}</h3>
                <button onClick={() => modifyResume(item.resume_file_pypath, item.title, item.publication_yn)}>수정</button>
                <button onClick={() => deleteResume(item.resume_no)}>삭제</button>
              </div>
              <div className="resumeItemDetail">
                <p className="resumeItemJob">
                  {item.desired_position || '희망 직무 없음'}
                </p>
                {/* 서버에 생성일(create_at) 필드가 있다면 출력 */}
                <p className="resumeItemDate">
                  {item.create_date.slice(0,16) || '날짜 정보 없음'}
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