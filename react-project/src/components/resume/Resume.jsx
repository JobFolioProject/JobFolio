 
import '../../css/resume/Resume.css'; // 스타일 따로 작성
import ResumeSidebar from './ResumeSidebar';
import React, { use, useState, useEffect, useCallback} from 'react';
import DropDown from './ResumeDropdown';
import ResumeAiCoverLetter from './ResumeAiCovLetter';
import PrettyBtn from './PrettyBtn'; // PrettyBtn 컴포넌트 임포트
import Calendar from '../common/Calendar';
import TemplateSelection from './TemplateSelection';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "../../context/AuthContext";
import MyCareer from '../user/myPageComponent/MyCareer';
import { major } from '@mui/system';
import axios from "../../utils/axiosConfig";


const Resume = () => {
    // 이력서 작성 페이지 컴포넌트
    // 이력서 작성 폼을 포함하고 있으며, 사이드바를 사용하여 다른 이력서 관련 페이지로 이동할 수 있습니다.

    const { user, isAuthenticated } = useAuth();
    const {filePath, setFilePath} = useState("");

    const handleSubmit = async () => {

        const dataToSend = {
            ...formData,
            education: [...formData.education, ...formData.newEducation], // 기존 + 신규 학력
            experience: [...formData.experience, ...formData.newExperience], // 기존 + 신규 경력
            newEducation: undefined,      // 전송할 때는 필요 없으니 제거
            newExperience: undefined,
        };
        console.log('최종 제출 이력서 데이터:', dataToSend);
        
        
            await axios.post('/api/resume/insertResumeInfo', dataToSend)
            .then((res)=>{
                if(res.result === 1){
                    setFilePath(res.filePath);
                    alert("이력서 저장이 완료되었습니다")
                }else {
                    alert("이력서 저장에 실패했습니다.")
                }
                
            })
            .catch((err)=>{
                console.log(err);
            })
           

          
    }

    const pdfDownload = async () =>{
        try {
            // 1) 서버에 저장 및 물리경로 리턴
            // 2) PDF 변환 API 호출 (blob으로 받기)
           // 2) PDF 변환 요청 (ArrayBuffer 로 받기)
           console.log(filePath)
            const pdfResponse = await axios.post(
                '/api/resume/exportPdf',
                { filePath },
                { responseType: 'arraybuffer', maxBodyLength: Infinity }
                );

            // 3) Blob 생성 & 다운로드
            const blob = new Blob([pdfResponse], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();

            } catch (err) {
            console.error(err);
            alert('PDF 다운로드 중 오류가 발생했습니다.');
            }

    }
    

    // test!!! 기술/툴 드롭다운 옵션 샘플데이터
    const dummySkillOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'HTML/CSS', 'SQL', 'Git', 'Docker'];

    // 이력서 작성 폼 데이터 상태
    // U-data
    const [formData, setFormData] = useState({
        user_no: user.userNo,
        title: '',
        desired_position: '',
        skillList: [],
        link_url: '',
        //API로 불러온 기존데이터(DB에서 조회해온)
        experience: [],
        education: [],
        // 새로 추가 중인 (임시) 경력 데이터
        newExperience: [], // 여기에 항상 최대 1개의 객체만 존재하도록 관리
         // 새로 추가 중인 (임시) 학력 데이터
        newEducation: [], // 여기에 항상 최대 1개의 객체만 존재하도록 관리
        coverLetter: '', // 자기소개서 상태 추가
        template_no : 1, //
    });



    const getMyCareerInfo = async () => {
        try {
            const response = await axios.get(`/api/myPage/${user.userNo}/career`);
            console.log('API 응답 초기 데이터:', response);
            setFormData((prev) => ({
                ...prev, //기존의 FormData 값 유지.
                title:response.title|| '', //db에 없음. input하는 값(db에 저장x)
                desired_position : response.desired_position|| '', //db에 없음. input하는 값(db에 저장x)
                skillList : response.skillList || '',
                link_url : response.link_url || '', //db에 없음. input하는 값(db에 저장x)
                experience : response.creerHistoryList || [], // API로 불러온 경력
                education : response.educationList || [], //API로 불러온 학력
                coverLetter : response.coverLetter || '', //db에 없음. input하는 값(db에 저장x)
                template_no : response.template_no || 1, //mypage에서 조회하는 것 아님. 즉 `/api/myPage/${userNo}/career` api 사용x
                // newExperience와 newEducation은 그대로 빈 배열로 유지
            }));
            console.log('초기 데이터 확인', response);
        } catch (error) {
            console.log("데이터를 불러올 수 없습니다", error);

            // 에러 발생 시 기존 데이터 초기화 (신규 데이터는 영향 없음)
            setFormData((prev) => ({
            ...prev,
            existingExperience: [],
            existingEducation: [],
        }));
    }
};

    // 데이터 호출
    useEffect(() => {
        if (user.userNo !== null) {
            getMyCareerInfo();
        }
    }, [user.userNo]);


    //템플렛 정보 요청하고 받아오기. >>> 
    //백쪽은 그럼 select * from tb_template;.
    //그리고 이거는 뭐... json 형태로 res에 들어오겠나?
    //그럼 
    
    // const [tempInfos, setTempInfos] = useState({  //템플렛이 가져올때마 변하는 값도 아닌데... 이렇게 변화를 감지하는 게 맞나??? 일단은 템플렛 정보들만 가져와서 변수 안에 저장해서 사용하면 되는데...
    //     template_no:null,
    //     template_name:'',
    //     file_pypath:'',
    //     file_lopath:'',
    // });
    

    // const templateInfo = async() => {
    //     await axios.get("/resume/templateInfo")
    //     .then((res)=>{
    //         setTempInfos((prev)=>({ 
    //             ...prev,

    //         }));
    //     })
    //     .catch((err)=>{
    //         console.log(err)
    //     })
    // }



    // const selectResumeInfo = async() => {
    //     await axios.get("/resume/selectResumeInfo", { user_no: 4 })
    //     .then((res)=>{
    //         console.log(res);
    //     })
    //     .catch((err)=>{
    //         console.log(err);
    //     })
    // }

    // useEffect(()=>{
    //     selectResumeInfo();
    // },[])



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
    //최대 1개의 객체만 존재하도록 관리
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) =>({
        ...prev,
        newEducation : [ // newEducation은 항상 1개 항목만 있을 것이므로 직접 업데이트
            {
                ...prev.newEducation[0], // 현재 입력 중인 첫 번째 (유일한) 항목
                [name]: value,
            }
        ]
    }));
  };

  //학력 입력 날짜 변경 핸들러(Calendar 컴포넌트의 onChangeStartDate, onChangeEndDate prop에 연결)
  const handleEducationDateChange = (field, date) => {
    setFormData((prev)=>({
        ...prev,
        newEducation: [
            {
                ...prev.newEducation[0],
                [field]: date,
            }
        ]
    }))
  }

   //학력 추가 버튼 클릭 시 새 학력 항목 추가 ! 근데 기존 학력과 별도로, 새로운 학력 배열에 추가
  const addEducation = () => {
// 이미 새로운 학력 입력 중이거나, 총 학력이 4개 이상이면 추가하지 않음
    if (formData.newEducation.length > 0 || (formData.education.length + formData.newEducation.length) >= 4) {
        return;
    }
    setFormData((prev) =>({
        ...prev,
        newEducation: [{
            school_name:'',
            major:'',
            sub_major: '',
            gpa:'',
            enroll_date: null, 
            grad_date: null,
            //새로운 항목 추가 시에도 edu_no 부여하기.
            edu_no: Date.now(), //edu_no: 1750118974000
        }],
    }));
  };

   // 새로 추가한 학력 '저장' 버튼 클릭 시 호출
   const saveEducation = () => {
    if (formData.newEducation.length === 0) return; //저장할 내용이 없으면 리턴

    const newEduEntry = formData.newEducation[0];

    //필수 필드 유효성 검사(예시)
    if (!newEduEntry.school_name || !newEduEntry.major || !newEduEntry.enroll_date || !newEduEntry.grad_date){
        alert('학교명, 전공, 입학일, 졸업일은 필수 입력 사항입니다.')
        return;
    }
    setFormData((prev)=>({
        ...prev,
        education:[
            ...prev.education,
            {...newEduEntry, edu_no: Date.now()} //⭐ 저장 시에도 고유 edu_no 부여 ⭐
        ],
        newEducation: [] // 임시 학력 데이터 비우기 ...
    }))
   }
   //취소 버튼으로 바꿔야 함. 
 // 새로 추가한 학력 '삭제' 버튼 클릭 시 호출 (저장 안 하고 버림)
    // const removeNewEducation = () => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         newEducation: [], // 임시 학력 데이터 비우기
    //     }));
    // };


  // 새로 추가한 학력 '취소' 버튼 클릭 시 호출 (저장 안 하고 버림)
    const removeNewEducation = () => {
        setFormData((prev) => ({
            ...prev,
            newEducation: [], // 임시 학력 데이터 비우기
        }));
    };


  //학력 삭제 핸들러 (인덱스)
    // const removeEducation = (index) => {
    //     setFormData((prev) => {
    //         const newEduEntries = [...prev.newEducation];
    //         newEduEntries.splice(index,1); // 해당 인덱스의 학력 항목 삭제
    //         return {
    //             ...prev,
    //             newEducation: newEduEntries, // 업데이트된 학력 배열로 설정
    //         }
    //     })
    // }



    // const removeStoredEducation = (eduNoToRemove) => {
    //     setFormData((prev) => ({
    //         ...prev,
    //         education: prev.education.filter(edu => edu.edu_no !== eduNoToRemove),
    //     }));
    // };
    //edu.edu_no !== idToRemove가 true인 항목만 필터링 undefined면 
    //undefined !== undefined가 false이므로 true를 걸러내지 못함.

    // --- ⭐⭐⭐ 핵심 디버깅 추가된 부분 ⭐⭐⭐ ---
    // 목록에 올라간 학력 항목 삭제 핸들러
    const removeStoredEducation = (eduNoToRemove) => {
        console.log(`removeStoredEducation 호출됨. 삭제하려는 ID: ${eduNoToRemove}`); // 디버깅

        setFormData((prev) => {
            // 필터링 전의 education 배열 상태
            console.log("Filter 전 education 배열:", prev.education); // 디버깅

            const updatedEducation = prev.education.filter(edu => {
                const isMatch = edu.edu_no === eduNoToRemove;
                console.log(`  항목 ID: ${edu.edu_no}, 삭제 타겟 ID: ${eduNoToRemove}, 일치 여부: ${isMatch}`); // 디버깅: 각 항목별 비교
                return !isMatch; // 일치하지 않는 항목만 새로운 배열에 포함 (즉, 일치하는 항목은 제외)
            });

            // 필터링 후의 education 배열 상태
            console.log("Filter 후 updatedEducation 배열:", updatedEducation); // 디버깅

            return {
                ...prev,
                education: updatedEducation,
            };
        });
    };
    // --- ⭐⭐⭐ 핵심 디버깅 추가 끝 ⭐⭐⭐ ---

    


