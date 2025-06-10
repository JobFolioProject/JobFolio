import '../../css/resume/Resume.css';
import ResumeSidebar from './ResumeSidebar';
import React, { use, useState, useEffect} from 'react';

const Resume = () => {
    // 이력서 작성 페이지 컴포넌트
    // 이력서 작성 폼을 포함하고 있으며, 사이드바를 사용하여 다른 이력서 관련 페이지로 이동할 수 있습니다.  
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('이력서 제출:', formData);
        alert('이력서가 제출되었습니다.');
    }

    const [formData, setFormData] = useState({
        title: '',
        desired_position: '',
        skill_tool: '',
        link_url: '',
        education: '',
        experience: ''
    });

    const handleChange = (event) =>{
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }


    // useEffect(() => {
    //     console.log('폼 데이터가 변경되었습니다:', formData);
    // }, [formData]);


    return (
    <div className='resume'>
        <div className='resume-sidebar'>
            <ResumeSidebar/>
        </div>
        <div className='resume-content'>
            <div className="resume-banner">
                <img src="/resources/img/banner.png" alt="Banner" />
            </div>
            {/* <div style={{ marginLeft: '200px', padding: '200px' }}> */}
            <div className='resume-content-form' style={{ marginLeft: '0px', padding: '100px' }}>
            <h1>이력서 작성</h1>
            <p>
                이력서를 작성하는 페이지입니다. 
                <br />
            </p>
           <form onSubmit={handleSubmit}>
                    <label>
                        <div><span>제목</span></div> {/* 제목을 div로 감싸고 */}
                        <div><input type="text" name="title" onChange={handleChange} value={formData.title}/></div> {/* 인풋을 div로 감쌉니다 */}
                    </label>
                    <br /> {/* <br />은 이제 필요 없을 수 있습니다. 레이아웃에 따라 조절하세요. */}

                    <label>
                        <div><span>희망직무</span></div>
                        <div><input type="email" name="desired_position" onChange={handleChange} value={formData.desired_position}/></div>
                    </label>
                    <br />

                    {/* 나머지 부분도 동일하게 적용 */}
                    <label>
                        <div><span>기술스택/툴</span></div>
                        <div><input type="text" name="skill_tool" onChange={handleChange} value={formData.skill_tool}/></div>
                    </label>
                    <br />
                    <label>
                        <div><span>링크</span></div>
                        <div><input type="text" name="link_url" onChange={handleChange} value={formData.link_url}/></div>
                    </label>
                    <br />
                    <label>
                        <div><span>학력</span></div>
                        <div><input type="text" name="education" onChange={handleChange} value={formData.education}/></div>
                    </label>
                    <br />
                    <label>
                        <div><span>경력</span> :</div>
                        <div><textarea name="experience" rows="4" cols="50" onChange={handleChange} value={formData.experience}></textarea></div>
                    </label>
                    <br />
                    <button type="submit" onClick={handleSubmit}>이력서 제출</button>
                </form>
            </div>
            </div>
        </div>
            
    );
};

export default Resume;
