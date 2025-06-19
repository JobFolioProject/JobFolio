 
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

    const [filePath, setFilePath] = useState("");

    const handleSubmit = async () => {

        const dataToSend = {
            ...formData,
            education: [...formData.education, ...formData.newEducation], // 기존 + 신규 학력
            experience: [...formData.experience, ...formData.newExperience], // 기존 + 신규 경력
            newEducation: undefined,      // 전송할 때는 필요 없으니 제거
            newExperience: undefined,
            skillList: [...formData.skillList, ...formData.newSkillList],
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

            setFilePath("");
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
        newSkillList:[],
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
                skillList : response.skillList || [],
                link_url : response.link_url || '', //db에 없음. input하는 값(db에 저장x)
                experience : response.careerHistoryList || [], // API로 불러온 경력
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
   

//==============================공통 함수로 필드 관리==========================================
//(공통)학력, 경력 입력 변경 핸들러 (몇 번째 학력,경력인지, 필드 이름, 값)
    //최대 1개의 객체만 존재하도록 관리

   const handleFieldChange = (e, type) => {
    const { name, value } = e.target;
    setFormData((prev) =>({
        ...prev,
        [type] : [ // newEducation은 항상 1개 항목만 있을 것이므로 직접 업데이트
            {
                ...prev[type][0], // 현재 입력 중인 첫 번째 (유일한) 항목
                [name]: value,
            }
        ]
    }));
  };

//(공통)학력, 경력 입력 날짜 변경 핸들러(Calendar 컴포넌트의 onChangeStartDate, onChangeEndDate prop에 연결)
  const handleFieldDateChange = (type,field, date) => {
    setFormData((prev)=>({
        ...prev,
        [type]: [
            {
                ...prev[type][0],
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


//(공통) 새로 추가한 항목 '저장' 버튼 클릭 시 호출
const saveFieldData = (type) => {
    if (!['newEducation', 'newExperience', 'newSkillList'].includes(type)) return;

    const fieldMap = {
        newEducation: {
            targetKey: 'education',
            requiredFields: [ 'edu_no', 'enroll_date', 'gpa', 'grad_date', 'major', 'sub_major'],
            idKey: 'edu_no' 
        },
        newExperience: {
            targetKey: 'experience',
            requiredFields: ['company_name', 'position', 'start_date', 'end_date', 'notes'],
            idKey: 'career_no'
        },
        newSkillList: {
            targetKey: 'skillList',
            requiredFields: ['group_code', 'skill_code', 'exp_level'],
            idKey: 'skill_code' //스킬코드가 고유하니까.
        }
    };
    
    const {targetKey, requiredFields, idKey} = fieldMap[type];
    const newEntry = formData[type][0];

    const missingField = requiredFields.find((field)=> !newEntry?.[field]);
    if (missingField){
        alert(`${missingField}은 필수 입력 항목입니다`);
        return;
    }
    //스킬 코드 중복 검사.skillList에 이미 있는 스킬인지 - skill_code가 고유값이므로
    if (type === 'newSkillList') {
        const isAlreadyAdded = formData.skillList.some(
            (item) => item.skill_code === newEntry.skill_code
        );
        if (isAlreadyAdded) {
            alert(`${newEntry.skill_code}은(는) 이미 추가된 기술입니다.`);
            return;
        }
    }

    // 저장
    setFormData((prev)=>({
        ...prev,
        [targetKey]: [
            ...prev[targetKey],
            {...newEntry},
        ],
        [type]:[], //임시 입력 데이터 비우기
    }));
}


  //(공통) 새로 추가하는 칸의 '취소' 버튼 클릭 시 호출 (저장 안 하고 버림)
    const removeNewField = (e, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: [], // 임시 학력 데이터 비우기
        }));
    };


    // --- ⭐⭐⭐ 핵심 디버깅 추가된 부분 ⭐⭐⭐ ---
    //(공통) 목록에 올라간 학력 항목 삭제 핸들러
    const removeStagedField = (type, idToRemove) => {
        const fieldMap = {
            education: 'edu_no',
            experience: 'career_no',
            skillList: 'skill_code',
        };

        const idKey = fieldMap[type];
        if (!idKey){
            console.error('삭제불가함. 유효하지 않은 type, idkey가 정의되지 않음');
            return;
        }

        setFormData((prev)=>{
            const originalList = prev[type];
            const updatedList = originalList.filter((item)=>item[idKey] !== idToRemove);

        console.log(`[${type}] 삭제 전 목록:`, originalList);
        console.log(`[${type}] 삭제할 ID:`, idToRemove);
        console.log(`[${type}] 삭제 후 목록:`, updatedList);

        return {
            ...prev,
            [type] : updatedList,
        };
        });
    }
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

//==========스킬 추가=============================
//기술 추가 버튼 클릭 시 새  항목 추가 ! 근데 기존 기술과 별도로, 새로운 기술 배열에 추가
  const addSkill = () => {
// 이미 새로운 학력 입력 중이거나, skillList 총 기술이 4개 이상이면 추가하지 않음
    if (formData.newSkillList.length > 0 || (formData.skillList.length + formData.newSkillList.length) >= 4) {
        return;
    }
    setFormData((prev) =>({
        ...prev,
        newSkillList: [{
            group_code:'',
            skill_code: '',
            exp_level:'',
            skill_tool:'',
            user_no: user.userNo, 
            //새로운 항목 추가 시에도 skill_no 부여하기.

        }],
    }));
  };


  const handleDropdownChange = (name, value, type) => {
    // handleFieldChange가 예상하는 'e' (이벤트 객체) 형태로 객체를 생성
    handleFieldChange({ target: { name: name, value: value } }, type, 0); // newSkillList는 index 0 사용
};
 
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
                            <div><span>기술/툴</span></div>
                        </label>
                            {formData.skillList.length > 0 ?(
                                <div className="skill-display-section"> 
                                <h4>기존 기술 정보</h4>
                                    {formData.skillList.map((skill) =>{
                                        return (
                                            <div key={`skill-${skill.skill_code}`} className='skill-row-display'>
                                                <PrettyBtn 
                                                    type="button" 
                                                    size="sm" 
                                                    onClick={() => removeStagedField('skillList', skill.skill_code)} // id를 전달하여 해당 항목 삭제
                                                    style={{ marginRight: '10px', padding: '5px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                     // 버튼 간격 조절
                                                >
                                                <img
                                                    src="/resources/img/minus_circle.png" // ⭐ 로컬에 저장된 이미지 파일 경로 ⭐
                                                    alt="기술 삭제" // ⭐ 접근성을 위한 alt 텍스트 필수 ⭐
                                                    style={{width: '20px', height: '20px', border: 'none', backgroundColor: 'transparent'}}
                                                />
                                        </PrettyBtn>
                                        <p><strong>분야:</strong>{skill.group_code}</p>
                                        {skill.group_code && <p><strong>기술:</strong>{skill.skill_code}</p>}
                                        {skill.skill_code && <p><strong>숙련도:</strong>{skill.exp_level}</p>}
                                        </div>
                                        )
                                    })}
                                </div>
                            ):(
                                <p>등록된 기존 기술 정보가 없습니다</p>
                            )}

                             {/* DropDown 컴포넌트와 스킬 목록을 감싸는 label 태그의 닫힘 */}
                            {/* 신규 기술 입력 버튼 */}
                            {formData.newSkillList.length === 0 && formData.skillList.length < 4 && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <PrettyBtn type="button" size="sm" onClick={addSkill} >새 기술 추가</PrettyBtn>
                                    </div>
                                </div>
                            )} 
                            {formData.newSkillList.length > 0 && (// newSkill 배열을 맵핑하여 입력 드롭다운 생성
                                <div className='skill-row-input'>
                                    <DropDown
                                        options={['IT', '디자인', '경제']}
                                        // selected={formData.skillList}
                                        selected={formData.newSkillList[0]?.group_code || ''}
                                        placeholder="분야 선택"
                                        onSelect={(value)=>handleDropdownChange('group_code', value, 'newSkillList' )}/>
                                    <DropDown
                                        options={dummySkillOptions}
                                        // selected={formData.skillList}
                                        selected={formData.newSkillList[0]?.skill_code || ''}
                                        placeholder="분야 선택"
                                        onSelect={(value)=>handleDropdownChange('skill_code', value, 'newSkillList' )}/>
                                    <DropDown
                                        options={['상','중','하']}
                                        // selected={formData.skillList}
                                        selected={formData.newSkillList[0]?.exp_level || ''}
                                        placeholder="분야 선택"
                                        onSelect={(value)=>handleDropdownChange('exp_level', value, 'newSkillList' )}/>

                                    <PrettyBtn type="button" size="sm" onClick={() => saveFieldData('newSkillList')} style={{ marginLeft: '10px' }}>저장</PrettyBtn>
                                    <PrettyBtn type="button" size="sm" onClick={(e) => removeNewField(e, 'newSkillList')} style={{ marginLeft: '5px' }}>취소</PrettyBtn>
                                </div>
                            )}

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
                                        <PrettyBtn 
                                            type="button" 
                                            size="sm" 
                                            onClick={() => removeStagedField('education', edu.edu_no)} // id를 전달하여 해당 항목 삭제
                                            style={{ marginLeft: '10px' }} // 버튼 간격 조절
                                        >
                                            <img
                                                src="/resources/img/minus_circle.png" // ⭐ 로컬에 저장된 이미지 파일 경로 ⭐
                                                alt="경력 삭제" // ⭐ 접근성을 위한 alt 텍스트 필수 ⭐
                                                style={{
                                                    width: '20px', // 아이콘의 너비 (필요에 따라 조절)
                                                    height: '20px', // 아이콘의 높이 (필요에 따라 조절)
                                                    border: 'none', // 이미지에 기본적으로 생길 수 있는 테두리 제거
                                                    backgroundColor: 'transparent'
                                                }}
                                            />
                                        </PrettyBtn>
                                        <p><strong>학교명:</strong> {edu.school_name}</p>
                                        <p><strong>입학일:</strong> {edu.enroll_date ? new Date(edu.enroll_date).toLocaleDateString() : 'N/A'}
                                            {" "}
                                            <strong>졸업일:</strong> {edu.grad_date ? new Date(edu.grad_date).toLocaleDateString() : 'N/A'}
                                        </p>
                                        <p><strong>전공:</strong> {edu.major}</p>
                                        {edu.sub_major && <p><strong>복수전공:</strong> {edu.sub_major}</p>}
                                        {edu.gpa && <p><strong>학점:</strong> {edu.gpa}</p>}
                                    </div>
                                );
                })}
                            </div>
                        ) : (
                            <p>등록된 기존 학력 정보가 없습니다.</p>
                        )}
                    {/* 신규 학력 입력 버튼 */}
                    {(formData.education.length + formData.newEducation.length) < 4 && formData.newEducation.length === 0 && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>새 학력 추가</span>
                                <PrettyBtn type="button" size="sm" onClick={addEducation} >새 학력 추가</PrettyBtn>
                            </div>
                        </div>
                    )}
                         {formData.newEducation.length > 0 && (// newEducation 배열을 맵핑하여 입력 필드 생성
                            <div className="education-row-input">
                                <input type="text" name="school_name" placeholder="학교명" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.school_name || ''}/>
                                <Calendar
                                    selectedStartDate={formData.newEducation[0]?.enroll_date}
                                    startplaceholder="입학일"
                                    onChangeStartDate={(date) => handleFieldDateChange('newEducation','enroll_date', date)}
                                    selectedEndDate={formData.newEducation[0]?.grad_date}
                                    endplaceholder="졸업일"
                                    onChangeEndDate={(date) => handleFieldDateChange('newEducation','grad_date', date)}
                                />
                                        <input type="text" name="major" placeholder="전공" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.major || ''} />
                                <input type="text" name="sub_major" placeholder="복수전공" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.sub_major || ''}/>
                                <input type="text" name="gpa" placeholder="학점" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.gpa || ''}/>
                                <PrettyBtn type="button" size="sm" onClick={()=>saveFieldData('newEducation')}>저장</PrettyBtn>
                                <PrettyBtn type="button" size="sm" onClick={(e)=>removeNewField(e, 'newEducation')}>취소</PrettyBtn>
                            </div>
                        )}
                        <br />


                    {/* --- 경력 섹션 --- */}
                    {/* exp.career_no를 key로 사용하도록 코드를 업데이트. 만약 career_no가 null 또는 undefined일 경우를 대비하여 index를 **비상용(fallback)**으로 남겨둠 */}
                <label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>경력</span>
                    </div>
                </label>
                        {formData.experience.length > 0 ? (
                            <div className="experience-display-section">
                                <h4>기존 경력 정보</h4>
                                {formData.experience.map((exp, index) => (
                                    <div key={exp.career_no || index} className="experience-row-display">
                                        <PrettyBtn
                                            type="button"
                                            size="sm"
                                            // exp.career_no가 있다면 그걸 사용하고, 없다면 index를 fallback으로 사용합니다.
                                            // removeStagedField 함수는 학력(education)과 경력(experience) 모두에 사용될 수 있도록 일반화된 이름입니다.
                                            onClick={() => removeStagedField('experience', exp.career_no || index)}
                                            style={{ marginRight: '10px' }} // 버튼과 텍스트 사이 간격 조절
                                        >
                                            <img
                                                src="/resources/img/minus_circle.png" // ⭐ 로컬에 저장된 이미지 파일 경로 ⭐
                                                alt="경력 삭제" // ⭐ 접근성을 위한 alt 텍스트 필수 ⭐
                                                style={{
                                                    width: '20px', // 아이콘의 너비 (필요에 따라 조절)
                                                    height: '20px', // 아이콘의 높이 (필요에 따라 조절)
                                                    border: 'none', // 이미지에 기본적으로 생길 수 있는 테두리 제거
                                                    backgroundColor: 'transparent'
                                                }}
                                            />
                                        </PrettyBtn>
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
                        <div>
                            <div style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <span>새 경력 추가</span>
                                <PrettyBtn type='button' size='sm' onClick={addExperience}>새 경력 추가</PrettyBtn>
                            </div>
                        </div>
                        )}
                        {formData.newExperience.length > 0 && (// newEducation 배열을 맵핑하여 입력 필드 생성
                            <div className='experience-row-input'>
                                <div className='experience-row-input-group'>
                                <Calendar
                                    selectedStartDate={formData.newExperience[0]?.start_date}
                                    startplaceholder="입사일"
                                    onChangeStartDate={(date)=>handleFieldDateChange('newExperience', 'start_date', date)}
                                    selectedEndDate={formData.newExperience[0]?.end_date}
                                    endplaceholder="퇴사일"
                                    onChangeEndDate={(date) => handleFieldDateChange('newExperience', 'end_date', date)}
                                />
                                    <input type='text' name='company_name' placeholder='회사명' onChange={(e)=>handleFieldChange(e, 'newExperience')} value={formData.newExperience[0]?.company_name || ''}/>
                                </div>
                                <input type = 'text' name='position' placeholder='직무' onChange={(e) => handleFieldChange(e, 'newExperience')} value={formData.newExperience[0]?.position||''}/>
                             <textarea  name='notes' placeholder='상세내용 (주요 업무 및 성과를 구체적으로 기재)'
                                onChange={(e) => handleFieldChange(e, 'newExperience')} value={formData.newExperience[0]?.notes || ''}
                                rows="3"/>
                            {/* <PrettyBtn type="button" size="sm" onClick={() => removeExperience(index)} disabled={formData.newExperience.length <= 0}>삭제</PrettyBtn> */}
                            <PrettyBtn type="button" size="sm" onClick={()=>saveFieldData('newExperience')}>저장</PrettyBtn>
                            <PrettyBtn type="button" size="sm" onClick={(e)=>removeNewField(e, 'newExperience')}>취소</PrettyBtn>


                        </div>
                    )}


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