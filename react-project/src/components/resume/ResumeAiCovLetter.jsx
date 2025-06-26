import React, { useState } from 'react';
import axios from "../../utils/axiosConfig";
import PrettyBtn from './PrettyBtn'; // PrettyBtn 컴포넌트 임포트


const ResumeAiCoverLetter = ({formData,myCoverLetter,setMyCoverLetter,setFormData,userNo, userName}) => {
    const [aiCoverLetter, setAiCoverLetter] = useState(''); //자기소개서 내용 상태.
    const [loading, setLoading] = useState(false);

const handleGenerateResume = async() => {
    setLoading(true);

     // 💡 중요: 백엔드 CareerAllDto의 필드명과 일치하도록 데이터 구조를 가공합니다.
        // Resume 컴포넌트의 handleSubmit 로직을 따릅니다.
        const dataToSendToBackend = { // 기타 CareerAllDto에 필요한 필드들을 여기에 추가
            user_name: userName,
            user_no: userNo,
            // formData에서 필요한 개별 필드들을 직접 매핑
            title: formData.title,
            desired_position: formData.desired_position,
            // 백엔드의 CareerAllDto에는 myCoverLetter 필드를 추가했으니, 이 이름을 사용합니다.
            myCoverLetter: formData.coverLetter,
            // userNo는 Resume 컴포넌트의 상태이므로, props로 받아오거나 전역 상태에서 가져와야 합니다.
            // 현재 ResumeAiCoverLetter에는 userNo가 직접 전달되지 않으므로, 이 부분을 부모에서 받아와야 합니다.
            // 임시로 하드코딩하거나, props로 userNo를 추가해야 합니다. (예: `userNo: 4,` 또는 props로 `userNo` 받기)
            // userNo: yourUserNoVariable,

            // 학력 데이터: 기존 학력(education)과 새로 추가된 학력(newEducation)을 합쳐서
            // 백엔드 CareerAllDto의 'educationList' 필드명에 맞춰 전송합니다.
            educationList: [...formData.education, ...(formData.newEducation || [])], // newEducation이 없을 경우를 대비해 빈 배열 합치기

            // 경력 데이터: 기존 경력(experience)과 새로 추가된 경력(newExperience)을 합쳐서
            // 백엔드 CareerAllDto의 'careerHistoryList' 필드명에 맞춰 전송합니다.
            careerHistoryList: [...formData.experience, ...(formData.newExperience || [])],
            // CareerAllDto에 있는 다른 필드들도 formData에서 가져와서 매핑합니다.
            // formData의 skill_tool은 문자열이므로, CareerAllDto의 List<SkillVO> skillList에 맞게 변환이 필요할 수 있습니다.
            // 여기서는 임시로 문자열 하나를 가진 리스트로 보낼 수 있습니다.
            // skillList: formData.skill_tool ? [{ skill_name: formData.skill_tool }] : [], // SkillVO 구조에 맞춰야 함
            skillList: [...formData.skillList, ...(formData.newSkillList || [])],
            link_url: formData.link_url, // CareerAllDto에 이 필드가 있다면 추가

            // formData에 hobby, notes 필드가 있다면 CareerAllDto에 맞게 추가
            // hobby: formData.hobby,
            // notes: formData.notes,

            // 전송할 필요 없는 임시 필드들은 제외합니다.
            // 기존 formData의 나머지 속성들을 펼치지 않고, 필요한 필드만 명시적으로 포함하는 것이 더 명확합니다.
        };

     // 개발 중 확인용: 백엔드로 보내질 최종 데이터 구조
    console.log('AI 자기소개서 생성 요청 데이터:', dataToSendToBackend);

    await axios.post('/api/resume/generateCoverLetter', {dataToSendToBackend : dataToSendToBackend})
    // .then(res => {
    //     setAiCoverLetter(res.data.result); //  이 상태는 AI가 생성한 자기소개서를 **"표시"**
    //     //API 응답에서 result 필드에 생성된 자기소개서 내용이 있다고 가정
    //     setMyCoverLetter(res.data.result); // 🎉 AI가 생성한 자기소개서를 상위 컴포넌트의 formData.coverLetter에 반영
    //     //생성된 자기소개서를 formData.coverLettr에 바로 반영. 
    //     // setMyCoverLetter(res.data.result); 이거 쓰거나 아래꺼 쓰면 됨.
    //     // setFormData(prev=>({
    //     //     ...prev,
    //     //     coverLetter:res.data.result
    //     // }));
    // })
    .then(res => {
                console.log(typeof res); //object
                console.log(typeof res);//object
                const parsedAnswerno = res.response;
                console.log(typeof parsedAnswerno); //string 
                const parsedAnswer = JSON.parse(res.response);
                const content = parsedAnswer.choices[0].message.content;
                console.log('restext는:' ,content);
         setMyCoverLetter(content);
            })
    .catch(err => {
        console.error('자기소개서 생성 실패:', err);
    })
    .finally(() => {
        setLoading(false);
    });
};

    return (
        <div className="my-cover-letter-section" style={{ textAlign: 'center' }}>
            {/* <h2>자기소개서 AI 생성</h2> */}
            <PrettyBtn onClick={handleGenerateResume} disabled={loading}>
                {loading ? '생성 중...' : '자기소개서 생성하기'}
            </PrettyBtn>
            {aiCoverLetter && (
                <div className="ai-resume-result">
                    <h3>생성된 이력서:</h3>
                     {/* textarea에 value를 설정하고 onChange 핸들러를 주면 사용자가 수정 가능 */}
                    <textarea 
                        value={aiCoverLetter} 
                        readOnly={true}
                        placeholder=""/>
                    <pre>{aiCoverLetter}</pre>
                </div>
            )}
        </div>
    );
};

export default ResumeAiCoverLetter;
