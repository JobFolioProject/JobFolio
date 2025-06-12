import '../../../css/user/myPageComponent/EducationSection.css';
import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const EducationSection = () => {
    // 추가를 눌렀을때 드롭다운으로 폼을 보여줄지 말지 결정
    const [showAddForm, setShowAddForm] = useState(false);

    // 수정중인 항목의 ID를 (eduNo)를 가저옴
    const [eduEditNo, setEduEditNo] = useState(null);

    // 업데이트할 항목의 데이터를 초기화
    const [eduCurrent, setEduCurrent] = useState({
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

    // 학력 상태 드롭다운 옵션
    const eduStatusOptions = ['재학', '졸업', '수료', '휴학', '자퇴'];

    // 추가 버튼을 클릭했을 시 이벤트
    const addEducation = () => {
        // 먼저 폼 상태 내용를 초기화
        setEduCurrent({
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
        setShowAddForm();
        setEduEditNo();
    };

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
                <p>학교이름 - 학년, 상태 등등</p>
                <div className="itemActions">
                    <EditIcon className="editIcon" style={{ cursor: 'pointer', fontSize: 'large' }} />
                    <DeleteIcon className="deleteIcon" style={{ cursor: 'pointer', fontSize: 'large' }} />
                </div>
                <p className="emptyMessage">학력을 추가해 주세요</p>
            </div>

            {/* 학력 추가/수정 폼 */}
            {/* 추가를 누르면 보임 */}
            {showAddForm && (
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
                        <button>취소</button>
                        <button>저장</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducationSection;
