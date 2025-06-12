import '../../css/resume/Resume.css'; // 스타일 따로 작성
import ResumeSidebar from './ResumeSidebar';
import React, { use, useState, useEffect} from 'react';
import DropDown from './ResumeDropdown';
import axios from 'axios';
import ResumeAiCoverLetter from './ResumeAiCovLetter';
import PrettyBtn from './PrettyBtn'; // PrettyBtn 컴포넌트 임포트


const Resume = () => {
    // 이력서 작성 페이지 컴포넌트
    // 이력서 작성 폼을 포함하고 있으며, 사이드바를 사용하여 다른 이력서 관련 페이지로 이동할 수 있습니다.  
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('이력서 제출:', formData);
        alert('이력서가 제출되었습니다.');
    }

    let restext = "";

    // test!!! 기술/툴 드롭다운 옵션 샘플데이터
    const dummySkillOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'Git', 'Docker'];

    // 이력서 작성 폼 데이터 상태
    const [formData, setFormData] = useState({
        user_no: 4,
        title: '',
        desired_position: '',
        skill_tool: '',
        link_url: '',
        experience: [
            {
                start_date:'',
                end_date:'',
                company_name:'',
                notes:'',
            },
        ],
        education: [
            {
                school_name: '',
                enroll_date: '',
                grad_date: '',
                major: '',
                sub_major: '',
                gpa: '',
            },
        ],
        coverLetter: '',
    });




    // const handleChange = (event) =>{
    //     setFormData({
    //         ...formData,
    //         [event.target.name]: event.target.value
    //     });
    // }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    // useEffect(() => {
    //     console.log('폼 데이터가 변경되었습니다:', formData);
    // }, [formData]);

      // 학력 입력 변경 핸들러 (몇 번째 학력인지, 필드 이름, 값)
  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation[index] = {
        ...newEducation[index],
        [name]: value,
      };
      return {
        ...prev,
        education: newEducation,
      };
    });
  };

  const save = async ()=>{


    await axios.post("/resume/insertResumeInfo", formData,  { headers: { "Content-Type": "application/json" } })
    .then((res)=>{

        
        const parsedAnswer = JSON.parse(res.data.html);
        restext = parsedAnswer.choices[0].message.content;
        console.log(restext);
    })
    .catch((err)=>{
        console.log(err)
    })

  }

   //학력 추가 버튼 클릭 시 새 학력 항목 추가
  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school_name: '',
          enroll_date: '',
          grad_date: '',
          major: '',
          sub_major: '',
          gpa: '',
        },
      ],
    }));
  };

  // 학력 삭제 핸들러 (인덱스)
    const removeEducation = (index) => {
        setFormData((prev) => {
            const newEducation = [...prev.education];
            newEducation.splice(index,1); // 해당 인덱스의 학력 항목 삭제
            return {
                ...prev,
                education: newEducation, // 업데이트된 학력 배열로 설정
            }
        })
    }

  // 경력 사항 추가 핸들러

  const addExperience = () => {
    setFormData((prev) =>({
        ...prev,
        experience: [
           ...prev.experience,
           {
            start_date: '',
            end_date:'',
            company_name:'',
            position:'',
            notes:'',
           }
        ]
    }));
  }

  // 경력 사항 삭제 핸들러 (인덱스)
  const removeExperience = (index) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience.splice(index, 1); // 해당 인덱스의 경력 항목 삭제
      return {
        ...prev,
        experience: newExperience, // 업데이트된 경력 배열로 설정
      };
    });
  };

  // 경력 입력 변경 핸들러 (필드 이름, 값)
  const handleExperienceChange = (index, e) => {
    const {name, value} = e.target;
    setFormData((prev) => {
        const newExperience = [...prev.experience]; // 기존 experience 배열 복사
        newExperience[index] = { // 해당 인덱스의 항목만 업데이트
            ...newExperience[index],
            [name]: value,
        }
        return {
            ...prev,
            experience: newExperience, // 업데이트된 experience 배열로 설정
        }
    })
  }


 
    return (
        <>
            <div className="resume-banner">
                <img src="/resources/img/banner.png" alt="Banner" />
            </div>
        <div className='resume_Wrap'>
            <ResumeSidebar/>
            <div className='resume-content'>
                {/* <div style={{ marginLeft: '200px', padding: '200px' }}> */}
                <div className='resume-content-form'>
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
                            <div><input type="text" name="desired_position" onChange={handleChange} value={formData.desired_position}/></div>
                        </label>
                        <br />

                        {/* 나머지 부분도 동일하게 적용 */}
                        <label>
                            <span>기술스택/툴</span><br />

                            <div><input type="text" name="skill_tool" onChange={handleChange} value={formData.skill_tool}/></div>
                            <DropDown
                                options={dummySkillOptions}
                                selected={formData.skill_tool}
                                placeholder="기술/툴을 선택하세요"
                                onSelect={(option)=>{
                                    setFormData((prev) => ({
                                        ...prev,
                                        skill_tool: option // 선택한 기술/툴을 formData에 저장
                                    }));
                                    console.log("선택한 기술/툴:", option); // 선택한 옵션 확인
                                }}
                                />
                                {/* 드롭다운 컴포넌트 사용 */}
                                {formData.skill_tool && <p>선택한 기술: {formData.skill_tool}</p>}
                                <br />
                        </label>
                        <br />
                        <label>
                            <div><span>링크</span></div>
                            <div><input type="text" name="link_url" onChange={handleChange} value={formData.link_url}/></div>
                        </label>
                        <br />
                         <label>
                            <div><span>학력</span></div>
                        </label>
                            {formData.education.map((edu, index) => (
                            <div key={index} className="education-row">
                                <input type="text" name="school_name" placeholder="학교명" onChange={(e) => handleEducationChange(index, e)}value={edu.school_name}/>
                                <input type="text" name="enroll_date" placeholder="입학일" onChange={(e) => handleEducationChange(index, e)} value={edu.enroll_date}/>
                                <input type="text" name="grad_date" placeholder="졸업일" onChange={(e) => handleEducationChange(index, e)} value={edu.grad_date}/>
                                <input type="text" name="major" placeholder="전공" onChange={(e) => handleEducationChange(index, e)} value={edu.major}/>
                                <input type="text" name="sub_major" placeholder="복수전공" onChange={(e) => handleEducationChange(index, e)} value={edu.sub_major}/>
                                <input type="text" name="gpa" placeholder="학점" onChange={(e) => handleEducationChange(index, e)} value={edu.gpa}/>
                                {/* <input type="text" name="enroll_date" placeholder="입학일" onChange={handleChange} value={formData.enroll_date} />
                                <input type="text" name="grad_date" placeholder="졸업일" onChange={handleChange} value={formData.grad_date} />
                                <input type="text" name="major" placeholder="전공" onChange={handleChange} value={formData.major} />
                                <input type="text" name="sub_major" placeholder="복수전공" onChange={handleChange} value={formData.sub_major} />
                                <input type="text" name="gpa" placeholder="학점" onChange={handleChange} value={formData.gpa} /> */}
                                <PrettyBtn type="button" size= "sm" onClick={addEducation} disabled={formData.education.length >= 4}>추가</PrettyBtn>    
                                <PrettyBtn type="button" size= "sm" onClick={() => removeEducation(index)} disabled={formData.education.length <= 1}>삭제</PrettyBtn>
                            </div>
                            ))}
                        <br />
                        <label>
                            <div><span>경력</span></div>
                        </label>
                            {formData.experience.map((exp, index) => (
                            <div key={index} className='experience-row'>
                                <div className='experience-row input'>
                                    <input type='text' name='start_date' placeholder='시작일' onChange={(e) => handleExperienceChange(index, e)} value={exp.start_date}/>
                                    <input type='text' name='end_date' placeholder='종료일' onChange={(e) => handleExperienceChange(index, e)} value={exp.end_date}/>
                                    <input type='text' name='company_name' placeholder='회사명' onChange={(e) => handleExperienceChange(index, e)} value={exp.company_name}/>
                                </div>
                                    <input type='text' name='position' placeholder='직무' onChange={(e) => handleExperienceChange(index, e)} value={exp.position}/>
                                    <input type='text' name='notes' placeholder='상세내용' onChange={(e) => handleExperienceChange(index, e)} value={exp.notes}/>
                                <PrettyBtn type="button" size= "sm" onClick={addExperience} disabled={formData.experience.length >= 4}>추가</PrettyBtn>    
                                <PrettyBtn type="button" size= "sm" onClick={() => removeExperience(index)} disabled={formData.experience.length <= 1}>삭제</PrettyBtn>
                            </div>
                            ))}
                        <br />

                        <button onClick={save}>이력서 제출</button>

                        <label>
                            {/*내가 작성한 자소서는 DB에 저장할것인지???*/}
                            <div><span>자기소개서</span></div> 
                            <div>
                                <textarea
                                className='my-cover-letter-section'
                                name="coverLetter"
                                rows="6"
                                cols="50"
                                value={formData.coverLetter}
                                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                placeholder="자기소개서를 입력하세요"
                                />
                            </div>
                        </label>
                        <br />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <PrettyBtn type="submit" onClick={handleSubmit} >이력서 제출</PrettyBtn>
                        </div>
                        <br/>
                    </form>
                    <ResumeAiCoverLetter
                        formData={formData}
                        myCoverLetter={formData.coverLetter}
                        setMyCoverLetter={(value) => setFormData({ ...formData, coverLetter: value })}
                        setFormData={setFormData} // formData 상태를 자식 컴포넌트에 전달
                     />
                </div>
                </div>
        </div>
    </>
    );

};

export default Resume;