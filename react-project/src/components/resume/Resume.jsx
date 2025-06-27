 
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
import { alignItems, display, justifyContent, major, padding } from '@mui/system';
import axios from "../../utils/axiosConfig";
import Loading from "../common/Loading";
import ResumeModal from './ResumeModal';
import Banner from '../common/Banner';


const Resume = () => {
    // 이력서 작성 페이지 컴포넌트
    // 이력서 작성 폼을 포함하고 있으며, 사이드바를 사용하여 다른 이력서 관련 페이지로 이동할 수 있습니다.

    const { user, isAuthenticated } = useAuth();
    const [filePath, setFilePath] = useState("");
    const [loading, setLoading] = useState(false);
    const [download, setDownload] = useState(false);

    //이력서 저장
    const handleSubmit = async () => {
        setLoading(true);
        setDownload(true);
        const dataToSend = {
            ...formData,
            education: [...formData.education, ...formData.newEducation],
            experience: [...formData.experience, ...formData.newExperience],
            newEducation: undefined,
            newExperience: undefined,
            skillList: [...formData.skillList, ...formData.newSkillList],
            languageList: [...formData.languageList, ...formData.newLanguage],
            certificateList: [...formData.certificateList, ...formData.acquired],
        };
            try {
                const res = await axios.post('/api/resume/insertResumeInfo', dataToSend);
                if (res.result === 1) {
                const path = res.filePath;
                setFilePath(path);
                alert('이력서 저장이 완료되었습니다');
                return path;       // ← 여기서 반드시 리턴!
                } else {
                alert('이력서 저장에 실패했습니다.');
                throw new Error('저장 실패');
                }
            } catch (err) {
                console.error(err);
                throw err;
            } finally {
                setLoading(false);
            }
    };

    //이력서 PDF로 저장
    const pdfSubmit = async(usedFilePath) =>{
        try {
            const pathToUse = usedFilePath || filePath;
            const res = await axios.post(
            '/api/resume/exportPdf',
            { filePath: pathToUse },
            { responseType: 'arraybuffer', maxBodyLength: Infinity }
            );
            const blob = new Blob([res], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            link.remove();

            setFilePath('');
            setDownload(false);
        } catch (err) {
            console.error(err.response || err);
            alert('PDF 다운로드 중 오류가 발생했습니다.');
        }
    };

    //이력서 저장 및 PDF로 저장
    const pdfDownload = async () => {
        try {
            if (!download) {
            const newPath = await handleSubmit();
            //  await new Promise(r => setTimeout(r, 1000));
            await pdfSubmit(newPath);
            } else {
            await pdfSubmit();
            }
        } catch (err) {
            // 이미 내부에서 alert 처리하므로 별도 처리 생략 가능
        }
    };


    // 이력서 작성 폼 데이터 상태
    // U-data
    const [formData, setFormData] = useState({
        user_name : user.userName,
        user_no: user.userNo,
        title: '',
        desired_position: '',
        link_url: '',
        //API로 불러온 기존데이터(DB에서 조회해온)
        experience: [],
        education: [],
        skillList: [],
        certificateList:[],
        languageList:[],
        // 여기에 항상 최대 1개의 객체만 존재하도록 관리 //// 새로 추가 중인 (임시) 경력 데이터
        newExperience: [], 
        newEducation: [], 
        newSkillList:[],
        newCertificate:[],
        newLanguage:[],
        coverLetter: '', // 자기소개서 상태 추가
        template_no : '', //
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
                template_no : response.template_no || 4, //mypage에서 조회하는 것 아님. 즉 `/api/myPage/${userNo}/career` api 사용x
                // newExperience와 newEducation은 그대로 빈 배열로 유지
                languageList : response.languageSkillList || [],
                certificateList : response.certificateList || [],
            }));
            console.log('초기 데이터 확인', response);
        } catch (error) {
            console.log("데이터를 불러올 수 없습니다", error);

            // 에러 발생 시 기존 데이터 초기화 (신규 데이터는 영향 없음)
            setFormData((prev) => ({
            ...prev,
            experience: [],
            education: [],
            languageList: [],
            certificateList: [],
        }));
    }
};

    // 데이터 호출
    useEffect(() => {
        if (user.userNo !== null) {
            getMyCareerInfo();
            console.log('user:' ,user);
        }
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }


// 각 섹션의 펼침 상태 관리 state 추가    
    const [showSkillDetails, setShowSkillDetails] = useState(false);
    const [showLanguageDetails, setShowLanguageDetails] = useState(false);
    const [showEducationDetails, setShowEducationDetails] = useState(false);
    const [showExperienceDetails, setShowExperienceDetails] = useState(false);
    const [showCertificateDetails, setShowCertificateDetails] = useState(false);
 // 상세보기 토글 함수
    const toggleDetails = (sectionName) => {
        switch (sectionName) {
            case 'skill':
                setShowSkillDetails(!showSkillDetails);
                break;
            case 'language':
                setShowLanguageDetails(!showLanguageDetails);
                break;
            case 'education':
                setShowEducationDetails(!showEducationDetails);
                break;
            case 'experience':
                setShowExperienceDetails(!showExperienceDetails);
                break;
            case 'certificate':
                setShowCertificateDetails(!showCertificateDetails);
                break;
            default:
                break;
        }
    };


//스킬
  const [groupCodeList, setGroupCodeList] = useState([]);
  const [detailCodeList, setDetailCodeList] = useState({});
  const skillLevelList = ["하", "중", "상"];
  useEffect(() => {
    const getGroupCode = async () => {
      await axios
        .get("/api/resume/selectSkillGroupCode")
        .then((res) => {
          setGroupCodeList(res);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getGroupCode();
  }, []);


  const handleGroupCodeChange = async (group_code) => {
    await axios
      .get("/api/resume/selectSkillDetailCode", {
        params: { group_code: group_code },
      })
      .then((res) => {
        // setDetailCodeList((prev) => ({
        //   ...prev,
        //   [formData.newSkillList.group_code]: res,
        // }));
        setDetailCodeList(res);
        setFormData((prev) => ({
            ...prev,
            newSkillList: prev.newSkillList.map((skill, index) =>
                // 첫 번째 newSkillList 항목만 대상으로 합니다.
                index === 0
                    ? { ...skill, group_code: group_code, skill_code: '' } // skill_code를 빈 문자열로 설정
                    : skill
            ),
        }));
      })
      .catch((err) => {
        console.error(err);
        setFormData((prev) => ({
            ...prev,
            newSkillList: prev.newSkillList.map((skill, index) =>
                index === 0 ? { ...skill, group_code: group_code, skill_code: '' } : skill
            ),
        }));
      });

  };

  const handleDetailCodeChange = (index, skill_code) => {
    setFormData((prev) => ({
      ...prev,
      skillList: prev.skillList.map((item, idx) =>
        idx === index ? { ...item, skill_code } : item
      ),
    }));
  };

  const handleSkillLevelChange = (index, exp_level) => {
    setFormData((prev) => ({
      ...prev,
      skillList: prev.skillList.map((item, idx) =>
        idx === index ? { ...item, exp_level } : item
      ),
    }));
  };
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
const handleFieldDateChange = (type, field, date) => {
    console.log("date received by handleFieldDateChange:", date);
console.log("date type received:", typeof date);
console.log("formData after date change:", formData);
    setFormData(prev => ({
        ...prev,
        // 해당 'type'의 배열을 순회하면서 첫 번째 항목(index === 0)만 업데이트합니다.
        [type]: prev[type].map((item, index) =>
            index === 0 ? {
                ...item,
                [field]: date ? date.toISOString().slice(0,10) : null // Calendar 컴포넌트에서 받은 Date 객체를 그대로 저장
            } : item // 첫 번째 항목이 아니면 기존 항목을 그대로 반환
        )
    }));
};



//(공통) 새로 추가한 항목 '저장' 버튼 클릭 시 호출
const saveFieldData = (type) => {
console.log("formData after save:", formData);
console.log("acquired_date type:", typeof formData.newCertificate[0]?.acquired_date);
console.log("acquired_date value:", formData.newCertificate[0]?.acquired_date);

    if (!['newEducation', 'newExperience', 'newSkillList', 'newLanguage', 'newCertificate'].includes(type)) return;

    const fieldMap = {
        newEducation: {
            targetKey: 'education',
            requiredFields: [ 'edu_no', 'enroll_date', 'gpa', 'major', 'sub_major'],
            idKey: 'edu_no' 
        },
        newExperience: {
            targetKey: 'experience',
            requiredFields: ['company_name', 'position', 'start_date', 'notes'],
            idKey: 'career_no'
        },
        newSkillList: {
            targetKey: 'skillList',
            requiredFields: ['group_code', 'skill_code', 'exp_level'],
            idKey: 'skill_code' //스킬코드가 고유하니까.
        },
        newLanguage: {
            targetKey: 'languageList',
            requiredFields: ['language', 'level'],
            idKey: 'language' //language가 고유하니까.
        },
        newCertificate: {
            targetKey : 'certificateList',
            requiredFields : ['certificate_name', 'certificate_no', 'acquired_date', 'issuing_org'],
            idKey : 'certificate_name'
        }
    };
    
    const {targetKey, requiredFields, idKey} = fieldMap[type];
    const newEntry = formData[type][0];

    const missingField = requiredFields.find((field)=> !newEntry?.[field]);
    console.log("missingField", missingField);
    console.log("missingField" ,typeof missingField);
    if (missingField){
        alert(`${missingField}은 필수 입력 항목입니다`);
        return;
    }
    //newEducatin의 grad_date
    if (type === 'newEducation') {
        const eduStatus = newEntry?.edu_status;
        if (eduStatus !== '재학' && !newEntry?.grad_date) {
            alert(`졸업일(grad_date)은 필수 입력 항목입니다`);
            return;
        }
    }
    //newExperience의 end_date
     if (type === 'newExperience') {
        if (!isCurrentJob && !newEntry?.end_date) {
            alert(`퇴사일(end_date)은 필수 입력 항목입니다`);
            return;
        }
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

    //언어 중복 검사.
    if (type === 'newLanguage') {
        const isAlreadyAdded = formData.languageList.some(
            (item) => item.language === newEntry.language
        );
        if (isAlreadyAdded) {
            alert(`${newEntry.language}은(는) 이미 추가된 언어입니다.`);
            return;
        }
    }//기술 중복 검사.
    if (type === 'newCertificate') {
        const isAlreadyAdded = formData.certificateList.some(
            (item) => item.certificate_name === newEntry.certificate_name
        );
        if (isAlreadyAdded) {
            alert(`${newEntry.certificate_name}은(는) 이미 추가된 언어입니다.`);
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
        //  이렇게 수정하세요 (이전 라인을 제거하고 하나만 남깁니다) ✨
//[type]: type === 'newCertificate' ? [{}] : [], // newCertificate는 빈 객체로 초기화, 나머지는 빈 배열
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
            languageList: 'language',
            certificateList: 'certificate_name',
        };
        
        console.log(type, idToRemove);

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

 
//=================외국어 능력 추가===========================================================================
const addLanguage = () => {
    if (formData.newLanguage.length>0 || formData.languageList.length + formData.newLanguage.length >= 4){
        return;
    }
    setFormData((prev)=>({
        ...prev,
        newLanguage: [{
            language : '',
            level: '',
        }],
    }));
};

 
//=================자격증 추가===========================================================================
const addCertificate = () => {
    if (formData.newCertificate.length>0 || formData.certificateList.length + formData.newCertificate.length >= 4){
        return;
    }
    setFormData((prev)=>({
        ...prev,
        newCertificate: [{
            certificate_name : '',
            certificate_no: '',
            issuing_org:'',
            acquired_date:'',
        }],
    }));
};

//=================학력 추가===========================================================================
  const addEducation = () => {
// 이미 새로운 학력 입력 중이거나, 총 학력이 4개 이상이면 추가하지 않음
    if (formData.newEducation.length > 0 || (formData.education.length + formData.newEducation.length) >= 4) {
        return;
    }
    setFormData((prev) =>({
        ...prev,
        newEducation: [{
            school_name:'',
            edu_status:'',
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

  const [isCurrentEdu, setIsCurrentEdu] = useState(false);





//=================경력 추가===========================================================================


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
            career_no: Date.now()
           }
        ]
    }));
  }

  const [isCurrentJob, setIsCurrentJob] = useState(false);

//=================스킬 추가===========================================================================
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

//============국기 emoji======================
const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '';
    // 몇 가지 예시, 실제 사용할 언어 코드에 따라 추가해야 합니다.
    const flags = {
        'ko': '🇰🇷',
        'en': '🇬🇧', // 또는 🇺🇸
        'ja': '🇯🇵',
        'zh': '🇨🇳',
        'es': '🇪🇸'
        // 필요에 따라 더 많은 언어 코드와 이모지 추가
    };
    return flags[countryCode.toLowerCase()] || '';
};
 
    return (
        <>
            <Banner pageName="이력서 작성" />
            <div className='resume_wrap'>
            <div className="resume-sideBar-content">
                <ResumeSidebar/>
            </div>
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
                        <div className='input-title'><span>제목:</span></div> {/* 제목을 div로 감싸고 */}
                        <div className='input-title-space'><input type='text' name="title" onChange={handleChange} value={formData.title}></input></div> {/* 인풋을 div로 감쌉니다 */}
                    </label>
                        <br /> {/* <br />은 이제 필요 없을 수 있습니다. 레이아웃에 따라 조절하세요. */}

                        <label>
                            <div className='input-title'><span>희망직무:</span></div>
                            <div className='input-title-space'><input type="text" name="desired_position" onChange={handleChange} value={formData.desired_position}/></div>
                        </label>
                        <br />
 {/* ------------------------------------------------------기술 섹션 --------------------------------------------------------- */}                 
                    {formData.skillList.length >= 0 ? (
                        <div className="skill-section-wrapper"> {/* 새로운 wrapper div 추가 (스타일링 용이) */}
                            <div className="summary-row">
                                {/*  접힌 상태에서 보여줄 요약 정보 */}
                                <p className="summary-text">
                                    {formData.skillList.length === 0 ? (<><strong>등록된 기술이 없습니다. </strong>&nbsp; </>):(<><strong>보유 기술:</strong>&nbsp;</>)}
                                    {formData.skillList.map((skill, index) => (
                                                    <span key={skill.skill_code || index} className="tag">
                                                        {skill.skill_code}
                                                    </span>
                                                ))}
                                </p>
                                
                                {/*  상세보기/접기 버튼 */}
                                <div className="summary-button-container">
                                <PrettyBtn
                                    type="button"
                                    size="sm"
                                    onClick={() => toggleDetails('skill')}
                                    style={{ marginLeft: '10px' , whiteSpace: 'nowrap'}}
                                    >
                                    {showSkillDetails ? '접기' : '상세보기'}
                                </PrettyBtn>
                                </div>
                            </div>

                            {/*  showSkillDetails 상태에 따라 상세 내용 조건부 렌더링 */}
                            {showSkillDetails && (
                                <div className="skill-details-section">
                                    {/* <h4>기존 기술 정보 상세</h4> */}
                                    {formData.skillList.map((skill) => (
                                        <div key={`skill-${skill.skill_code}`} className='skill-row-display'>
                                            <PrettyBtn
                                                type="button"
                                                size="sm"
                                                onClick={() => removeStagedField('skillList', skill.skill_code)}
                                                style={{ marginRight: '10px', padding: '5px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                            >
                                                <img
                                                    src="/resources/img/minus_circle.png"
                                                    alt="기술 삭제"
                                                    style={{ width: '20px', height: '20px', border: 'none', backgroundColor: 'transparent' }}
                                                />
                                            </PrettyBtn>
                                            <p><strong>분야:</strong>{skill.group_code}</p>
                                            {skill.group_code && <p><strong>기술:</strong>{skill.skill_code}</p>}
                                            {skill.skill_code && <p><strong>숙련도:</strong>{skill.exp_level}</p>}
                                        </div>
                                    ))}
                {/* -------------신규 기술 입력 버튼------------------------------------------- */}

                            {formData.newSkillList.length === 0 && formData.skillList.length < 4 && (
                                <div>
                                    <div style={{ display: 'flex',justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <PrettyBtn type="button" size="sm" onClick={addSkill} >새 기술 추가</PrettyBtn>
                                    </div>
                                </div>
                            )} 
                            {formData.newSkillList.length > 0 && (// newSkill 배열을 맵핑하여 입력 드롭다운 생성
                                <div className='skill-row-input'>
                                    <DropDown
                                        options={groupCodeList}
                                        // selected={formData.skillList}
                                        selected={formData.newSkillList[0]?.group_code || ''}
                                        placeholder="분야 선택"
                                        // onChange
                                        onSelect={(group_code)=>{
                                            console.log(group_code);
                                            setFormData((prev)=>({
                                                ...prev,
                                                newSkillList : prev.newSkillList.map((skill, index) => index === 0 ? {...skill, group_code : group_code} : skill)                                               
                                           }))
                                            handleGroupCodeChange(group_code);
                                        }
                                        }/>
                                    { formData.newSkillList[0].group_code && <DropDown
                                        options={detailCodeList}
                                        // selected={formData.skillList}
                                        selected={formData.newSkillList[0]?.skill_code || ''}
                                        placeholder="분야 선택"
                                        onSelect={(e)=>{
                                            console.log(e);
                                            setFormData((prev)=>({
                                                ...prev,
                                                newSkillList : prev.newSkillList.map((skill, index) => index === 0 ? {...skill, skill_code : e} : skill)                                               
                                           }))
                                            handleDetailCodeChange();
                                        }
                                        }/>}
                                    { formData.newSkillList[0].skill_code && <DropDown
                                        options={skillLevelList}
                                        // selected={formData.skillList}
                                        selected={formData.newSkillList[0]?.exp_level || ''}
                                        placeholder="분야 선택"
                                        onSelect={(value)=>handleDropdownChange('exp_level', value, 'newSkillList' )}/>}

                                    <PrettyBtn type="button" size="sm" onClick={() => saveFieldData('newSkillList')} style={{ marginLeft: '10px' }}>저장</PrettyBtn>
                                    <PrettyBtn type="button" size="sm" onClick={(e) => removeNewField(e, 'newSkillList')} style={{ marginLeft: '5px' }}>취소</PrettyBtn>
                                </div>
                            )}
                    {/* -------------신규 기술 입력 버튼- 끝------------------------------------------ */}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>등록된 기존 기술 정보가 없습니다</p>
                    )}
                        <br />
{/* ------------------------------------------------------외국어 섹션 --------------------------------------------------------- */}  
        {/* <label>
                <div><span>외국어 능력</span></div>
            </label> */}
            {/*  languageList에 데이터가 있을 경우에만 섹션 렌더링 */}
            {formData.languageList.length >= 0 ? (
                <div className="language-section-wrapper"> {/* skill-section-wrapper와 유사한 wrapper div */}
                    <div className="summary-row">
                        {/*  접힌 상태에서 보여줄 요약 정보 */}
                        <p className="summary-text">
                            {formData.languageList.length === 0 ? (<><strong>등록된 외국어 능력이 없습니다.</strong>&nbsp;</>):(<><strong>보유 외국어 능력:</strong>&nbsp;</>)}
                            {formData.languageList.map((lan, index) => (
                                <span key={lan.language || index} className="tag"> {/* 각 언어를 태그로 표시 */}
                                    {/* getFlagEmoji(lan.language_code) 부분 제거 */}
                                    {lan.language}
                                    {/* {lan.level && ` (${lan.level})`} 레벨도 같이 보여줄 때 */}
                                </span>
                            ))}
                        </p>
                        {/*  상세보기/접기 버튼 */}
                        <div className="summary-button-container">
                        <PrettyBtn
                            type="button"
                            size="sm"
                            onClick={() => toggleDetails('language')} // 'language' 섹션 토글
                            style={{ marginLeft: '10px' }}
                            >
                            {showLanguageDetails ? '접기' : '상세보기'}
                        </PrettyBtn>
                    </div>
                    </div>

                    {/*  showLanguageDetails 상태에 따라 상세 내용 조건부 렌더링 */}
                    {showLanguageDetails && (
                        <div className="language-details-section">
                            {/* <h4>기존 외국어 능력 상세</h4> */}
                            {formData.languageList.map((lan) => (
                                <div key={`language-${lan.language}`} className='language-row-display'>
                                    <PrettyBtn
                                        type='button'
                                        size='sm'
                                        onClick={() => removeStagedField('languageList', lan.language)}
                                        style={{ marginRight: '10px', padding: '5px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <img
                                            src="/resources/img/minus_circle.png"
                                            alt="언어 삭제"
                                            style={{ width: '20px', height: '20px', border: 'none', backgroundColor: 'transparent' }}
                                        />
                                    </PrettyBtn>
                                    <p><strong>외국어:</strong>{lan.language}</p> {/* getFlagEmoji(lan.language_code) 부분 제거 */}
                                    {lan.language && <p><strong>레벨:</strong>{lan.level}</p>}
                                </div>
                                
                            ))}
                    {/*----- 외국어 입력 추가 버튼 시작----- */}
                        {(formData.languageList.length + formData.newLanguage.length) < 4 && formData.newLanguage.length === 0 && (
                        <div>
                            <div style={{ display:'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                <PrettyBtn type='button' size='sm' onClick={addLanguage}>외국어 능력 추가</PrettyBtn>
                            </div>
                        </div>
                        )}
                        {formData.newLanguage.length > 0 && (// newSkill 배열을 맵핑하여 입력 드롭다운 생성
                                <div className='language-row-input'>
                                    <input type = 'text' name='language' placeholder='외국어 능력' onChange={(e) => handleFieldChange(e, 'newLanguage')} value={formData.newLanguage[0]?.language||''}/>
                                    <DropDown
                                        options={['상','중','하']}
                                        selected={formData.newLanguage[0]?.level || ''}
                                        placeholder="level 선택"
                                        onSelect={(value)=>handleDropdownChange('level', value, 'newLanguage' )}/>
                                    <PrettyBtn type="button" size="sm" onClick={() => saveFieldData('newLanguage')} style={{ marginLeft: '10px' }}>저장</PrettyBtn>
                                    <PrettyBtn type="button" size="sm" onClick={(e) => removeNewField(e, 'newLanguage')} style={{ marginLeft: '5px' }}>취소</PrettyBtn>
                                </div>
                            )}
                             {/*----- 외국어 입력 추가 버튼 끝----- */}
                        </div>
                    )}
                </div>
            ) : (
                <p>등록된 기존 외국어 정보가 없습니다.</p>
            )}
                        <br />
{/* ------------------------------------------------------자격증 섹션 --------------------------------------------------------- */}                        
                        {/* 기존 자격증 버튼 */}
                    {/*  certificateList에 데이터가 있을 경우에만 섹션 렌더링 */}
                    {formData.certificateList.length >= 0 ? (
                        <div className='certificate-section-wrapper'> {/* 새로운 wrapper div 추가 */}
                            <div className="summary-row">
                                {/* 🚩 접힌 상태에서 보여줄 요약 정보 */}
                                <p className="summary-text">
                                     {formData.certificateList.length === 0 ? (<><strong>등록된 자격증이 없습니다.</strong>&nbsp;</>):(<><strong>보유 자격증:</strong>&nbsp;</>)}
                                    {formData.certificateList.map((cert, index) => (
                                        <span key={cert.certificate_name || index} className="tag"> {/* 각 자격증을 태그로 표시 */}
                                            {cert.certificate_name}
                                            {cert.issuing_org && ` (${cert.issuing_org})`} {/* 발행기관도 같이 보여줄 때 */}
                                        </span>
                                    ))}
                                </p>
                                {/* 상세보기/접기 버튼 */}
                                <div className="summary-button-container">
                                <PrettyBtn
                                    type="button"
                                    size="sm"
                                    onClick={() => toggleDetails('certificate')} // 'certificate' 섹션 토글
                                    style={{ marginLeft: '10px' }}
                                    >
                                    {showCertificateDetails ? '접기' : '상세보기'}
                                </PrettyBtn>
                                </div>
                            </div>
                            {/* showCertificateDetails 상태에 따라 상세 내용 조건부 렌더링 */}
                            {showCertificateDetails && (
                                <div className="certificate-details-section">
                            {/* <h4>기존 자격증 정보 상세</h4> */}
                            {formData.certificateList.map((cert) => (
                                <div key={`certificate-${cert.certificate_name}`} className='certificate-row-display'>
                                    <PrettyBtn
                                        type='button'
                                        size='sm'
                                        onClick={() => removeStagedField('certificateList', cert.certificate_name)} // 'certificateList'로 수정
                                        style={{ marginRight: '10px', padding: '5px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent'}}
                                    >
                                        <img
                                            src="/resources/img/minus_circle.png"
                                            alt="자격증 삭제"
                                            style={{width: '20px', height: '20px', border: 'none', backgroundColor: 'transparent'}}
                                        />
                                    </PrettyBtn>
                                    <p><strong>자격증명:</strong>{cert.certificate_name}</p>
                                    <p><strong>발행기관:</strong>{cert.issuing_org}</p>
                                    <p><strong>취득일:</strong>{new Date(cert.acquired_date).toLocaleDateString()}</p>
                                    {/* `certificate_no`는 필수가 아니라면 조건부 렌더링 가능 */}
                                    {cert.certificate_no && <p><strong>일련번호:</strong>{cert.certificate_no}</p>}
                                </div>
                            ))}
                                        {/* 자격증 추가 버튼 */}
                                    {(formData.certificateList.length + formData.newCertificate.length) < 4 && formData.newCertificate.length === 0 && (
                                    <div>
                                        <div style={{ display:'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                                            
                                            <PrettyBtn type='button' size='sm' onClick={addCertificate}>새 자격증 추가</PrettyBtn>
                                        </div>
                                    </div>
                                    )}
                                    {formData.newCertificate.length > 0 && (// newEducation 배열을 맵핑하여 입력 필드 생성
                                        <div className='certificate-row-input'>
                                            <input type='text' name='certificate_name' placeholder='자격증명 입력' onChange={(e)=>handleFieldChange(e, 'newCertificate')} value={formData.newCertificate[0]?.certificate_name || ''}/>
                                            <Calendar
                                                selectedStartDate={formData.newCertificate[0]?.acquired_date}
                                                startplaceholder="취득일"
                                                onChangeStartDate={(date)=>handleFieldDateChange('newCertificate', 'acquired_date', date)}
                                            />
                                            <input type = 'text' name='certificate_no' placeholder='자격증 일련번호' onChange={(e) => handleFieldChange(e, 'newCertificate')} value={formData.newCertificate[0]?.certificate_no||''}/>
                                            <input type='text' name='issuing_org' placeholder='발행기관' onChange={(e)=>handleFieldChange(e, 'newCertificate')} value={formData.newCertificate[0]?.issuing_org || ''}/>
                                        {/* <PrettyBtn type="button" size="sm" onClick={() => removeExperience(index)} disabled={formData.newCertificate.length <= 0}>삭제</PrettyBtn> */}
                                        <PrettyBtn type="button" size="sm" onClick={()=>saveFieldData('newCertificate')}>저장</PrettyBtn>
                                        <PrettyBtn type="button" size="sm" onClick={(e)=>removeNewField(e, 'newCertificate')}>취소</PrettyBtn>
                                    </div>
                                    )}
                        </div>
                    )}
                </div>
            ) : (
                <p>등록된 기존 자격증 정보가 없습니다.</p>
            )}
            <br />            
{/* ------------------------------------------------------학력 섹션 --------------------------------------------------------- */}              
            {/* ---기존 학력 섹션 --- */}
            {/* <label>
                <div><span>학력</span></div>
            </label> */}
                        {/* 🚩 education에 데이터가 있을 경우에만 섹션 렌더링 */}
                        {formData.education.length >= 0 ? (
                            <div className="education-section-wrapper"> {/* 새로운 wrapper div 추가 */}
                                <div className="summary-row">
                                    {/* 🚩 접힌 상태에서 보여줄 요약 정보 */}
                                    <p className="summary-text">
                                        {formData.education.length === 0 ? (<><strong>등록된 학력 정보가 없습니다.</strong>&nbsp;</>):(<><strong>학력 정보:</strong>&nbsp;</>)}
                                        {formData.education.map((edu, index) => (
                                            <span key={edu.edu_no || index} className="tag"> {/* 각 학력 항목을 태그로 표시 */}
                                                {edu.school_name}
                                                {edu.major && ` (${edu.major})`} {/* 전공도 같이 보여줄 때 */}
                                            </span>
                                        ))}
                                    </p>
                                    {/* 🚩 상세보기/접기 버튼 */}
                                <div className="summary-button-container">
                                    <PrettyBtn
                                        type="button"
                                        size="sm"
                                        onClick={() => toggleDetails('education')} // 'education' 섹션 토글
                                        style={{ marginLeft: '10px' }}
                                        >
                                        {showEducationDetails ? '접기' : '상세보기'}
                                    </PrettyBtn>
                                    </div>
                                </div>

                                {/* 🚩 showEducationDetails 상태에 따라 상세 내용 조건부 렌더링 */}
                                {showEducationDetails && (
                                    <div className="education-details-section">
                                        {/* <h4>기존 학력 정보 상세</h4> */}
                                        {formData.education.map((edu) => (
                                            <div key={`edu-${edu.edu_no}`} className="education-row-display">
                                                <PrettyBtn
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => removeStagedField('education', edu.edu_no)}
                                                    style={{ marginRight: '10px', padding: '5px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                >
                                                    <img
                                                        src="/resources/img/minus_circle.png"
                                                        alt="학력 삭제" // alt 텍스트를 "학력 삭제"로 변경
                                                        style={{ width: '20px', height: '20px', border: 'none', backgroundColor: 'transparent' }}
                                                    />
                                                </PrettyBtn>
                                                <p><strong>학교명:</strong> {edu.school_name}</p>
                                                <p><strong>학력 상태:</strong> {edu.edu_status}</p>
                                                <p>
                                                    <strong>입학일:</strong> {edu.enroll_date ? new Date(edu.enroll_date).toLocaleDateString() : ''}
                                                    {" "}
                                                    <strong>졸업일:</strong> {edu.grad_date ? new Date(edu.grad_date).toLocaleDateString() : ''}
                                                </p>
                                                <p><strong>전공:</strong> {edu.major}</p>
                                                {edu.sub_major && <p><strong>복수전공:</strong> {edu.sub_major}</p>}
                                                {edu.gpa && <p><strong>학점:</strong> {edu.gpa}</p>}
                                            </div>
                                        ))}
                {/* 신규 학력 입력 버튼 */}
                    {(formData.education.length + formData.newEducation.length) < 4 && formData.newEducation.length === 0 && (
                        <div>
                            <div style={{ display:'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <PrettyBtn type="button" size="sm" onClick={addEducation} >새 학력 추가</PrettyBtn>
                            </div>
                        </div>
                    )}
                         {formData.newEducation.length > 0 && (// newEducation 배열을 맵핑하여 입력 필드 생성
                            <div className="education-row-input">
                                <input type="text" name="school_name" placeholder="학교명" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.school_name || ''}/>
                                <DropDown
                                        options={["졸업", "재학", "수료", "휴학", "자퇴"]}
                                        selected={formData.newEducation[0]?.edu_status || ''}
                                        placeholder="학력 상태"
                                          onSelect={(value)=>{
                                            if(value === "재학" ){
                                                setIsCurrentEdu(true);
                                                
                                                    console.log("실행");
                                                        setFormData((prev) =>({
                                                        ...prev,
                                                        newEducation : prev.newEducation.map((edu, index) => index === 0 ? {...edu, grad_date : ""} : edu)    
                                                        }))
                                                 
                                            } else {
                                                setIsCurrentEdu(false);
                                            }
                                            handleDropdownChange('edu_status', value, 'newEducation' )}}
                                        />
                                <Calendar
                                    isCurrentEdu={isCurrentEdu}
                                    selectedStartDate={ formData.newEducation[0].enroll_date ? new Date(formData.newEducation[0].enroll_date) : null}
                                    startplaceholder="입학일"
                                    onChangeStartDate={(date) => handleFieldDateChange('newEducation','enroll_date', date)}
                                    selectedEndDate={isCurrentEdu ? "" :formData.newEducation[0].grad_date ? new Date(formData.newEducation[0].grad_date) : null}
                                    endplaceholder="졸업일"
                                    onChangeEndDate={(date) => handleFieldDateChange('newEducation','grad_date', date)}
                                    popperPlacement="top-end"
                                />
                                        <input type="text" name="major" placeholder="전공" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.major || ''} />
                                <input type="text" name="sub_major" placeholder="복수전공" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.sub_major || ''}/>
                                <input type="text" name="gpa" placeholder="학점" onChange={(e)=>handleFieldChange(e, 'newEducation')} value={formData.newEducation[0]?.gpa || ''}/>
                                <PrettyBtn type="button" size="sm" onClick={()=>{setIsCurrentEdu(false);saveFieldData('newEducation')}}>저장</PrettyBtn>
                                <PrettyBtn type="button" size="sm" onClick={(e)=>{setIsCurrentEdu(false); removeNewField(e, 'newEducation')}}>취소</PrettyBtn>
                            </div>
                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>등록된 기존 학력 정보가 없습니다.</p>
                        )}

                        <br />


{/* ------------------------------------------------------경력 섹션 --------------------------------------------------------- */}
                    {/* exp.career_no를 key로 사용하도록 코드를 업데이트. 만약 career_no가 null 또는 undefined일 경우를 대비하여 index를 **비상용(fallback)**으로 남겨둠 */}
            {formData.experience.length >= 0 ? (
                <div className="experience-section-wrapper"> {/* 새로운 wrapper div 추가 */}
                    <div className="summary-row">
                        {/* 🚩 접힌 상태에서 보여줄 요약 정보 */}
                        <p className="summary-text">
                            {formData.experience.length === 0 ? (<><strong>등록된 경력 정보가 없습니다.</strong>&nbsp;</>):(<><strong>경력 정보:</strong>&nbsp;</>)}
                            {formData.experience.map((exp, index) => (
                                <span key={exp.career_no || index} className="tag"> {/* 각 경력 항목을 태그로 표시 */}
                                    {exp.company_name}
                                    {exp.position && ` (${exp.position})`} {/* 직무도 같이 보여줄 때 */}
                                </span>
                            ))}
                        </p>
                        {/* 상세보기/접기 버튼 */}
                    <div className="summary-button-container">
                        <PrettyBtn
                            type="button"
                            size="sm"
                            onClick={() => toggleDetails('experience')} // 'experience' 섹션 토글
                            style={{ marginLeft: '10px' }}
                            >
                            {showExperienceDetails ? '접기' : '상세보기'}
                        </PrettyBtn>
                    </div>
                </div>

                    {/* showExperienceDetails 상태에 따라 상세 내용 조건부 렌더링 */}
                    {showExperienceDetails && (
                        <div className="experience-details-section">
                            {/* <h4>기존 경력 정보 상세</h4> */}
                            {formData.experience.map((exp, index) => (
                                <div key={exp.career_no || index} className="experience-row-display">
                                    <PrettyBtn
                                        type="button"
                                        size="sm"
                                        onClick={() => removeStagedField('experience', exp.career_no || index)}
                                        style={{ marginRight: '10px', padding: '5px 8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                    >
                                        <img
                                            src="/resources/img/minus_circle.png"
                                            alt="경력 삭제"
                                            style={{ width: '20px', height: '20px', border: 'none', backgroundColor: 'transparent' }}
                                        />
                                    </PrettyBtn>
                                    <p><strong>회사명:</strong> {exp.company_name}</p>
                                    {exp.position && <p><strong>직무:</strong> {exp.position}</p>} {/* 직무가 있을 때만 렌더링 */}
                                    <p>
                                        <strong>기간:</strong> {exp.start_date ? new Date(exp.start_date).toLocaleDateString() : ''}
                                        {' '}~{' '}
                                        {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : ''}
                                    </p>
                                    {exp.notes && <p><strong>상세내용:</strong> {exp.notes}</p>} {/* 상세내용이 있을 때만 렌더링 */}
                                </div>
                            ))}
                            {/* --- 새 경력 추가 버튼 위치 (여기!) --- */}
                {/* 4개 미만이고, 현재 새 경력 입력 중이 아닐 때만 버튼 표시 */}
                {(formData.experience.length + formData.newExperience.length) < 4 && formData.newExperience.length === 0 && (
                    <div style={{ display:'flex', justifyContent: 'flex-end', marginTop: '20px' }}> {/* 오른쪽에 정렬 */}
                        <PrettyBtn type='button' size='sm' onClick={addExperience}>새 경력 추가</PrettyBtn>
                    </div>
                )}
                
                {/* 새 경력 입력 필드 */}
                        {formData.newExperience.length > 0 && (
                            <div className='experience-row-input'>
                                {/* 경력 추가 버튼*/}
                                {(formData.experience.length + formData.newExperience.length) < 4 && formData.newExperience.length === 0 && (
                                <div>
                                    <div style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <PrettyBtn 
                                        type='button' size='sm' onClick={addExperience}>새 경력 추가</PrettyBtn>
                                    </div>
                                </div>
                                )}
                                <input type='text' name='company_name' placeholder='회사명' onChange={(e)=>handleFieldChange(e, 'newExperience')} value={formData.newExperience[0]?.company_name || ''}/>
                                <Calendar
                                    isCurrentJob={isCurrentJob}
                                    selectedStartDate={ formData.newExperience[0].start_date ? new Date(formData.newExperience[0].start_date) : null}
                                    startplaceholder="입사일"
                                    onChangeStartDate={(date)=>handleFieldDateChange('newExperience', 'start_date', date)}
                                    selectedEndDate={isCurrentJob ? "" : formData.newExperience[0].end_date ? new Date(formData.newExperience[0].end_date) : null}
                                    endplaceholder="퇴사일"
                                    onChangeEndDate={(date) => handleFieldDateChange('newExperience', 'end_date', date)}
                                />
                                <input type='checkbox' name='' onChange={(e) => {
                                    const checked = e.target.checked;

                                    setIsCurrentJob(checked);

                                    // 체크된 상태면 → end_date 제거
                                    if (checked) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        newExperience: prev.newExperience.map((exp, index) =>
                                        index === 0 ? { ...exp, end_date: "" } : exp
                                        )
                                    }));
                                    }
                                }}
                                /><p>재직중:</p>
                                    
                                <input type = 'text' name='position' placeholder='직무' onChange={(e) => handleFieldChange(e, 'newExperience')} value={formData.newExperience[0]?.position||''}/>
                             <textarea  name='notes' placeholder='상세내용 (주요 업무 및 성과를 구체적으로 기재)'
                                onChange={(e) => handleFieldChange(e, 'newExperience')} value={formData.newExperience[0]?.notes || ''}
                                rows="3"/>
                            {/* <PrettyBtn type="button" size="sm" onClick={() => removeExperience(index)} disabled={formData.newExperience.length <= 0}>삭제</PrettyBtn> */}
                            <PrettyBtn type="button" size="sm" onClick={()=>{setIsCurrentJob(false);saveFieldData('newExperience')}}>저장</PrettyBtn>
                            <PrettyBtn type="button" size="sm" onClick={(e)=>{setIsCurrentJob(false); removeNewField(e, 'newExperience')}}>취소</PrettyBtn>
                        </div>
                    )}
                    </div>
                    )}
                        </div>

                ) : (
                    <p>등록된 기존 경력 정보가 없습니다.</p>
                )}
                    <br />
                    <br />
{/* ------------------------------------------------------링크 섹션 --------------------------------------------------------- */}
                    <label>
                        <div className='input-title'><span>링크</span></div>
                        <div className='input-title-space'><input type="text" name="link_url" onChange={handleChange} value={formData.link_url}/></div>
                    </label>
                        <br />
{/* ------------------------------------------------------자기소개서 섹션 --------------------------------------------------------- */}
                        <label>
                            {/*내가 작성한 자소서는 DB에 저장할것인지???*/}
                            <div className='input-title'><span>자기소개서</span></div>
                            <div className='input-cover-space'>
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
                        userName={user.userName}
                        />
                        <br/>
                            <br/>
                            <div className='templete-test'>
                                <TemplateSelection formData={formData} editType={"I"} setFormData={setFormData}>템플렛선택</TemplateSelection>
                            </div>
                        <br/>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            {download ? (
                                <PrettyBtn onClick={pdfDownload}>PDF 다운로드</PrettyBtn>
                            ) : (
                                <>
                                    <PrettyBtn onClick={handleSubmit}>이력서 저장</PrettyBtn>
                                    <PrettyBtn onClick={pdfDownload}>이력서 저장 및 PDF 다운로드</PrettyBtn>
                                </>
                            )}
                            
                        </div>
                    </form>
                </div>
                </div>
                <Loading loading={loading}></Loading>
        </div>
    </>
    );
};
export default Resume;