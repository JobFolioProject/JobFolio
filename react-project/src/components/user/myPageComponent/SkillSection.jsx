import '../../../css/user/myPageComponent/SkillSection.css'; // 스킬 섹션 전용 CSS
import React, { useState, useRef, useEffect, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import axios from '../../../utils/axiosConfig';
import ValidationMessage from './ValidationMessage';
import SkillAddForm from './SkillAddForm'; // 스킬 추가/편집 폼 (드롭다운)
import SkillDetailModal from './SkillDetailModal'; // 스킬 상세 보기/수정 모달
import EditIcon from '@mui/icons-material/Edit';

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
  const [isEditModeInAddForm, setIsEditModeInAddForm] = useState(false); // SkillAddForm이 수정 모드인지 전달
  const [showSkillDetailModal, setShowSkillDetailModal] = useState(false); // 스킬 상세 보기/수정 모달 가시성
  const [editingSkillDetail, setEditingSkillDetail] = useState(null); // 상세 보기/수정 중인 스킬
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지

  // 스킬 최대 개수 설정
  const MAX_SKILL_COUNT = 10;

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

  // 수정 버튼 클릭 시 폼 열기 (기존 스킬 편집 모드임)
  const openEditForm = () => {
    if (skillList.length === 0) {
      alert('수정할 스킬이 없습니다. 먼저 스킬을 추가해주세요');

      return;
    }
    setShowAddForm(true); // 폼띄우기
    setIsEditModeInAddForm(true); // 편집 모드
    setEditingSkillDetail(null); // 상세 수정 모달 상태 초기화
    setErrorMessage(''); // 에러 메세지 호출
  };

  // skillAddForm에서 저장 버튼 클릭 시 호출될 콜백
  const saveSkillFormChanges = async (currentFormSkills) => {
    setShowAddForm(false); // 폼닫고
    setErrorMessage(''); // 에러 메세지 초기화

    try {
      // 기존 DB 스킬 목록과 폼의 최종 스킬 목록 비교를 위해 Map을 생성
      // 키는 skill_code-group_code, 값은 해당 스킬 객체 (SkillVO)
      const existingSkillMap = new Map(skillList.map((s) => [`${s.skill_code}-${s.group_code}`, s]));
      const formSkillMap = new Map(currentFormSkills.map((s) => [`${s.skill_code}-${s.group_code}`, s]));

      // INSERT 할 대상  폼에는 있는데  DB에 없는 스킬 (새로 추가될 스킬)
      const skillsToInsert = currentFormSkills.filter((s) => !existingSkillMap.has(`${s.skill_code}-${s.group_code}`));

      // DELETE 기존 DB에는 있었지만 폼에 없는 스킬 (삭제될 스킬)
      const skillsToDelete = skillList.filter((s) => !formSkillMap.has(`${s.skill_code}-${s.group_code}`));

      // UPDATE 기존 DB에도 있고 폼에도 있는데 expLevel 또는 skillToolㅇ ㅣ변경된 경우
      const skillsToUpdate = currentFormSkills.filter((formSkill) => {
        const uniqueId = `${formSkill.skillCode}-${formSkill.groupCode}`;
        const existing = existingSkillMap.get(uniqueId);

        //DB도 있었고 폼에도 있는 스킬 중에 expLevel 또는 skillTool이 변경된 경우에
        return existing && (existing.exp_level !== formSkill.exp_level || existing.skillTool !== formSkill.skillTool);
      });

      // 변경사항이 있었는지 여부
      let hasChanges = false;

      // 최종 개수 검사하기
      if (skillList.length + skillsToInsert.length - skillsToDelete.length > MAX_SKILL_COUNT) {
        setErrorMessage(`최대 ${MAX_SKILL_COUNT}개의 스킬만 등록할 수 있습니다. 추가할 스킬 수를 조절해주세요.`);
        setShowAddForm(true); // 폼을 다시 열어 사용자에게 알림
        return; // 저장 중단
      }

      // insert 요청
      if (skillsToInsert.length > 0) {
        // DB에 남을 개수 = 기존 개수 + 추가 개수 - 삭제 개수)
        hasChanges = true;
        const insertPromises = skillsToInsert.map((skill) => {
          // 백앤드 필드명에 맞춰 데이터 구성
          const dataToSend = {
            user_no: userNo,
            skill_code: skill.skill_code,
            group_code: skill.group_code,
            exp_level: skill.exp_level,
            skill_tool: skill.skill_tool,
          };
          // skill_code 와 group_code는 상세코드 테이블에서 받아와야함.
          // 직접 저장하면 안됨
          return axios.post(`/api/myPage/${userNo}/skills`, dataToSend);
        });
        // Promise는 데이터들을 여러개의 개별 요청들을 모아서 백엔드로 보내고
        // 작업이 성공적으로 완료되기를 기다림..
        await Promise.all(insertPromises); // 결론은 하나라도 실패하면 즉시 실패, 성공하면 모두 성공
      }

      // update 요청
      if (skillsToUpdate.length > 0) {
        hasChanges = true;
        const updatePromises = skillsToUpdate.map((skill) => {
          // 백엔드 SkillVO 필드명에 맞춰 데이터 구성
          const dataToSend = {
            userNo: userNo,
            skillCode: skill.skillCode,
            groupCode: skill.groupCode,
            expLevel: skill.expLevel,
            skillTool: skill.skillTool,
          };
          return axios.put(`/api/myPage/${userNo}/skills/${skill.skill_code}/${skill.group_code}`, dataToSend);
        });
        await Promise.all(updatePromises); // 모든 UPDATE 요청 병렬 처리
      }

      // Delete 요청
      if (skillsToDelete.length > 0) {
        hasChanges = true;
        const deletePromises = skillsToDelete.map((skill) => {
          return axios.delete(`/api/myPage/${userNo}/skills/${skill.skill_code}/${skill.group_code}`);
        });
        await Promise.all(deletePromises);
      }

      if (hasChanges) {
        alert('스킬이 성공적으로 저장/삭제/수정되었습니다.');

        // 부모 컴포넌트(MyCareer)의 onListChange 호출하여 skillList 전체 새로고침
        if (onListChange) {
          onListChange();
        }
      } else {
        alert('변경사항이 없어 저장할 내용이 없습니다.');
      }
    } catch (error) {
      console.error('스킬 저장 실패', error);
      setErrorMessage('스킬 저장/삭제/수정 중 오류가 발생했습니다.');
      setShowAddForm(true);
    }
  };

  // SkillAddForm에서 취소 버튼 클릭 시 호출될 콜백
  const cancelAddForm = useCallback(() => {
    const isConfirm = window.confirm('작성 중인 내용을 취소하시겠습니까?');
    if (isConfirm) {
      setShowAddForm(false);
      setErrorMessage('');
    }
  }, []);

  // 스킬 태그 클릭 시 상세 보기/수정 모달 열기
  const openDetailModal = useCallback((skillData) => {
    // 함수명 'modifiedItemClick' -> 'openDetailModal'
    // skillData는 SkillVO 형태 (skillCode, groupCode, expLevel, skillTool, skillName, groupName 포함)
    setEditingSkillDetail({
      ...skillData,
      // 모달에서 저장/삭제 후 SkillAddForm의 상태를 업데이트하기 위한 콜백 전달
      // 이 콜백들은 SkillDetailModal에서 직접 SkillAddForm의 상태를 변경하도록 연결
      onDetailSave: updateSkillDetailInAddForm,
      onDetailDelete: deleteSkillInAddForm,
    });
    setEditingSkillDetail(skillData);
    setShowSkillDetailModal(true);
    setErrorMessage('');
  }, []); // 의존성 배열에 콜백 추가 (useCallback)

  // SkillDetailModal에서 '저장' 시 호출될 콜백 ( SkillAddForm의 currentFormSkills 업데이트용 )
  // 이 함수는 SkillAddForm 내부에서 currentFormSkills 상태를 업데이트합니다.
  const updateSkillDetailInAddForm = useCallback((updatedSkillData) => {}, []);
  const deleteSkillInAddForm = useCallback((skillToDeleteCode, skillToDeleteGroupCode) => {}, []);

  // SkillDetailModal에서 취소 버튼 클릭시 호출될 콜백 ( 모달 닫기 )
  const cancelSkillDetailForm = () => {
    setShowSkillDetailModal(false);
    setEditingSkillDetail(null);
    setErrorMessage('');
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
      <div className="editFunction">
        <EditIcon
          className="editIcon"
          style={{ cursor: 'pointer', fontSize: 'large' }}
          onClick={() => openEditForm()}
        />
      </div>

      {/* 최대 개수 메시지는 추가/수정 폼이 열려있지 않을 때만 표시 */}
      {skillList.length >= MAX_SKILL_COUNT && !showAddForm && (
        <p className="limit-message">스킬은 최대 {MAX_SKILL_COUNT}개까지만 등록할 수 있습니다.</p>
      )}

      {/* SkillAddForm (스킬 추가/편집 폼) - showAddForm 상태에 따라 렌더링 */}
      {showAddForm && (
        <SkillAddForm
          user_no={userNo} // props로 받은 user_no 전달
          onSave={saveSkillFormChanges} // 폼 저장 시 호출될 콜백
          onCancel={cancelAddForm} // 폼 취소 시 호출될 콜백
          existingSkillList={skillList || []} // 현재 DB에 저장된 스킬 목록 (비교 및 초기화용)
          isEditMode={isEditModeInAddForm} // SkillAddForm이 수정 모드인지 전달
          onTagClick={openDetailModal}
        />
      )}

      {/* 보유 스킬 태그 목록 표시 (메인 UI) - SkillAddForm이 열려있지 않을 때만 표시 */}
      {!showAddForm && (
        <div className="skill-tags-container">
          {Array.isArray(skillList) && skillList.length > 0 ? ( // <-- 여기에 Array.isArray(skillList) 추가!
            skillList.map((skill) => (
              <div key={`${skill.user_no}-${skill.skill_code}-${skill.group_code}`} className="skill-tag">
                <span className="skill-tag-name">
                  {skill.skill_name} ({skill.group_name})
                </span>
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
          skillData={editingSkillDetail} // SkillVO 형태의 스킬 데이터 + 콜백들
          onClose={cancelSkillDetailForm} // 모달 취소 시 호출될 콜백
          isOpen={showSkillDetailModal}
        />
      )}
    </div>
  );
});

export default SkillSection;
