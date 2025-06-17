import React, { useState, useEffect, useRef } from 'react';
import '../../../css/user/myPageComponent/SkillDetailModal.css';
import axios from '../../../utils/axiosConfig';
import ValidationMessage from './ValidationMessage';

const SkillDetailModal = React.memo(({ userNo, skillData, onCancel }) => {
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

    // 포커스 설정
    useEffect(() => {
        if (expLevelRef.current) {
            expLevelRef.current.focus();
        }
    });

    const formChange = (e) => {
        const { name, value } = e.target;
        setErrors((perv) => ({ ...perv, [name]: false }));
        setErrorMessage('');
        setCurrentFormSkill((perv) => ({ ...perv, [name]: value }));
    };

    const saveForm = async () => {
        setErrorMessage('');
        let hasError = false;
        let firstErrorRef = null;

        // 숙련도 필수 검사
        if (!currentFormSkill.exp_level) {
            setErrors((prev) => ({ ...prev, exp_level: true }));
            if (!firstErrorRef) firstErrorRef = expLevelRef;
            hasError = true;
        }
        // skill_tool이 필수??

        if (hasError) {
            setTimeout(() => {
                setErrorMessage('필수 정보를 입력해주세요');
                if (firstErrorRef && firstErrorRef.current) {
                    firstErrorRef.current.focus();
                    firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 10);
            return;
        }
        skillData.onDetailSave(currentFormSkill); // SkillAddForm의 currentFormSkills를 업데이트
        onCancel(); // 모달 닫기
    };

    // '삭제' 버튼 클릭 핸들러 (모달 내에서 개별 삭제)
    const deleteItem = () => {
        // 함수명 유지: deleteItem
        const isConfirm = window.confirm('정말로 이 스킬을 삭제하시겠습니까?');
        if (!isConfirm) {
            return;
        }
        // 부모(SkillAddForm)로부터 받은 onDetailDelete 콜백을 호출하여 SkillAddForm의 상태를 업데이트
        // SkillDetailModal은 직접 DB 통신(DELETE)을 하지 않음
        skillData.onDetailDelete(currentFormSkill.skill_code, currentFormSkill.group_code); // SkillAddForm의 currentFormSkills에서 제거
        onCancel(); // 모달 닫기
    };

    // 숙련도 레벨 옵션 (언어 섹션과 유사하게)
    const expLevelOptions = ['상', '중', '하']; // DB에 따라 'Expert', 'Normal', 'Basic' 등 조정

    return (
        <div className="modal-backdrop">
            <div className="modal-content skill-detail-modal">
                <h3>스킬 상세 정보</h3>
                <p className="selected-skill-display">
                    **{currentFormSkill.skill_name} ({currentFormSkill.group_name})** 에 대한 상세 정보
                </p>

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
                    <label htmlFor="skill_tool">사용 툴/기술명 (특이사항):</label> {/* 플레이스홀더 텍스트 변경 */}
                    <input
                        type="text"
                        id="skill_tool"
                        name="skill_tool"
                        placeholder="예: Spring Boot, Figma, Photoshop, 기타 특이사항"
                        value={currentFormSkill.skill_tool || ''}
                        onChange={formChange}
                        maxLength={2000} // skill_tool이 notes 역할도 겸하므로 길이를 늘림
                        className={errors.skill_tool ? 'error-field' : ''}
                        ref={skillToolRef}
                    />
                </div>

                {errorMessage && <ValidationMessage message={errorMessage} />}

                <div className="modal-actions">
                    <button type="button" onClick={onCancel} className="modal-cancel-button">
                        취소
                    </button>
                    <button type="button" onClick={saveForm} className="modal-save-button">
                        저장
                    </button>
                    <button type="button" onClick={deleteItem} className="modal-delete-button">
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
});
export default SkillDetailModal;
