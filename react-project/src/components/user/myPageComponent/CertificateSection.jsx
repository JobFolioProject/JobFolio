import React, { useState, useRef, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import '../../../css/user/myPageComponent/CertificateSection.css'; // 자격증 섹션 전용 CSS 임포트

const CertificateSection = () => {
    // 새로운 자격증 폼
    const [showAddForm, setShowAddForm] = useState(false);
    // 수정중인 자격증 번호
    const [editCertNo, setEditCertNo] = useState(null);
    // 업데이트할 항목의 데이터를 초기화
    const [currentFormCert, setCurrentFormCert] = useState({
        certificationNo: null,
        userNo: '',
        certificateNo: '',
        certificateName: '',
        issuingOrg: '',
        acquiredDate: '',
        notes: '',
    });

    // 폼 열기
    const addCertificate = () => {
        setShowAddForm(true);
    };

    // 취소시 폼을 닫음
    const cancelForm = () => {
        const isConfirm = window.confirm('작성 중인 내용을 취소하시겠습니까?');

        if (isConfirm) {
            setShowAddForm(false);
        }
    };

    const saveForm = () => {};

    return (
        <div className="careerInfoSection">
            <div className="careerInfoHeader">
                <p>자격증</p>
                <p className="plusFunction">
                    추가 <AddIcon className="plusIcon" onClick={addCertificate} />
                </p>
            </div>
            <hr />

            {/* 자격증 목록 */}
            <div className="careerItemDisplay">
                <p></p>
                <div className="itemActions">
                    <EditIcon className="editIcon" style={{ cursor: 'pointer', fontSize: 'large' }} />
                    <DeleteIcon className="deleteIcon" style={{ cursor: 'pointer', fontSize: 'large' }} />
                </div>
            </div>

            {/* 학력 추가/수정 폼 */}
            {/* 추가를 누르면 보임 */}
            {(showAddForm || editCertNo) && (
                <div className="educationFormBox">
                    <p className="formTitle"></p>
                    <input type="text" value={currentFormCert.certificateNo} placeholder="자격증번호" />
                    <input type="text" value={currentFormCert.certificateName} placeholder="자격증이름" />
                    <input type="text" value={currentFormCert.issuingOrg} placeholder="발행처/기관" />
                    <input type="text" value={currentFormCert.acquiredDate} placeholder="취득일" />

                    <textarea name="notes" value={currentFormCert.notes} placeholder="특이사항을 입력 해주세요">
                        특이사항
                    </textarea>
                    <div className="formButtons">
                        <button onClick={cancelForm}>취소</button>
                        <button onClick={saveForm}>저장</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificateSection;
