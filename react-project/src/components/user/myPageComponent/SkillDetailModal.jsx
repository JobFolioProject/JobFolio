import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../../css/user/myPageComponent/SkillDetailModal.css';
import axios from '../../../utils/axiosConfig';
import ValidationMessage from './ValidationMessage';

const SkillDetailModal = React.memo(({ isOpen, onClose, skillData, onDetailSave, onDetailDelete }) => {
  // skillData는 SkillSection에서 전달받은 스킬 객체 + SkillAddForm에서 추가된 콜백
  // (user_no, skill_code, group_code, skill_name, group_name, exp_level, skill_tool, onDetailSave, onDetailDelete 포함)
  // SkillVO 형태
  const [currentFormSkill, setCurrentFormSkill] = useState(skillData);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({
    exp_level: false,
  });

  const expLevelRef = useRef(null); // 숙련도 select ref
  const skillToolRef = useRef(null); // 사용 툴 input ref

  useEffect(() => {
    setCurrentFormSkill(skillData);
    // 모달이 열릴 때 에러 메시지 초기화 (이전 상태가 남아있을 수 있으므로)
    setErrorMessage('');
    setErrors({ exp_level: false, skill_tool: false });
  }, [skillData, isOpen]); // isOpen도 추가하여 모달이 다시 열릴 때 초기화되도록 함

  // 모달이 열릴 때 포커스 설정
  useEffect(() => {
    if (isOpen && expLevelRef.current) {
      // 모달이 열렸을 때만 포커스
      expLevelRef.current.focus();
    }
  }, [isOpen]); // isOpen이 변경될 때마다 실행되도록

  const formChange = useCallback((e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: false }));
    setErrorMessage('');
    setCurrentFormSkill((prev) => ({ ...prev, [name]: value }));
  }, []);

  const saveForm = useCallback(async () => {
    // useCallback 추가
    setErrorMessage('');
    let hasError = false;
    let firstErrorRef = null;

    // 숙련도 필수 검사 (exp_level은 스네이크 케이스)
    if (!currentFormSkill.exp_level) {
      setErrors((prev) => ({ ...prev, exp_level: true }));
      if (!firstErrorRef) firstErrorRef = expLevelRef;
      hasError = true;
    }
    // skill_tool이 필수??
    // skill_tool이 필수라면 여기에 검사 로직 추가

    if (hasError) {
      setErrorMessage('필수 정보를 입력해주세요');
      if (firstErrorRef && firstErrorRef.current) {
        // setTimeout 없이 바로 focus하면 렌더링 사이클에 따라 안될 수 있으므로 기존 로직 유지
        setTimeout(() => {
          firstErrorRef.current.focus();
          firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 10);
      }
      return;
    }

    if (skillData.onDetailSave) {
      skillData.onDetailSave(currentFormSkill); // SkillAddForm의 currentFormSkills를 업데이트
    }
    onClose(); // 모달 닫기 (onCancel 대신 onClose 사용)
  }, [currentFormSkill, onClose, skillData]); // onCancel 대신 onClose를 의존성에 추가

  // 취소 버튼 핸들러 (prop으로 받은 onCancel 사용)
  const handleCancel = useCallback(() => {
    onClose(); // 모달 닫기
  }, [onClose]); // onClose를 의존성에 추가

  // 숙련도 레벨 옵션
  const expLevelOptions = ['상', '중', '하'];

  // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;
  return (
    <div className="modal-backdrop">
      <div className="skill-detail-modal">
        <h3>스킬 상세 정보</h3>
        <span className="selected-skill-display">**{currentFormSkill.skill_name}** 에 대한 상세 정보</span>

        <div className="form-group">
          <label htmlFor="exp_level">숙련도:</label>
          <select
            id="exp_level"
            name="exp_level"
            value={currentFormSkill.exp_level || ''}
            onChange={formChange}
            className={errors.exp_level ? 'error-field' : ''}
            ref={expLevelRef}
          >
            <option value="">선택</option>
            {expLevelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="skill_tool">사용 툴/기술명 (특이사항):</label>
          <input
            type="text"
            id="skill_tool"
            name="skill_tool"
            placeholder="예: Spring Boot, Figma, Photoshop, 기타 특이사항"
            value={currentFormSkill.skill_tool || ''} // 스네이크 케이스
            onChange={formChange}
            maxLength={2000}
            className={errors.skill_tool ? 'error-field' : ''}
            ref={skillToolRef}
          />
        </div>

        {errorMessage && <ValidationMessage message={errorMessage} />}

        <div className="modal-actions">
          <button type="button" onClick={handleCancel} className="modal-cancel-button">
            취소
          </button>
          <button type="button" onClick={saveForm} className="modal-save-button">
            저장
          </button>
        </div>
      </div>
    </div>
  );
});
export default SkillDetailModal;
