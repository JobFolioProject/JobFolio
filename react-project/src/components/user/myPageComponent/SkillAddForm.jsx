import React, { useState, useEffect, useRef, useCallback, use, forwardRef } from 'react';
import axios from '../../../utils/axiosConfig';
import '../../../css/user/myPageComponent/SkillAddForm.css'; // SkillAddForm 전용 CSS
import ValidationMessage from './ValidationMessage';
import WarningIcon from '@mui/icons-material/Warning';
const DEFAULT_NEW_SKILL_DETAILS = {
    exp_level: '',
    skill_tool: '', // skill_tool이 사용 툴 + 특이사항 역할을 겸함
};

// React.memo로 불필요한 리렌더링 방지 (props가 변경되지 않으면 리렌더링 안 함)
const SkillAddForm = React.memo(
    ({
        userNo,
        onSave,
        onCancel,
        existingSkillList,
        isEditMode,
        onTagClick,
        maxSkillCount,
        updateSkillDetailInForm,
        deleteSkillInForm,
    }) => {
        const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드
        const [allAvailableSkills, setAllAvailableSkills] = useState([]); // 백에서 불러온 모든 데이터 (CommSkillDto 리스트)
        const [filterSkills, setFilterSkills] = useState([]); // 검색에 따라 필터된 스킬 목록들 (CommSkillDto 리스트)
        const searchInputRef = useRef(''); // 검색창 input에 대한 ref (포커스용)

        // 현재 폼에서 선택되거나 최종 저장 될 스킬 목록 (SkillVO 형태, UI 표시용 임시 필드 포함)
        const [currentFormSkills, setCurrentFormSkills] = useState([]);

        const [loading, setLoading] = useState(true); // 스킬 목록 로딩 상태
        const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지

        // 미입력 상세 정보 스킬 존재 여부 (유효성 검사 및 UI 유도용)
        const [incompleteSkillsExist, setIncompleteSkillsExist] = useState(false);

        // 미입력 메세지 재호출을 위한 ref
        const validationMessageRef = useRef(null);

        // 스킬목록 불러오기, 마운트시 1회
        useEffect(() => {
            const fetchAllSkills = async () => {
                try {
                    setLoading(true); // 로딩
                    setErrorMessage(''); // 에러 메세지

                    // 백엔드 API 호출: 모든 공통 스킬 목록 조회 (CommSkillDto 반환)
                    const response = await axios.get('/api/myPage/skills/all');
                    const searchAllSkills = response;
                    console.log('무슨데이터?: ', response);
                    setAllAvailableSkills(searchAllSkills);
                    setFilterSkills(searchAllSkills); // 처음은 전체 목록
                } catch (error) {
                    // 에러 시 초기화
                    setErrorMessage('스킬 목록을 불러오는 데 실패했습니다.');
                    setAllAvailableSkills([]);
                    setFilterSkills([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchAllSkills(); // 모든 공통 스킬 로딩..
        }, []);

        // 폼 초기화 로직: 편집 모드이거나 새 스킬 추가 모드일 때
        useEffect(() => {
            if (existingSkillList && allAvailableSkills.length > 0) {
                setCurrentFormSkills(
                    existingSkillList.map((skill) => {
                        // CommSkillDto에서 skill_name, group_name을 찾아서 매핑
                        const foundSkill = allAvailableSkills.find(
                            (s) => s.detail_code === skill.skill_code && s.group_code === skill.group_code
                        );
                        return {
                            ...skill,
                            // 백엔드에서 받은 스킬 객체에 이름이 없을 경우, allAvailableSkills에서 찾아 매핑
                            skill_name: foundSkill?.detail_name || skill.skill_code,
                            group_name: foundSkill?.group_name || skill.group_code,
                        };
                    })
                );
            } else {
                // existingSkillList가 없거나 allAvailableSkills가 로드되지 않은 경우
                setCurrentFormSkills([]);
            }
            // 폼 열릴 때 검색창 초기화 및 포커스
            setSearchKeyword('');
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
            // 폼이 열릴 때 errorMessage를 초기화
            setErrorMessage('');
        }, [existingSkillList, allAvailableSkills]);

        // currentFormSkills 변경 시마다 미입력 스킬 존재 여부 업데이트
        useEffect(() => {
            const hasIncomplete = currentFormSkills.some(
                (s) => !s.exp_level || s.exp_level.trim() === '' || !s.skill_tool || s.skill_tool.trim() === ''
            );
            setIncompleteSkillsExist(hasIncomplete);
        }, [currentFormSkills]);

        // 검색어가 변경될 때마다 스킬 필터링
        useEffect(() => {
            if (searchKeyword.trim() === '') {
                // 키워드가 공백일때. 모든 데이터들을 필터에 넣음.
                setFilterSkills(allAvailableSkills);
            } else {
                // 그게 아니라면 소문자로 변경.
                const lowercasedKeyword = searchKeyword.toLowerCase();
                // 새로운 필터에 모든 데이터들을 바꾸고 조건별로 찾음.? CommSkillDto의 detail_name과 group_name을 기준으로 필터링
                const newFilterd = allAvailableSkills.filter(
                    (skill) =>
                        skill.detail_name.toLowerCase().includes(lowercasedKeyword) ||
                        (skill.group_code && skill.group_name.toLowerCase().includes(lowercasedKeyword))
                );
                setFilterSkills(newFilterd); // 필터된 애들을 새로 정의
            }
        }, [searchKeyword, allAvailableSkills]);

        // 폼 열릴 때 검색창에 자동 포커스
        useEffect(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, []); // 폼 열릴 때 마다 한번

        // 스킬 검색 결과 항목 클릭 (체크박스 토글) 핸들러
        const skillSelection = useCallback(
            (selectedSkill) => {
                setErrorMessage('');
                // selectedSkill은 CommSkillDto 형태
                const skillUniqueId = `${selectedSkill.detail_code}-${selectedSkill.group_code}`;

                // currentFormSkills(SkillVO 리스트)에 이미 있는지 확인 (선택/해제 로직용)
                const isAlreadySelectedInForm = currentFormSkills.some(
                    (s) => `${s.skill_code}-${s.group_code}` === skillUniqueId // currentFormSkills는 SkillVO 형태
                );
                // 최대 스킬 개수 검사
                if (!isAlreadySelectedInForm && currentFormSkills.length >= maxSkillCount) {
                    setErrorMessage(`스킬은 최대 ${maxSkillCount}개까지만 등록할 수 있습니다.`);
                    return;
                }

                if (isAlreadySelectedInForm) {
                    // 이미 선택된 경우 -> 제거
                    setCurrentFormSkills((prev) =>
                        prev.filter((s) => `${s.skill_code}-${s.group_code}` !== skillUniqueId)
                    );
                } else {
                    // 새로 선택된 경우 -> 추가
                    // newSkillData는 SkillVO 형태의 객체로 currentFormSkills에 추가됩니다.
                    // UI 표시를 위한 임시 필드
                    const newSkillData = {
                        user_no: userNo, // 사용자 번호 설정
                        skill_code: selectedSkill.detail_code, // CommSkillDto의 detail_code -> SkillVO의 skill_code
                        group_code: selectedSkill.group_code, // CommSkillDto의 group_code -> SkillVO의 group_code

                        skill_name: selectedSkill.detail_name, // CommSkillDto의 detail_name -> SkillVO의 skill_name
                        group_name: selectedSkill.group_name, // CommSkillDto의 group_name -> SkillVO의 group_name
                        ...DEFAULT_NEW_SKILL_DETAILS, // exp_level, skill_tool 초기값
                    };
                    setCurrentFormSkills((prev) => [...prev, newSkillData]);
                }
            },
            [userNo, currentFormSkills, maxSkillCount]
        );
        // 폼 내부의 '선택된/편집된 스킬' 태그에서 삭제 버튼 클릭 시 (currentFormSkills에서 제거)
        const removeSkillItem = useCallback((skillToRemove) => {
            setErrorMessage('');
            setCurrentFormSkills((prev) =>
                prev.filter(
                    (s) => !(s.skill_code === skillToRemove.skill_code && s.group_code === skillToRemove.group_code)
                )
            );
        }, []);

        // SkillDetailModal에서 저장 시 호출될 콜백 (currentFormSkills 내의 스킬 상세 정보 업데이트)
        // updatedSkillData는 SkillVO 형태
        const handleUpdateDetailFromModal = useCallback((updatedSkillData) => {
            setCurrentFormSkills((prevSkills) =>
                prevSkills.map((skill) => {
                    if (
                        skill.skill_code === updatedSkillData.skill_code &&
                        skill.group_code === updatedSkillData.group_code
                    ) {
                        return {
                            ...skill, // 기존 스킬 데이터 유지
                            exp_level: updatedSkillData.exp_level,
                            skill_tool: updatedSkillData.skill_tool,
                            // skill_name, group_name이 updatedSkillData에 있다면 그것을 사용, 없다면 기존 값 유지
                            skill_name: updatedSkillData.skill_name || skill.skill_name,
                            group_name: updatedSkillData.group_name || skill.group_name,
                        };
                    }
                    return skill; // 다른 스킬은 그대로 반환
                })
            );
        }, []);

        // SkillDetailModal에서 삭제 시 호출될 콜백 (currentFormSkills에서 스킬 제거)
        const handleDeleteDetailFromModal = useCallback((skillToDeleteCode, skillToDeleteGroupCode) => {
            // useCallback 추가
            setCurrentFormSkills((prevSkills) =>
                prevSkills.filter(
                    (skill) => !(skill.skill_code === skillToDeleteCode && skill.group_code === skillToDeleteGroupCode)
                )
            );
        }, []);

        // 폼의 저장 버튼 클릭 핸들러 (부모 SkillSection으로 currentFormSkills 전달)
        const saveForm = useCallback(() => {
            // useCallback 추가
            setErrorMessage('');
            // 저장할 스킬이 없는 경우 (추가 모드에서)
            if (currentFormSkills.length === 0) {
                setErrorMessage('최소 한 개 이상의 스킬을 선택하거나 추가해야 합니다.');
                setTimeout(() => {
                    if (validationMessageRef.current) {
                        validationMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 10);
                return;
            }

            // 모든 스킬 상세정보가 입력됬는지 확인
            const incompleteSkills = currentFormSkills.filter(
                (s) => !s.exp_level || s.exp_level.trim() === '' || !s.skill_tool || s.skill_tool.trim() === ''
            );

            if (incompleteSkills.length > 0) {
                setErrorMessage('각 스킬 태그를 클릭하여 상세 정보를 입력해주세요.'); // ValidationMessage가 알아서 사라지도록
                setTimeout(() => {
                    if (validationMessageRef.current) {
                        validationMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 10);
                return;
            }

            // SkillSection의 onSave 콜백 호출 (currentFormSkills 전체를 전달)
            // 이 currentFormSkills에는 skill_name, group_name이 임시로 포함되어 있음.
            // 하지만 SkillSection의 saveSkillFormChanges에서 백엔드 전송 시 이 필드들은 제외될 것임.
            onSave(currentFormSkills);
            setErrorMessage('');
        }, [currentFormSkills, onSave]); // useCallback 의존성 추가

        const handleCancel = useCallback(() => {
            onCancel();
            setErrorMessage(''); // 취소 시 메시지 초기화는 여기서 해도 무방합니다.
        }, [onCancel]);

        return (
            <div className="skill-add-form-container">
                <h2>보유 스킬 관리</h2>
                <div className="search-input-group">
                    <input
                        type="text"
                        placeholder="스킬명 또는 그룹명으로 검색 (예: Java, 백엔드)"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="skill-search-input"
                        ref={searchInputRef}
                    />
                    {searchKeyword && (
                        <button type="button" className="clear-search-button" onClick={() => setSearchKeyword('')}>
                            X
                        </button>
                    )}
                </div>
                {errorMessage && <ValidationMessage message={errorMessage} />}
                {loading && <p className="loading-message">스킬 목록을 불러오는 중...</p>}

                <div className="skill-results-area">
                    {filterSkills.length > 0 ? (
                        <ul className="skill-results-list">
                            {filterSkills.map((skill) => {
                                // skill은 CommSkillDto 형태
                                const skillUniqueId = `${skill.detail_code}-${skill.group_code}`;
                                // currentFormSkills(SkillVO 리스트)에 포함되어 있는지 (체크박스 표시용)
                                const isSelectedInForm = currentFormSkills.some(
                                    (s) => `${s.skill_code}-${s.group_code}` === skillUniqueId
                                );

                                return (
                                    <li
                                        key={`${skill.detail_code}-${skill.group_code}`}
                                        className={`skill-result-item ${isSelectedInForm ? 'selected' : ''}`}
                                        onClick={() => skillSelection(skill)}
                                    >
                                        <input type="checkbox" checked={isSelectedInForm} readOnly />
                                        <span className="skill-result-text">
                                            {skill.detail_name} ({skill.group_code})
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        !loading &&
                        searchKeyword.trim().length > 0 && <p className="no-results-message">검색 결과가 없습니다.</p>
                    )}
                </div>
                {currentFormSkills.length > 0 && incompleteSkillsExist && (
                    <span className="guidance-message">
                        <WarningIcon className="warning-icon" /> **저장하려면 모든 스킬의 상세 정보(숙련도, 사용
                        툴/특이사항)를 입력해야 합니다.** <br></br>각 스킬 태그를 클릭하여 입력해주세요.
                    </span>
                )}
                {currentFormSkills.length > 0 && (
                    <div className="temporary-skill-tags">
                        <h4>현재 선택/관리 중인 스킬:</h4>
                        <div className="tags-wrapper">
                            {currentFormSkills.map((skill) => {
                                const isSkillIncomplete =
                                    !skill.exp_level ||
                                    skill.exp_level.trim() === '' ||
                                    !skill.skill_tool ||
                                    skill.skill_tool.trim() === '';
                                return (
                                    <div
                                        key={`${skill.user_no}-${skill.skill_code}-${skill.group_code}`}
                                        className="temp-skill-tag"
                                        onClick={() =>
                                            onTagClick({
                                                ...skill, // SkillVO 형태의 스킬 데이터 (임시 필드 포함)
                                                // SkillDetailModal에서 사용될 콜백들 (SkillAddForm의 상태를 변경)
                                                onDetailSave: handleUpdateDetailFromModal,
                                                onDetailDelete: handleDeleteDetailFromModal,
                                            })
                                        }
                                    >
                                        <span>
                                            {skill.skill_name} ({skill.group_code})
                                            {isSkillIncomplete && <WarningIcon className="incomplete-icon" />}
                                        </span>
                                        <span
                                            className="temp-skill-tag-remove"
                                            onClick={(e) => {
                                                e.stopPropagation(); // 태그 클릭 이벤트(모달 열기) 전파 방지
                                                removeSkillItem(skill);
                                            }}
                                        >
                                            ❌
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                <div className="skillFormButtons">
                    <button type="button" onClick={handleCancel}>
                        취소
                    </button>
                    <button type="button" onClick={saveForm}>
                        저장
                    </button>
                </div>
            </div>
        );
    }
);
export default SkillAddForm;
