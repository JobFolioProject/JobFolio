import React, { useState } from 'react';
import axios from 'axios';
import PrettyBtn from './PrettyBtn'; // PrettyBtn 컴포넌트 임포트


const ResumeAiCoverLetter = ({formData,myCoverLetter,setMyCoverLetter,setFormData}) => {
    const [aiCoverLetter, setAiCoverLetter] = useState(''); //자기소개서 내용 상태.
    const [loading, setLoading] = useState(false);


// const handleGenerate = async () => {
//     setLoading(true);
//     try {
//         const res = await axios.post('/resume/generateCoverLetter', {
//             // 필요한 formData 전달
//         }
//         });

//         setAiCoverLetter(res.data.result);
//     } catch (err) {
//         console.error('자기소개서 생성 실패:', err);
//     } finally {
//         setLoading(false);
//     }
// };

const handleGenerateResume = async() => {
    setLoading(true);

    await axios.post('/resume/generateCoverLetter', {
        // 필요한 formData 전달
        ...formData ,
        myCoverLetter,
    })
    .then(res => {
        setAiCoverLetter(res.data.result); //  이 상태는 AI가 생성한 자기소개서를 **"표시"**
        //API 응답에서 result 필드에 생성된 자기소개서 내용이 있다고 가정
        setMyCoverLetter(res.data.result); // 🎉 AI가 생성한 자기소개서를 상위 컴포넌트의 formData.coverLetter에 반영
        //생성된 자기소개서를 formData.coverLettr에 바로 반영. 
        // setMyCoverLetter(res.data.result); 이거 쓰거나 아래꺼 쓰면 됨.
        // setFormData(prev=>({
        //     ...prev,
        //     coverLetter:res.data.result
        // }));
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
            <h2>자기소개서 AI 생성</h2>
            <PrettyBtn onClick={handleGenerateResume} disabled={loading}>
                {loading ? '생성 중...' : '자기소개서 생성하기'}
            </PrettyBtn>
            {aiCoverLetter && (
                <div className="ai-resume-result">
                    <h3>생성된 이력서:</h3>
                    <textarea value={aiCoverLetter} placeholder=""/>
                    <pre>{aiCoverLetter}</pre>
                </div>
            )}
        </div>
    );
};

export default ResumeAiCoverLetter;
