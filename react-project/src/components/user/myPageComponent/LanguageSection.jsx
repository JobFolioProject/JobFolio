import React, { useState, useRef, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import '../../../css/user/myPageComponent/LanguageSection.css';
import ValidationMessage from './ValidationMessage';

// 입력 받을 폼 데이터
const formLanguageData = {
  language: '', // 언어
  user_no: null, // 유저번호
  level: '', // 렙
};

const LanguageSection = React.memo(({ userNo, languageSkillList, onListChange }) => {
  const [showAddForm, setShowAddForm] = useState(false); // 새로운 언어 폼
  const [editingLanguage, seteditingLanguage] = useState(null); // 수정중인 언어
  const [currentFormLanguage, setCurrentFormLanguage] = useState(formLanguageData); // 업데이트할 항목의 데이터를 초기화
  const [errorMessage, setErrorMessage] = useState(''); // 에러메세지

  // 에러 초기화
  const [errors, setErrors] = useState({
    language: false, // 언어
    level: false, // 렙
  });

  // 자격증 최대 개수 설정
  const MAX_LANGUAGE_SKILL_COUNT = 5;
  // 추가 버튼 활성화 여부
  const isAddButtonDisabled = languageSkillList.length >= MAX_LANGUAGE_SKILL_COUNT;

  // 폼 열기
  const addLanguageSkill = () => {
    if (languageSkillList.length >= MAX_LANGUAGE_SKILL_COUNT) {
      alert(`어학 능력은 최대 ${MAX_LANGUAGE_SKILL_COUNT}개까지만 추가할 수 있습니다.`);
      return;
    }
    setCurrentFormLanguage(formLanguageData);
    setShowAddForm(true);
    seteditingLanguage(null);
    setErrorMessage('');
    setErrors({});
  };

  // 폼에 값 입력을 위한 폼 체인지 - 입력에 대한 이벤트
  const formChange = (e) => {
    const { name, value } = e.target;

    // 에러
    setErrors((pervErrors) => ({ ...pervErrors, [name]: false }));
    setErrorMessage('');

    setCurrentFormLanguage((prev) => {
      let newValue = value;

      /*

        조건 검사 생각하기


        */

      const newState = {
        ...prev,
        [name]: newValue,
      };

      return newState;
    });
  };

  // 취소시 폼을 닫음
  const cancelForm = () => {
    const isConfirm = window.confirm('작성 중인 내용을 취소하시겠습니까?');
    if (isConfirm) {
      setCurrentFormLanguage(formLanguageData);
      setShowAddForm(false);
      seteditingLanguage(null);
      setErrorMessage('');
      setErrors({});
    }
  };

  // 수정 아이콘 버튼 이벤트
  const modifiedItemClick = async (LanguageNoToEdit) => {
    // 수정할 cert_no를 가져와 폼을 열기\
    const modifyLanguage = languageSkillList.find((lang) => lang.language === LanguageNoToEdit);
    if (modifyLanguage) {
      setCurrentFormLanguage(modifyLanguage);
      seteditingLanguage(LanguageNoToEdit);
      setShowAddForm(true);
      setErrorMessage('');
      setErrors({});
    }
  };

  // 삭제 아이콘 버튼 이벤트
  const deleteItemClick = async (languageToDelete) => {
    const isConfirm = window.confirm('정말로 이 어학 능력을 삭제하시겠습니까? 되돌릴 수 없습니다.');

    if (isConfirm) {
      setErrorMessage('');
      await axios
        .delete(`/api/myPage/${userNo}/languages/${languageToDelete}`)
        .then((res) => {
          console.log(res.data);
          alert('어학 능력이 삭제되었습니다.');

          // onListChange 콜백 함수 - 수정, 삭제, 저장 했을 때 그 리스트만 그려주는거
          if (onListChange) {
            const updatedLanguageSkilList = languageSkillList.filter((lang) => lang.language !== languageToDelete);
            onListChange(updatedLanguageSkilList);
          }
        })
        .catch((error) => {
          console.log(error);
          alert('어학 능력 삭제에 실패했습니다. 다시 시도해주세요.');
        });
    }
  };

  // 데이터 저장 및 수정
  const saveAndUpdateForm = async (currentFormLanguage) => {
    // 에러 상태 초기화
    setErrorMessage('');

    // 저장버튼 막 눌렀을때 메세지 계속 나오게 하려면 필요.
    const messageToSet = '저장에 필요한 필수 정보를 입력해주세요.';

    setErrors({});
    let hasError = false;
    let firstErrorRef = null;

    // 모든 필드 검사
    if (!currentFormLanguage.language) {
      setErrors((prev) => ({ ...prev, language: true }));
      if (!firstErrorRef) firstErrorRef = languageRef;
      hasError = true;
    }
    if (!currentFormLanguage.level) {
      setErrors((prev) => ({ ...prev, level: true }));
      if (!firstErrorRef) firstErrorRef = levelRef;
      hasError = true;
    }

    if (hasError) {
      setTimeout(() => {
        setErrorMessage(messageToSet);
        if (firstErrorRef && firstErrorRef.current) {
          firstErrorRef?.current.focus(); // 처음 에러난 곳에 포커스를 준다

          // 스크롤 이동
          firstErrorRef.current.scrollIntoView({
            behavior: 'smooth', // 부드러운 스크롤
            block: 'center', // 뷰포트 중앙
            inline: 'nearest', // 가로 스크롤은 최소화
          });
        }
      }, 10);
      return;
    }
    try {
      let response;
      // 수정
      if (editingLanguage) {
        response = await axios.put(`/api/myPage/${userNo}/languages/${editingLanguage}`, currentFormLanguage);
        alert('어학 능력이 수정 되었습니다.');

        if (onListChange) {
          const updatedLanguageSkilList = languageSkillList.map((lang) =>
            lang.language === editingLanguage ? { ...lang, ...currentFormLanguage } : lang
          );
          onListChange(updatedLanguageSkilList);
        }
      } else {
        // 한번 더 방어
        if (languageSkillList.length >= MAX_LANGUAGE_SKILL_COUNT) {
          alert(`어학 능력은 최대 ${MAX_LANGUAGE_SKILL_COUNT}개까지만 추가할 수 있습니다.`);
          // 폼 닫기 및 상태 초기화
          setCurrentFormLanguage(formLanguageData);
          setShowAddForm(false);
          seteditingLanguage(null);
          setErrors({});
          return; // 저장 로직 중단
        }

        // 저장
        response = await axios.post(`/api/myPage/${userNo}/languages`, currentFormLanguage);
        alert('어학 능력이 저장 되었습니다.');

        if (onListChange) {
          const newLanguage = response.data;
          console.log('데이터 newLanguage : ', newLanguage);

          onListChange([...languageSkillList, newLanguage]);
        }
      }

      // 저장 수정 후 초기화
      setCurrentFormLanguage(formLanguageData);
      setShowAddForm(false);
      seteditingLanguage(null);
      setErrorMessage('');
      setErrors({});
    } catch (error) {
      console.log(error);
      alert('어학 능력이 저장에 실패했습니다. 다시 시도해주세요');
    }
  };

  // 입력 필드에 대한 ref (포커스용)
  const languageRef = useRef(null); // 자격증 일련번호
  const levelRef = useRef(null); // 자격증 이름

  // 첫번째 필드 포커스
  useEffect(() => {
    // 숏폼, 자격증 번호가 null이 아니거나 그리고 현재 자격증 이름에 입력된게 있을때 자격증이름에 포커스
    if ((showAddForm || editingLanguage !== null) && languageRef.current) {
      languageRef.current.focus();
    }
  }, [showAddForm, editingLanguage]);

  // 레벨 옵션
  const levelOptions = ['초급', '중급', '고급', '원어민'];

  return (
    <div className="careerInfoSection">
      <div className="careerInfoHeader">
        <p className="careerInfoTitle">어학 능력</p>
        <p className={`plusFunction ${isAddButtonDisabled ? 'disabled-button' : ''}`} onClick={addLanguageSkill}>
          추가 <AddIcon className="plusIcon" />
        </p>
      </div>

      {/* 언어 스킬 목록 표시 조건: 폼이 열려있지 않고, 수정 모드도 아닐 때 */}
      {!showAddForm && editingLanguage === null ? (
        languageSkillList && languageSkillList.length > 0 ? (
          languageSkillList.map((lang) => {
            // languageSkillList 매핑
            return (
              // 키 값을 language로 설정 (복합키의 일부이지만 UI 식별용)
              // 현재 복합키이지만 같은 언어로 선택되면 문제가 될 수 있음.... select로 갈지 팝업으로 갈지..
              <div key={lang.language} className="careerItemDisplay">
                {/* 언어명, 레벨 */}
                <div className="language-display-header language-line-item">
                  <p className="language-name">{lang.language}</p>
                  {lang.level && <span className="language-level">({lang.level})</span>}
                </div>

                <div className="itemActions">
                  <EditIcon
                    className="editIcon"
                    style={{ cursor: 'pointer', fontSize: 'large' }}
                    onClick={() => modifiedItemClick(lang.language)}
                  />

                  <DeleteIcon
                    className="deleteIcon"
                    style={{ cursor: 'pointer', fontSize: 'large' }}
                    onClick={() => deleteItemClick(lang.language)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="emptyMessage">어학 능력을 추가해 주세요</p>
        )
      ) : null}

      {/* 언어 스킬 추가/수정 폼 */}
      {(showAddForm || editingLanguage !== null) && (
        <div className="languageFormBox language-input-theme">
          <div>
            <p className="formTitle">{editingLanguage !== null ? '어학 능력 수정' : '새 어학 능력 추가'}</p>{' '}
          </div>
          <div className="languageContainer">
            <div className="languageInputArea">
              <div className="formCol language-name-field">
                <input
                  type="text"
                  name="language"
                  placeholder="어학 (예: 영어)"
                  value={currentFormLanguage.language || ''}
                  onChange={formChange}
                  maxLength={10}
                  className={errors.language ? 'error-field' : ''}
                  ref={languageRef} // 첫 번째 포커스 대상
                />
              </div>
              <div className="formCol language-level-field">
                <select
                  name="level"
                  value={currentFormLanguage.level || ''}
                  onChange={formChange}
                  maxLength={3} // select에 maxLength는 적용 안되지만, 편의상 남김
                  className={errors.level ? 'error-field' : ''}
                  ref={levelRef}
                >
                  <option value="">레벨 선택</option>
                  {levelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 유효성 검사 메세지 컴포넌트 */}
          {errorMessage && <ValidationMessage message={errorMessage} />}

          <div className="formButtons">
            <button onClick={cancelForm}>취소</button>
            <button onClick={() => saveAndUpdateForm(currentFormLanguage)}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default LanguageSection;
