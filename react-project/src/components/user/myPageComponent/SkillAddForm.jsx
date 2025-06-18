import React, { useState, useEffect, useRef, useCallback, use } from 'react';
import axios from '../../../utils/axiosConfig';
import '../../../css/user/myPageComponent/SkillAddForm.css'; // SkillAddForm 전용 CSS
import ValidationMessage from './ValidationMessage';

const DEFAULT_NEW_SKILL_DETAILS = {
  exp_level: '',
  skill_tool: '', // skill_tool이 사용 툴 + 특이사항 역할을 겸함
};

// React.memo로 불필요한 리렌더링 방지 (props가 변경되지 않으면 리렌더링 안 함)
const SkillAddForm = React.memo(({ userNo, onSave, onCancel, existingSkillList, isEditMode, onTagClick }) => {
  const [searchKeyword, setSearchKeyword] = useState(''); // 검색 키워드
  const [allAvailableSkills, setAllAvailableSkills] = useState([]); // 백에서 불러온 모든 데이터 (CommSkillDto 리스트)
  const [filterSkills, setFilterSkills] = useState([]); // 검색에 따라 필터된 스킬 목록들 (CommSkillDto 리스트)
  const searchInputRef = useRef(''); // 검색창 input에 대한 ref (포커스용)

  // 현재 폼에서 선택되거나 편집 중인 스킬 목록 (SkillVO 형태, UI 표시용 임시 필드 포함)
  const [currentFormSkills, setCurrentFormSkills] = useState([]);

  const [loading, setLoading] = useState(true); // 스킬 목록 로딩 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지
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
    // SkillSection에서 넘어온 현재 사용자의 SkillVO 목록
    if (isEditMode && existingSkillList && allAvailableSkills.length > 0) {
      // 기존 DB 스킬 목록을 currentFormSkills로 복사
      // 이때, CommSkillDto에서 skill_name, group_name이 existingSkillList에 있다면 유지하기
      setCurrentFormSkills(
        existingSkillList.map((skill) => ({
          ...skill,
          skill_name:
            allAvailableSkills.find((s) => s.detail_code === skill.skill_code)?.detail_name || skill.skill_code,
          group_name: allAvailableSkills.find((s) => s.group_code === skill.group_code)?.group_name || skill.group_code,
        }))
      );
    } else if (!isEditMode) {
      setCurrentFormSkills([]);
    }
  }, [isEditMode, existingSkillList, allAvailableSkills]);

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
      // existingSkillList (DB에 원래 있던 스킬)에 포함되어 있는지 (disabled 처리용)
      const isAlreadySavedInDB = existingSkillList.some(
        (s) => `${s.skill_code}-${s.group_code}` === skillUniqueId // existingSkillList는 SkillVO 형태
      );
      // 추가모드이고 && 이미 DB에 저장된 스킬이라면 클릭을 막고 alert 메시지 표시
      if (!isEditMode && isAlreadySavedInDB) {
        alert(`'${selectedSkill.detail_name} (${selectedSkill.group_name})'은 이미 등록된 스킬입니다.`);
        return;
      }
      if (isAlreadySelectedInForm) {
        // 이미 선택된 경우 -> 제거
        setCurrentFormSkills((prev) => prev.filter((s) => `${s.skill_code}-${s.group_code}` !== skillUniqueId));
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
    [userNo, isEditMode, currentFormSkills, existingSkillList]
  );
  // 폼 내부의 '선택된/편집된 스킬' 태그에서 삭제 버튼 클릭 시 (currentFormSkills에서 제거)
  const removeSkillItem = useCallback((skillToRemove) => {
    setErrorMessage('');
    setCurrentFormSkills((prev) =>
      prev.filter((s) => !(s.skill_code === skillToRemove.skill_code && s.group_code === skillToRemove.group_code))
    );
  }, []);

  // SkillDetailModal에서 저장 시 호출될 콜백 (currentFormSkills 내의 스킬 상세 정보 업데이트)
  // updatedSkillData는 SkillVO 형태
  const updateSkillDetailInForm = useCallback((updatedSkillData) => {
    setCurrentFormSkills((prevSkills) =>
      prevSkills.map((skill) => {
        if (skill.skill_code === updatedSkillData.skill_code && skill.group_code === updatedSkillData.group_code) {
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

  // SkillDetailModal에서 '삭제' 시 호출될 콜백 (currentFormSkills에서 스킬 제거)
  const deleteSkillInForm = useCallback((skillToDeleteCode, skillToDeleteGroupCode) => {
    // useCallback 추가
    setCurrentFormSkills((prevSkills) =>
      prevSkills.filter(
        (skill) => !(skill.skill_code === skillToDeleteCode && skill.group_code === skillToDeleteGroupCode)
      )
    );
  }, []); // 의존성 없음

  // 폼의 "저장" 버튼 클릭 핸들러 (부모 SkillSection으로 currentFormSkills 전달)
  const saveForm = useCallback(() => {
    // useCallback 추가
    setErrorMessage('');
    // 저장할 스킬이 없는 경우 (추가 모드에서)
    if (!isEditMode && currentFormSkills.length === 0) {
      setErrorMessage('선택된 스킬이 없습니다. 스킬을 선택해주세요.');
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 10);
      return;
    }

    // SkillSection의 onSave 콜백 호출 (currentFormSkills 전체를 전달)
    // 이 currentFormSkills에는 skill_name, group_name이 임시로 포함되어 있음.
    // 하지만 SkillSection의 saveSkillFormChanges에서 백엔드 전송 시 이 필드들은 제외될 것임.
    onSave(currentFormSkills);
  }, [isEditMode, currentFormSkills, onSave]); // useCallback 의존성 추가

  return (
    <div className="skill-add-form-container">
      <h3>{isEditMode ? '스킬 편집' : '새 스킬 추가'}</h3>
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
              // skill은 CommSkillDto 형태입니다.
              const skillUniqueId = `${skill.detail_code}-${skill.group_code}`;
              // currentFormSkills(SkillVO 리스트)에 포함되어 있는지 (체크박스 표시용)
              const isSelectedInForm = currentFormSkills.some(
                (s) => `${s.skill_code}-${s.group_code}` === skillUniqueId
              );
              // existingSkillList (DB에 원래 있던 스킬)에 포함되어 있는지 (disabled 처리용)
              const isAlreadySavedInDB = existingSkillList.some(
                (s) => `${s.skill_code}-${s.group_code}` === skillUniqueId
              );

              return (
                <li
                  key={`${skill.detail_code}-${skill.group_code}`} // CommSkillDto의 detail_code 사용
                  // '추가' 모드이고 && DB에 이미 저장된 항목은 disabled 처리
                  className={`skill-result-item ${isSelectedInForm ? 'selected' : ''} ${
                    isAlreadySavedInDB && !isEditMode ? 'disabled-item' : ''
                  }`}
                  onClick={() => !(!isEditMode && isAlreadySavedInDB) && skillSelection(skill)}
                >
                  <input
                    type="checkbox"
                    checked={isSelectedInForm}
                    readOnly
                    disabled={isAlreadySavedInDB && !isEditMode}
                  />
                  <span className="skill-result-text">
                    {skill.detail_name} ({skill.group_name}) {/* CommSkillDto의 detail_name과 group_name 표시 */}
                  </span>
                  {/* 이미 DB에 저장되어 있는데, 현재 폼에서 선택되지 않은 경우에만 '등록됨' 라벨 표시 */}
                  {isAlreadySavedInDB && !isSelectedInForm && <span className="already-saved-label"> (등록됨)</span>}
                </li>
              );
            })}
          </ul>
        ) : (
          !loading && searchKeyword.trim().length > 0 && <p className="no-results-message">검색 결과가 없습니다.</p>
        )}
      </div>
      {currentFormSkills.length > 0 && (
        <div className="temporary-skill-tags">
          <h4>{isEditMode ? '현재 편집 중인 스킬:' : '선택된 스킬:'}</h4>
          <div className="tags-wrapper">
            {currentFormSkills.map(
              (
                skill // skill은 SkillVO 형태 (임시 skill_name, group_name 포함)
              ) => (
                <div
                  key={`${skill.user_no}-${skill.skill_code}-${skill.group_code}`}
                  className="temp-skill-tag"
                  onClick={() =>
                    onTagClick({
                      ...skill, // SkillVO 형태의 스킬 데이터 (임시 필드 포함)
                      // SkillDetailModal에서 사용될 콜백들 (SkillAddForm의 상태를 변경)
                      onDetailSave: updateSkillDetailInForm,
                      onDetailDelete: deleteSkillInForm,
                    })
                  }
                >
                  <span>
                    {skill.skill_name} ({skill.group_name}) {/* 임시로 저장된 skill_name과 group_name 표시 */}
                  </span>
                  <span
                    className="temp-skill-tag-remove"
                    onClick={(e) => {
                      e.stopPropagation(); // 태그 클릭 이벤트(모달 열기) 전파 방지
                      removeSkillItem(skill);
                    }}
                  >
                    &times;
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
      <div className="formButtons">
        <button type="button" onClick={onCancel}>
          취소
        </button>
        <button type="button" onClick={saveForm}>
          저장
        </button>
      </div>
    </div>
  );
});
export default SkillAddForm;
