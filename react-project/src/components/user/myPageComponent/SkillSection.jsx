import '../../../css/user/myPageComponent/SkillSection.css'; // 스킬 섹션 전용 CSS
import React, { useState, useRef, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit'; // '수정' 버튼에 사용될 아이콘
import axios from 'axios';
import ValidationMessage from './ValidationMessage';
import SkillAddForm from './SkillAddForm'; // 스킬 추가/편집 폼 (드롭다운)
import SkillDetailModal from './SkillDetailModal'; // 스킬 상세 보기/수정 모달

// 입력 받을 폼 데이터
// const formSkillData = {
//     user_no: null,
//     skill_code: '',
//     group_code: '',
//     exp_level: '',
//     skill_tool: '',
// };

const SkillSection = React.memo(({ userNo, skillList, onListChange }) => {
    const [showAddForm, setShowAddForm] = useState(false); // 스킬 추가/편집 폼(드롭다운) 가시성
    const [isEditModeInAddForm, setIsEditModeInAddForm] = useState(false); // SkillAddForm이 수정 모드인지 전달 (true: 기존 스킬 로드)
    const [showSkillDetailModal, setShowSkillDetailModal] = useState(false); // 스킬 상세 보기/수정 모달 가시성
    const [editingSkillDetail, setEditingSkillDetail] = useState(null); // 상세 보기/수정 중인 스킬 (skillList의 원본 객체)
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지

    const [errors, setErrors] = useState({
        exp_level: false,
        skill_tool: false,
    });

    // 스킬 최대 개수 설정
    const MAX_SKILL_COUNT = 5;

    // 폼 열기
    const addSkill = () => {
        if (skillList.length >= MAX_SKILL_COUNT) {
            alert(`스킬은 최대 ${MAX_SKILL_COUNT}개 까지만 추가할 수 있습니다.`);
            return;
        }
        setShowAddForm(true); // 폼띄우기
        setEditingSkillDetail(null); // 상세 수정 모달
        setIsEditModeInAddForm(false);
        setErrorMessage('');
    };

    const editSkills = () => {
        if (skillList.length === 0) {
            alert('수정할 스킬이 없습니다. 먼저 스킬을 추가해주세요');

            return;
        }
        setShowAddForm(true); // 폼띄우기
        setIsEditModeInAddForm(true); // 추가
        setEditingSkillDetail(null); // 상세 수정 모달
        setErrorMessage('');
    };

    // 저장버튼 클릭 시 호출될 콜백
    const saveSkillFormChanges = async (currentFormSkills) => {
        setShowAddForm(false);
        setErrorMessage('');

        try {
            // 기존 DB 스킬 목록과 폼의 최종 스킬 목록 비교
            const existingSkillUniqueIds = new Set(skillList.map((s) => `${s.skill_code} - ${s.group_code}`));
            const formSkillUniqueIds = new Set(currentFormSkills.map((s) => `${s.skill_code}-${s.group_code}`));

            // INSERT 대상: 폼에는 있지만 기존 DB에 없는 스킬 (새로 추가될 스킬)
            const skillsToInsert = currentFormSkills.filter(
                (s) => !existingSkillUniqueIds.has(`${s.skill_code}-${s.group_code}`)
            );

            // DELETE 대상: 기존 DB에는 있었지만 폼에 없는 스킬 (삭제될 스킬)
            const skillsToDelete = skillList.filter((s) => !formSkillUniqueIds.has(`${s.skill_code}-${s.group_code}`));

            let hasChanges = false;
            if (skillsToInsert.length > 0) {
                // DB에 남을 개수 = 기존 개수 + 추가 개수 - 삭제 개수)
                hasChanges = true;
                if (skillList.length + skillsToInsert.length - skillsToDelete.length > MAX_SKILL_COUNT) {
                    setErrorMessage(`최대 ${MAX_SKILL_COUNT}개의 스킬만 등록할 수 있습니다.`);
                    setShowAddForm(true); // 폼을 열고 사용자에게 알리고 저장 중단하기
                    return;
                }
                const insertPromises = skillsToInsert.map((skill) => {
                    const dataToSend = {
                        user_no: null,
                        skill_code: skill.skill_code,
                        group_code: skill.group_code,
                        exp_level: '',
                        skill_tool: '',
                    };
                    // skill_code 와 group_code는 상세코드 테이블에서 받아와야함.
                    // 직접 저장하면 안됨
                    return axios.post(`/api/myPage/${userNo}/skills`, dataToSend);
                });
                // Promise는 데이터들을 여러개의 개별 요청들을 모아서 백엔드로 보내고
                // 작업이 성공적으로 완료되기를 기다림..
                await Promise.all(insertPromises); // 결론은 하나라도 실패하면 즉시 실패, 성공하면 모두 성공
            }

            // Delete 요청
            if (skillsToDelete.length > 0) {
                hasChanges = true;
                const deletePromises = skillsToDelete.map((skill) => {
                    return axios.delete(`/api/myPage/${skill.skill_code}/${skill.group_code}`);
                });
                await Promise.all(deletePromises);
            }

            if (hasChanges) {
                alert('dz');
            } else {
                alert('변경사항이 없어 저장할 내용이 없습니다.');
            }
            // 부모 컴포넌트(MyCareer)의 onListChange 호출하여 skillList 전체 새로고침
            if (onListChange) {
                onListChange();
            }
        } catch (error) {
            console.error('스킬 저장 실패', error);
        }
    };
    // SkillAddForm에서 '취소' 버튼 클릭 시 호출될 콜백
    const cancelAddForm = () => {
        // 함수명 유지: cancelAddForm
        const isConfirm = window.confirm('작성 중인 내용을 취소하시겠습니까?');
        if (isConfirm) {
            setShowAddForm(false);
            setErrorMessage('');
        }
    };

    // SkillAddForm에서 스킬 태그 클릭 시 호출될 콜백 (상세 보기/수정 모달 열기)
    const modifiedItemClick = useCallback((skillDataToEdit) => {
        // 함수명 유지: modifiedItemClick
        setEditingSkillDetail(skillDataToEdit); // 스킬 객체 전체를 설정
        setShowSkillDetailModal(true); // 상세 보기/수정 모달 열기
        setErrorMessage('');
    }, []); // 이 함수 자체는 SkillAddForm에서 전달될 것이므로 skillList에 의존하지 않음

    // SkillDetailModal에서 '저장' 버튼 클릭 시 호출될 콜백 (숙련도/툴/특이사항 업데이트)
    const saveSkillDetailForm = async (updatedSkillData) => {
        // 함수명 유지: saveSkillDetailForm
        setShowSkillDetailModal(false);
        setErrorMessage('');

        try {
            await axios.put(
                `/api/myPage/${userNo}/skills/${updatedSkillData.skill_code}/${updatedSkillData.group_code}`,
                updatedSkillData // 수정된 모든 데이터 전송
            );
            alert('스킬 상세 정보가 수정되었습니다.');

            if (onListChange) {
                onListChange();
            }
            setEditingSkillDetail(null);
        } catch (error) {
            console.error('스킬 상세 정보 수정 실패:', error);
            setErrorMessage('스킬 상세 정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // SkillDetailModal에서 '취소' 버튼 클릭 시 호출될 콜백
    const cancelSkillDetailForm = () => {
        // 함수명 유지: cancelSkillDetailForm
        setShowSkillDetailModal(false);
        setEditingSkillDetail(null);
        setErrorMessage('');
    };

    // SkillDetailModal에서 '삭제' 버튼 클릭 시 호출될 콜백 (DB에서 스킬 삭제)
    const deleteSkillDetailItem = async (skillCodeToDelete, groupCodeToDelete) => {
        // 함수명 유지: deleteSkillDetailItem
        setShowSkillDetailModal(false); // 모달 닫기
        setErrorMessage('');

        const isConfirm = window.confirm('정말로 이 스킬을 삭제하시겠습니까? 되돌릴 수 없습니다.');
        if (!isConfirm) {
            return; // 사용자가 취소하면 아무것도 하지 않음
        }

        try {
            await axios.delete(`/api/myPage/${userNo}/skills/${skillCodeToDelete}/${groupCodeToDelete}`);
            alert('스킬이 삭제되었습니다.');

            if (onListChange) {
                onListChange(); // MyCareer에서 skillList 전체 새로고침
            }
            setEditingSkillDetail(null);
        } catch (error) {
            console.error('스킬 삭제 실패:', error);
            alert('스킬 삭제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="careerInfoSection">
            <div className="careerInfoHeader">
                <p className="careerInfoTitle">보유 스킬</p>
                <div className="header-buttons">
                    {/* '추가' 버튼 */}
                    <p
                        className={`plusFunction ${skillList.length >= MAX_SKILL_COUNT ? 'disabled-button' : ''}`}
                        onClick={addSkill}
                    >
                        추가 <AddIcon className="plusIcon" />
                    </p>
                </div>
            </div>

            {/* 최대 개수 메시지는 추가/수정 폼이 열려있지 않을 때만 표시 */}
            {skillList.length >= MAX_SKILL_COUNT && !showAddForm && (
                <p className="limit-message">스킬은 최대 {MAX_SKILL_COUNT}개까지만 등록할 수 있습니다.</p>
            )}

            {/* SkillAddForm (스킬 추가/편집 폼) - showAddForm 상태에 따라 렌더링 */}
            {showAddForm && (
                <SkillAddForm
                    userNo={userNo}
                    onSave={saveSkillFormChanges} // 폼 저장 시 호출될 콜백
                    onCancel={cancelAddForm} // 폼 취소 시 호출될 콜백
                    existingSkillList={skillList} // 현재 DB에 저장된 스킬 목록 (비교 및 초기화용)
                    isEditMode={isEditModeInAddForm} // SkillAddForm이 수정 모드인지 전달
                    onTagClick={modifiedItemClick} // 폼 내부 태그 클릭 시 상세 모달 열기 콜백 전달
                />
            )}

            {/* 보유 스킬 태그 목록 표시 (메인 UI) - SkillAddForm이 열려있지 않을 때만 표시 */}
            {!showAddForm && (
                <div className="skill-tags-container">
                    {skillList && skillList.length > 0 ? (
                        skillList.map((skill) => (
                            <div
                                key={`${skill.user_no}-${skill.skill_code}-${skill.group_code}`}
                                className="skill-tag"
                                // 메인 UI의 태그는 클릭해도 아무 일도 일어나지 않음 (읽기 전용 뷰)
                            >
                                {/* 스킬명 (그룹명) */}
                                <span className="skill-tag-name">
                                    {skill.skill_name} ({skill.group_name})
                                </span>
                                {/* 메인 UI 태그 옆에는 삭제/수정 아이콘 없음 */}
                                <div className="itemActions">
                                    <EditIcon
                                        className="editIcon"
                                        style={{ cursor: 'pointer', fontSize: 'large' }}
                                        onClick={() => modifiedItemClick(editSkills)}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="emptyMessage">보유 스킬을 추가해 주세요</p>
                    )}
                </div>
            )}

            {errorMessage && <ValidationMessage message={errorMessage} />}

            {/* 스킬 상세 보기/수정 모달 */}
            {showSkillDetailModal && editingSkillDetail && (
                <SkillDetailModal
                    userNo={userNo}
                    skillData={editingSkillDetail}
                    onSave={saveSkillDetailForm} // 저장 콜백
                    onCancel={cancelSkillDetailForm} // 취소 콜백
                    onDelete={deleteSkillDetailItem} // 삭제 콜백
                />
            )}
        </div>
    );
});
//tt
export default SkillSection;
