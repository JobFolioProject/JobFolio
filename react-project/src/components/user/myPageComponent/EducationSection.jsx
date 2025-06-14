import '../../../css/user/myPageComponent/EducationSection.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const formEduData = {
    edu_no: null,
    user_no: null,
    school_name: '',
    enroll_date: '',
    grad_date: '',
    edu_status: '',
    major: '',
    sub_major: '',
    gpa: '',
    notes: '',
};

// React.memo로 감싸서 props가 변경되지 않으면 불필요한 리렌더링 방지
const EducationSection = React.memo(({ userNo, educationList, onListChange }) => {
    // 추가를 눌렀을때 드롭다운으로 폼을 보여줄지 말지 결정
    const [showAddForm, setShowAddForm] = useState(false);

    // 수정중인 항목의 ID를 (eduNo)를 가저옴
    const [editingEduNo, setEditingEduNo] = useState(null);

    // 업데이트할 항목의 데이터를 초기화
    const [currentFormEdu, setCurrentFormEdu] = useState(formEduData);

    // 추가 버튼을 클릭했을 시 이벤트 수정모득 아님
    const addEducation = () => {
        // 먼저 폼 상태 내용를 초기화
        setCurrentFormEdu(formEduData);
        setShowAddForm(true);
        setEditingEduNo(null);
    };

    // 폼(인풋)에 값 입력을 위한 폼체인지
    const formChange = (e) => {
        const { name, value } = e.target;
        setCurrentFormEdu((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 작성 취소 닫기창
    const cancelForm = () => {
        const isConfirm = window.confirm('작성 중인 내용을 취소하시겠습니까?');
        if (isConfirm) {
            // 폼 닫힘
            setShowAddForm(false);
            // 수정 모드 해제
            setEditingEduNo(null);
            // 폼 내용 초기화
            setCurrentFormEdu(formEduData);
        }
    };

    // 입력 필드에 대한 ref (포커스 제어용)
    const schoolNameRef = useRef(null);
    const majorRef = useRef(null);

    // 폼이 열릴 때 첫 번째 필드에 포커스 schoolNameRef는 school_name 필드와 연결
    useEffect(() => {
        if ((showAddForm || editingEduNo !== null) && schoolNameRef.current) {
            schoolNameRef.current.focus();
        }
    }, [showAddForm, editingEduNo]);

    // 학력 상태 드롭다운 옵션
    const eduStatusOptions = ['재학', '졸업', '수료', '휴학', '자퇴'];
    const displayGradDate = (edu) => {
        if (edu.edu_status === '재학') {
            return '재학중';
        }
        if (edu.edu_status === '휴학') {
            return '휴학중';
        }
        return edu.grad_date ? edu.grad_date : '';
    };

    // 수정 아이콘 버튼 이벤트
    const modifiedItemClick = async (eduNoToEdit) => {
        // 수정할 edu_no을 가져와서 폼을 열기
        const modiftyEdu = educationList.find((edu) => edu.edu_no === eduNoToEdit);
        if (modiftyEdu) {
            setCurrentFormEdu(modiftyEdu);
            // 찾은 edu_no 를 수정 항목에 상태 설정
            setEditingEduNo(eduNoToEdit);
            // 폼 열기
            setShowAddForm(true); // 수정과 추가가 같은 폼을 사용해야함
        }
    };

    // 삭제 아이콘 버튼 이벤트
    const deleteItemClick = async (eduNoToDelete) => {
        const isConfirm = window.confirm('정말로 이 학력을 삭제하시겠습니까? 되돌릴 수 없습니다.');

        if (isConfirm) {
            await axios
                .delete(`/api/myPage/${userNo}/educations/${eduNoToDelete}`)
                .then((res) => {
                    console.log(res.data);
                    alert('학력이 삭제되었습니다.');

                    // onListChange 콜백 함수를 넣어줘야 화면에 다시 그려줌
                    if (onListChange) {
                        // 부분 갱신하기
                        const updatedEducationList = educationList.filter((edu) => edu.edu_no !== eduNoToDelete);
                        // 기존 educationList에서 삭제된 항목만 제외하고 새로운 배열을 만듦
                        onListChange(updatedEducationList); // <-- 업데이트된 리스트를 인자로 전달!
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    // 데이터 저장 및 수정 AXIOS
    const saveForm = async (currentFormEdu) => {
        try {
            let response;

            // 수정 모드
            if (editingEduNo) {
                response = await axios.put(`/api/myPage/${userNo}/educations/${editingEduNo}`);
                alert('학력이 수정되었습니다.');

                // 수정된 항목을 목록에서 찾아서 교체 (부분 갱신)
                if (onListChange) {
                    const updatedEducationList = educationList.map((edu) =>
                        edu.edu_no === editingEduNo ? { ...edu, ...editingEduNo } : edu
                    );
                    onListChange(updatedEducationList);
                }
            } else {
                response = await axios.post(`/api/myPage/${userNo}/educations`, currentFormEdu);
                alert('학력이 저장 되었습니다.');

                // 저장 성공후 초기화
                setCurrentFormEdu(formEduData);
                setShowAddForm(false);
                setEditingEduNo(null);

                // onListChange 콜백 함수를 넣어줘야 화면에 다시 그려줌
                if (onListChange) {
                    const newEdu = response.data; // 반환한 새 데이터
                    onListChange([...educationList, newEdu]);
                }
            }

            setCurrentFormEdu();
            // 폼 열기
            setShowAddForm(true); // 수정과 추가가 같은 폼을 사용해야함
            // 폼 초기화 및 닫기
            setEditingEduNo(null);
        } catch (error) {
            console.log(error);
            alert('학력 저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="careerInfoSection">
            <div className="careerInfoHeader">
                <p>학력</p>
                <p className="plusFunction" onClick={addEducation}>
                    추가 <AddIcon className="plusIcon" />
                </p>
            </div>

            {!showAddForm && editingEduNo === null ? ( // 폼이 열려있지 않을 때 (추가/수정 모드가 아닐 때)
                educationList && educationList.length > 0 ? (
                    // 기존 학력 목록이 있으면 맵핑하여 표시
                    educationList.map((edu) => {
                        return (
                            // 키 값을 학력번호로.
                            <div key={edu.edu_no} className="careerItemDisplay">
                                {/* 여기에 입력된 값 불러오기 */}
                                <div>
                                    <p>{edu.school_name}</p>
                                    <p>
                                        {edu.enroll_date} ~ {displayGradDate(edu)}
                                    </p>
                                </div>
                                <div>
                                    <p>
                                        {edu.major}
                                        {'  '}
                                        {edu.sub_major}
                                    </p>
                                    <p>학점 : {edu.gpa}</p>
                                </div>
                                <div className="itemActions">
                                    <EditIcon
                                        className="editIcon"
                                        style={{ cursor: 'pointer', fontSize: 'large' }}
                                        onClick={() => modifiedItemClick(edu.edu_no)}
                                    />

                                    <DeleteIcon
                                        className="deleteIcon"
                                        style={{ cursor: 'pointer', fontSize: 'large' }}
                                        onClick={() => deleteItemClick(edu.edu_no)}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="emptyMessage">학력을 추가해 주세요</p>
                )
            ) : null}

            {/* 학력 추가/수정 폼 */}
            {/* 추가를 누르면 보임 */}
            {(showAddForm || editingEduNo !== null) && (
                <div className="educationFormBox">
                    <div>
                        <p className="formTitle">{editingEduNo !== null ? '학력 수정' : '새 학력 추가'}</p>
                    </div>
                    <br />
                    <div className="educationInputArea">
                        <input
                            type="text"
                            name="school_name"
                            placeholder="학교명"
                            value={currentFormEdu.school_name || ''}
                            ref={schoolNameRef}
                            onChange={formChange}
                            maxLength={10}
                        />
                        <input
                            type="date"
                            name="enroll_date"
                            value={currentFormEdu.enroll_date || ''}
                            onChange={formChange}
                            maxLength={10}
                        />
                        <input
                            type="date"
                            name="grad_date"
                            value={currentFormEdu.grad_date || ''}
                            onChange={formChange}
                            maxLength={10}
                            disabled={currentFormEdu.edu_status === '재학' || currentFormEdu.edu_status === '휴학'}
                        />
                        <select name="edu_status" value={currentFormEdu.edu_status || ''} onChange={formChange}>
                            <option value="">학력상태 선택</option>
                            {eduStatusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            name="major"
                            placeholder="전공"
                            value={currentFormEdu.major || ''}
                            ref={majorRef}
                            onChange={formChange}
                            maxLength={10}
                        />
                        <input
                            type="text"
                            name="sub_major"
                            placeholder="부전공"
                            value={currentFormEdu.sub_major || ''}
                            onChange={formChange}
                            maxLength={10}
                        />
                        <input
                            type="text"
                            name="gpa"
                            placeholder="학점 (예: 3.9/4.5)"
                            value={currentFormEdu.gpa || ''}
                            onChange={formChange}
                            maxLength={3}
                        />
                        <br />
                        <textarea
                            name="notes"
                            placeholder="특이사항"
                            value={currentFormEdu.notes || ''}
                            onChange={formChange}
                            maxLength={2000}
                        ></textarea>
                    </div>

                    <div className="formButtons">
                        <button onClick={cancelForm}>취소</button>
                        <button onClick={() => saveForm(currentFormEdu)}>저장</button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default EducationSection;