//=======================경력 ==================================================

  // 경력 사항 추가 핸들러. 근데! 기존 경력과 별도로, 새로운 경력 배열에 추가

  const addExperience = () => {
    setFormData((prev) =>({
        ...prev,
        newExperience: [
           ...prev.newExperience,
           {
            start_date: null,
            end_date: null,
            company_name: '',
            position: '',
            notes: '',
           }
        ]
    }));
  }

  // 경력 사항 삭제 핸들러 (인덱스)
  const removeExperience = (index) => {
    setFormData((prev) => {
      const newExpEntries = [...prev.newExperience];
      newExpEntries.splice(index, 1); // 해당 인덱스의 경력 항목 삭제
      return {
        ...prev,
        newExperience: newExpEntries, // 업데이트된 경력 배열로 설정
      };
    });
  };

  /// 경력 입력 변경 핸들러 (newExperience 배열에 적용)
  const handleExperienceChange = (index, e) => {
    const {name, value} = e.target;
    setFormData((prev) => {
        const newExpEntries = [...prev.newExperience]; // 기존 experience 배열 복사
        newExpEntries[index] = { // 해당 인덱스의 항목만 업데이트
            ...newExpEntries[index],
            [name]: value,
        };
        return {
            ...prev,
            newExperience: newExpEntries, // 업데이트된 experience 배열로 설정
        };
    });
  }

   //경력 입력 날짜 변경 핸들러
  const handleExperienceDateChange = (index, field, date) => {
    setFormData((prev) => {
        const newExpEntries = [...prev.newExperience];
        newExpEntries[index] = {
            ...newExpEntries[index],
            [field]: date,
        };
        return {
            ...prev,
            newExperience: newExpEntries, // 업데이트된 experience 배열로 설정
        }
    })
  }


 
    return (
        <>
            <div className="resume-banner">
                <img src="/resources/img/banner.png" alt="Banner" />
            </div>
        <div className='resume_wrap'>
            <ResumeSidebar/>
            <div className='resume-content'>
                {/* <div style={{ marginLeft: '200px', padding: '200px' }}> */}
                <div className='resume-content-form'>
                <h1>이력서 작성</h1>
                <p>
                    이력서를 작성하는 페이지입니다.
                    <br />
                </p>
            <form >
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
                            <div>
                                <input 
                                    type="text" 
                                    readOnly 
                                    name="skillList" 
                                    // onChange={handleChange} 
                                     // formData.skillList에 있는 각 스킬의 skill_name을 쉼표로 연결하여 표시
                                    value={formData.skillList.map(skill => skill.skill_name).join(', ')}
                                    />
                                    </div>
                            <DropDown
                                options={dummySkillOptions}
                                // selected={formData.skillList}
                                selected={''} // 드롭다운이 단일 선택이 아닌 추가 기능이므로 selected는 필요 없습니다.
                                placeholder="기술/툴을 선택하세요"
                                onSelect={(selectedSkillName)=>{
                                    setFormData((prev)=>{
                                        const isAlreadyAdded = prev.skillList.some(
                                            (item)=> item.skill_name === selectedSkillName
                                        );
                                    if (isAlreadyAdded){
                                        alert(`${selectedSkillName}은 이미 추가된 기술입니다.`)
                                        return prev;
                                    } 
                                     // ⭐ SkillVO 구조에 맞춰 새로운 스킬 객체 생성 ⭐
                                    
                                    const newSkill = {
                                        user_no: user.userNo, // Resume 컴포넌트의 userNo를 사용
                                        //exp_level: selectedExpLevel, // 프론트에서 받아오는 숙련도 (UI에서 선택된 값)
                                        exp_level: '중', // ⭐ 초기 숙련도. 필요시 UI 추가하여 사용자 입력받기 ⭐
                                        skill_tool: 'pc', // 드롭다운에서 선택된 스킬 이름을 그대로 사용
                                        skill_name: 'pc', // 드롭다운에서 선택된 스킬 이름을 그대로 사용
                                        // group_name과 group_code는 백엔드에서 처리해주거나, 프론트에서 매핑 필요.
                                        // 현재는 AI 자기소개서 생성 목적이므로 필수로 채우지 않아도 될 수 있습니다.
                                        skill_code: selectedSkillName,
                                        group_code: 'IT', // 또는 적절한 기본값
                                        group_name: '기술스택', // 또는 적절한 기본값
                                    };

                                    return {
                                        ...prev,
                                        skillList: [...prev.skillList, newSkill],
                                    };
                                    })
                                    console.log("선택한 기술/툴:", selectedSkillName); // 선택한 옵션 확인
                                }}
                                />
                                {/* 드롭다운 컴포넌트 사용 */}
                                {/* 스킬 목록을 렌더링하는 부분. ul 태그로 감싸는 것이 일반적입니다. */}
                            {formData.skillList.length > 0 && (
                                <ul className="skill-list"> {/* ul 태그 추가 */}
                                    {formData.skillList.map((skill, index) => (
                                        <li key={index}>
                                            <span>
                                                {skill.skill_code}
                                            </span>
                                            {/* 숙련도를 표시하고 싶다면: <span> ({skill.exp_level})</span> */}
                                            {/* 삭제 버튼 추가 예시: <button type="button" onClick={() => removeSkill(index)}>삭제</button> */}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            </label> {/* DropDown 컴포넌트와 스킬 목록을 감싸는 label 태그의 닫힘 */}

                        <br />
                    <label>
                        <div><span>링크</span></div>
                        <div><input type="text" name="link_url" onChange={handleChange} value={formData.link_url}/></div>
                    </label>
                        <br />
                        {/* ---기존 학력 섹션 --- */}
                    <label>
                        <div><span>학력</span></div>
                    </label>
                        {formData.education.length > 0 ? (
                            <div className="education-display-section">
                                <h4>기존 학력 정보</h4>
                                {formData.education.map((edu) => {
                                     // 디버깅: 각 렌더링되는 학력 항목의 ID와 학교명 확인
                            //console.log(`렌더링 중인 학력 항목: ID=${edu.edu_no}, 학교명=${edu.school_name}`);
                            return (
                                      <div key={`edu-${edu.edu_no}`} className="education-row-display">
                                        <p><strong>학교명:</strong> {edu.school_name}</p>
                                        <p><strong>입학일:</strong> {edu.enroll_date ? new Date(edu.enroll_date).toLocaleDateString() : 'N/A'}
                                            {" "}
                                            <strong>졸업일:</strong> {edu.grad_date ? new Date(edu.grad_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <p><strong>전공:</strong> {edu.major}</p>
                                        {edu.sub_major && <p><strong>복수전공:</strong> {edu.sub_major}</p>}
                                        {edu.gpa && <p><strong>학점:</strong> {edu.gpa}</p>}
                                    <PrettyBtn 
                                            type="button" 
                                            size="sm" 
                                            onClick={() => removeStoredEducation(edu.edu_no)} // id를 전달하여 해당 항목 삭제
                                            style={{ marginLeft: '10px' }} // 버튼 간격 조절
                                        >
                                            삭제
                                        </PrettyBtn>
                                    </div>
                                );
                })}
                            </div>
                        ) : (
                            <p>등록된 기존 학력 정보가 없습니다.</p>
                        )}
                    {/* 신규 학력 입력 버튼 */}
                    {(formData.education.length + formData.newEducation.length) < 4 && formData.newEducation.length === 0 && (
                        <label>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>새 학력 추가</span>
                                <PrettyBtn type="button" size="sm" onClick={addEducation} >새 학력 추가</PrettyBtn>
                            </div>
                        </label>
                    )}
                         {formData.newEducation.length > 0 && (// newEducation 배열을 맵핑하여 입력 필드 생성
                            <div className="education-row-input">
                                <input type="text" name="school_name" placeholder="학교명" onChange={handleEducationChange} value={formData.newEducation[0]?.school_name || ''}/>
                                <Calendar
                                    selectedStartDate={formData.newEducation[0]?.enroll_date}
                                    startplaceholder="입학일"
                                    onChangeStartDate={(date) => handleEducationDateChange('enroll_date', date)}
                                    selectedEndDate={formData.newEducation[0]?.grad_date}
                                    endplaceholder="졸업일"
                                    onChangeEndDate={(date) => handleEducationDateChange('grad_date', date)}
                                />
                                        <input type="text" name="major" placeholder="전공" onChange={handleEducationChange} value={formData.newEducation[0]?.major || ''} />
                                <input type="text" name="sub_major" placeholder="복수전공" onChange={handleEducationChange} value={formData.newEducation[0]?.sub_major || ''}/>
                                <input type="text" name="gpa" placeholder="학점" onChange={handleEducationChange} value={formData.newEducation[0]?.gpa || ''}/>
                                <PrettyBtn type="button" size="sm" onClick={saveEducation}>추가</PrettyBtn>
                                <PrettyBtn type="button" size="sm" onClick={removeNewEducation}>취소</PrettyBtn>
                            </div>
                        )}
                        <br />


                    {/* --- 경력 섹션 --- */}
                <label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>경력</span>
                    </div>
                </label>
                        {formData.experience.length > 0 ? (
                            <div className="experience-display-section">
                                <h4>기존 경력 정보</h4>
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="experience-row-display">
                                        <p><strong>회사명:</strong> {exp.company_name}</p>
                                        <p><strong>직무:</strong> {exp.position}</p>
                                        <p>
                                            <strong>기간:</strong> {exp.start_date ? new Date(exp.start_date).toLocaleDateString() : 'N/A'}
                                            {' '}~{' '}
                                            {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <p><strong>상세내용:</strong> {exp.notes}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>등록된 기존 경력 정보가 없습니다.</p>
                        )}
                            {/* 무조건 렌더링: exp.position이 null, undefined, 빈 문자열이라도 <p><strong>직무:</strong> </p>가 항상 렌더링. null도 렌더링됨*/}
                            {/* <p><strong>직무:</strong> {exp.position}</p> */}
                            {/* 조건부 렌더링: exp.position이 truthy한 경우에만 <p> 요소가 렌더링. null은 렌더링 안됨 */}
                            {/* {exp.position && <p><strong>직무:</strong> {exp.position}</p>} */}
                            {/* <p><strong>상세내용:</strong> {exp.notes}</p> */}
                        <br />
                        {/* 경력 추가 버튼*/}
                        {(formData.experience.length + formData.newExperience.length) < 4 && formData.newExperience.length === 0 && (
                        <label>
                            <div style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>새 경력 추가</span>
                                <PrettyBtn type='button' size='sm' onClick={addExperience} disabled={(formData.experience.length + formData.newExperience.length) >= 4}>새 경력 추가</PrettyBtn>
                            </div>
                        </label>
                        )}
                        {formData.newExperience.map((exp, index)=> (// newExperience 배열을 맵핑하여 입력 필드 생성
                            <div key={`new-exp-${index}`} className='experience-row-input'>
                                <div className='experience-row-input-group'>
                                <Calendar
                                    selectedStartDate={exp.start_date}
                                    startplaceholder="입사일"
                                    onChangeStartDate={(date)=>handleExperienceDateChange(index, 'start_date', date)}
                                    selectedEndDate={exp.end_date}
                                    endplaceholder="퇴사일"
                                    onChangeEndDate={(date) => handleExperienceDateChange(index, 'end-date', date)}
                                />
                                    <input type='text' name='company_name' placeholder='회사명' onChange={(e)=>handleExperienceChange(index, e)} value={exp.company_name||''}/>
                                </div>
                                <input type = 'text' name='position' placeholder='직무' onChange={(e) => handleExperienceChange(index, e)} value={exp.position||''}/>
                             <textarea  name='notes' placeholder='상세내용 (주요 업무 및 성과를 구체적으로 기재)'
                                onChange={(e) => handleExperienceChange(index, e)} value={exp.notes || ''}
                                rows="3"/>
                            <PrettyBtn type="button" size="sm" onClick={() => removeExperience(index)} disabled={formData.newExperience.length <= 0}>삭제</PrettyBtn>
                        </div>
                    ))}


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
                         <ResumeAiCoverLetter
                        formData={formData}
                        myCoverLetter={formData.coverLetter}
                        setMyCoverLetter={(value) => setFormData({ ...formData, coverLetter: value })}
                        setFormData={setFormData} // formData 상태를 자식 컴포넌트에 전달
                        userNo={user.userNo} 
                     />
                     <br/>
                        <br/>
                        <label>
                            <div><span>Template</span></div>
                        </label>
                            <div className='templete-test'>
                                <TemplateSelection>템플렛선택</TemplateSelection>
                            </div>
                        <br/>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <PrettyBtn onClick={handleSubmit}>이력서 저장</PrettyBtn>
                            <PrettyBtn onClick={pdfDownload}>이력서 저장 및 PDF 다운로드</PrettyBtn>
                        </div>
                    </form>
                </div>
                </div>
        </div>
    </>
    );

};

export default Resume;