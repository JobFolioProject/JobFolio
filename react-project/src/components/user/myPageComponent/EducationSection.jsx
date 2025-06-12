import '../../../css/user/myPageComponent/EducationSection.css';
import React, { useEffect, useState, userRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

// React.memo로 감싸서 props가 변경되지 않으면 불필요한 리렌더링 방지
const EducationSection = React.memo(({ userNo, educationList, onListChange }) => {
    // 추가를 눌렀을때 드롭다운으로 폼을 보여줄지 말지 결정
    const [showAddForm, setShowAddForm] = useState(false);

    // 수정중인 항목의 ID를 (eduNo)를 가저옴
    const [eduEditNo, setEduEditNo] = useState(null);

    // 업데이트할 항목의 데이터를 초기화
    const [currentFormEdu, setCurrentFormEdu] = useState({
        eduNo: null,
        userNo: '',
        schoolName: '',
        enrollDate: '',
        gradDate: '',
        eduStatus: '',
        major: '',
        subMajor: '',
        gpa: '',
        notes: '',
    });

    // 추가 버튼을 클릭했을 시 이벤트 수정모득 아님
    const addEducation = () => {
        if (setCurrentFormEdu == null) {
        }

        // 먼저 폼 상태 내용를 초기화
        setCurrentFormEdu({
            eduNo: '',
            userNo: '',
            schoolName: '',
            enrollDate: '',
            gradDate: '',
            eduStatus: '',
            major: '',
            subMajor: '',
            gpa: '',
            notes: '',
        });
        setShowAddForm(true);
        setEduEditNo(null);
    };

    // 작성 취소 닫기창
    const cancelForm = () => {
        const isConfirm = window.confirm('작성 중인 내용을 취소하시겠습니까?');
        if (isConfirm) {
            setShowAddForm(false);
        }
    };

    // 데이터 저장 AXIOS
    const saveForm = async () => {
        axios
            .post(`/api/myPage/${userNo}/educations`)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error);
            });
        // TODO:
    };

    // 입력 필드에 대한 ref (포커스 제어용)
    // const schoolNameRef = userRef(null);
    // const majorRef = userRef(null);

    // 폼이 열릴 때 첫 번째 필드에 포커스
    // useEffect(() => {
    //     if (showAddForm || eduEditNo !== null) {
    //         schoolNameRef.current.focus();
    //     }
    // }, [showAddForm, eduEditNo]);
    // 학력 상태 드롭다운 옵션
    const eduStatusOptions = ['재학', '졸업', '수료', '휴학', '자퇴'];

    return (
        <div className="careerInfoSection">
            <div className="careerInfoHeader">
                <p>학력</p>
                <p className="plusFunction">
                    추가 <AddIcon className="plusIcon" onClick={addEducation} />
                </p>
            </div>
            <hr />

            <div>
                {/* 여기에 입력된 값 불러오기 */}
                <p></p>
                <div className="itemActions">
                    <EditIcon className="editIcon" style={{ cursor: 'pointer', fontSize: 'large' }} />
                    <DeleteIcon className="deleteIcon" style={{ cursor: 'pointer', fontSize: 'large' }} />
                </div>
                <p className="emptyMessage">학력을 추가해 주세요</p>
            </div>

            {/* 학력 추가/수정 폼 */}
            {/* 추가를 누르면 보임 */}
            {(showAddForm || eduEditNo) && (
                <div className="educationFormBox">
                    <p className="formTitle"></p>
                    <input type="text" name="schoolName" placeholder="학교명"></input>
                    <input type="date" name="enrollDate"></input>
                    <input type="date" name="gradDate"></input>
                    <select name="eduStatus">
                        <option value="">학력상태 선택</option>
                        <option value={eduStatusOptions}></option>
                    </select>

                    <input type="text" name="major" placeholder="전공"></input>
                    <input type="text" name="subMajor" placeholder="부전공"></input>
                    <input type="text" name="gpa" placeholder="학점 (예: 3.9/4.5)"></input>
                    <textarea name="notes" placeholder="특이사항"></textarea>

                    <div className="formButtons">
                        <button onClick={cancelForm}>취소</button>
                        <button onClick={saveForm}>저장</button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default EducationSection;
