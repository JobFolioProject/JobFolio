import '../../../css/user/myPageComponent/CertificateSection.css'; // 자격증 섹션 전용 CSS 임포트
import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../../../utils/axiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ValidationMessage from './ValidationMessage';

// 입력 받을 폼 데이터
const formCertData = {
  certification_no: null, // 자격번호
  user_no: null, // 유저번호
  certificate_no: '', // 자격증 일련번호
  certificate_name: '', // 자격증 이름
  issuing_org: '', // 발행처
  acquired_date: '', // 취득일
  notes: '', // 특이사항
};

// DatePicker의 input 필드를 커스터마이징하고 ref를 연결
const CustomDataPickerInput = forwardRef(
  ({ value, onClick, placeholder, className, readOnly, disabled, onChange }, ref) => (
    <input
      type="text"
      className={className}
      onClick={onClick}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      ref={ref}
      onChange={onChange}
    ></input>
  )
);

const CertificateSection = React.memo(({ userNo, certificateList, onListChange }) => {
  const [showAddForm, setShowAddForm] = useState(false); // 새로운 자격증 폼
  const [editingCertNo, setEditingCertNo] = useState(null); // 수정중인 자격증 번호
  const [currentFormCert, setCurrentFormCert] = useState(formCertData); // 업데이트할 항목의 데이터를 초기화
  const [errorMessage, setErrorMessage] = useState(''); // 에러메세지
  const [acquiredDate, setAcquiredDate] = useState(null); // DatePicker를 위한 state 추가 (Date 객체 사용)
  // 에러 초기화
  const [errors, setErrors] = useState({
    certificate_no: false,
    certificate_name: false,
    issuing_org: false,
    acquired_date: false,
  });

  // 자격증 최대 개수 설정
  const MAX_CERTIFICATION_COUNT = 5;
  // 추가 버튼 활성화 여부
  const isAddButtonDisabled = certificateList.length >= MAX_CERTIFICATION_COUNT;

  // DatePicker 라이브러리는 date 객체를 prpo의 값으로 기대하기 때문에 우리는 문자열 날짜를 Date개체로 변환해 표시해야함.
  useEffect(() => {
    setAcquiredDate(currentFormCert.acquired_date ? new Date(currentFormCert.acquired_date) : null);
  }, [currentFormCert]);

  // 폼 열기
  const addCertification = () => {
    if (certificateList.length >= MAX_CERTIFICATION_COUNT) {
      alert(`자격증은 최대 ${MAX_CERTIFICATION_COUNT}개까지만 추가할 수 있습니다.`);
      return;
    }
    setCurrentFormCert(formCertData);
    setShowAddForm(true);
    setEditingCertNo(null);
    setErrorMessage('');
    setAcquiredDate(null);
    setErrors({});
  };

  // 폼에 값 입력을 위한 폼 체인지 - 입력에 대한 이벤트
  const formChange = (e) => {
    const { name, value } = e.target;

    // 에러
    setErrors((pervErrors) => ({ ...pervErrors, [name]: false }));
    setErrorMessage('');

    setCurrentFormCert((prev) => {
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
      setCurrentFormCert(formCertData);
      setShowAddForm(false);
      setEditingCertNo(null);
      setErrorMessage('');
      setErrors({});
    }
  };

  // 수정 아이콘 버튼 이벤트
  const modifiedItemClick = async (certNoToEdit) => {
    // 수정할 cert_no를 가져와 폼을 열기\
    const modifyCert = certificateList.find((cert) => cert.certification_no === certNoToEdit);
    if (modifyCert) {
      setCurrentFormCert(modifyCert);
      setEditingCertNo(certNoToEdit);
      setShowAddForm(true);
      setErrorMessage('');
      setErrors({});
    }
  };

  // 삭제 아이콘 버튼 이벤트
  const deleteItemClick = async (certNoToDelete) => {
    const isConfirm = window.confirm('정말로 이 자격 정보를 삭제하시겠습니까? 되돌릴 수 없습니다.');

    if (isConfirm) {
      setErrorMessage('');
      await axios
        .delete(`/api/myPage/${userNo}/certificates/${certNoToDelete}`)
        .then((res) => {
          console.log(res.data);
          alert('자격증이 삭제되었습니다.');

          // onListChange 콜백 함수 - 수정, 삭제, 저장 했을 때 그 리스트만 그려주는거
          if (onListChange) {
            const updatedCertificationList = certificateList.filter((cert) => cert.certification_no !== certNoToDelete);
            onListChange(updatedCertificationList);
          }
        })
        .catch((error) => {
          console.log(error);
          alert('자격증 삭제에 실패했습니다. 다시 시도해주세요.');
        });
    }
  };

  // 데이터 저장 및 수정
  const saveAndUpdateForm = async (currentFormCert) => {
    // 에러 상태 초기화
    setErrorMessage('');

    // 저장버튼 막 눌렀을때 메세지 계속 나오게 하려면 필요.
    const messageToSet = '저장에 필요한 필수 정보를 입력해주세요.';

    setErrors({});
    let hasError = false;
    let firstErrorRef = null;

    // 모든 필드 검사
    if (!currentFormCert.certificate_name) {
      setErrors((prev) => ({ ...prev, certificate_name: true }));
      if (!firstErrorRef) firstErrorRef = certificateNameRef;
      hasError = true;
    }
    if (!currentFormCert.certificate_no) {
      setErrors((prev) => ({ ...prev, certificate_no: true }));
      if (!firstErrorRef) firstErrorRef = certificateNoRef;
      hasError = true;
    }
    if (!currentFormCert.issuing_org) {
      setErrors((prev) => ({ ...prev, issuing_org: true }));
      if (!firstErrorRef) firstErrorRef = issuingOrgRef;
      hasError = true;
    }
    if (!currentFormCert.acquired_date) {
      setErrors((prev) => ({ ...prev, acquired_date: true }));
      if (!firstErrorRef) firstErrorRef = acquiredDateRef;
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
      if (editingCertNo) {
        response = await axios.put(`/api/myPage/${userNo}/certificates/${editingCertNo}`, currentFormCert);
        alert('자격증이 수정 되었습니다.');

        if (onListChange) {
          const updatedCertificationList = certificateList.map((cert) =>
            cert.certification_no === editingCertNo ? { ...cert, ...currentFormCert } : cert
          );
          onListChange(updatedCertificationList);
        }
      } else {
        // 한번 더 방어
        if (certificateList.length >= MAX_CERTIFICATION_COUNT) {
          alert(`자격증은 최대 ${MAX_CERTIFICATION_COUNT}개까지만 추가할 수 있습니다.`);
          // 폼 닫기 및 상태 초기화
          setCurrentFormCert(formCertData);
          setShowAddForm(false);
          setEditingCertNo(null);
          setErrors({});
          return; // 저장 로직 중단
        }

        // 저장
        response = await axios.post(`/api/myPage/${userNo}/certificates`, currentFormCert);
        alert('자격증이 저장 되었습니다.');

        if (onListChange) {
          const newCert = response.data;
          console.log('데이터 newCert : ', newCert);

          onListChange([...certificateList, newCert]);
        }
      }

      // 저장 수정 후 초기화
      setCurrentFormCert(formCertData);
      setShowAddForm(false);
      setEditingCertNo(null);
      setErrorMessage('');
      setErrors({});
    } catch (error) {
      console.log(error);
      alert('자격증 저장에 실패했습니다. 다시 시도해주세요');
    }
  };
  // DatePicker 날짜 변경 핸들러
  const handleDatePickerChange = useCallback((date) => {
    // DatePicker에서 받은 Date 객체를 'YYYY-MM-DD' 형식 문자열로 변환
    const formattedDate = date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
          2,
          '0'
        )}`
      : '';
    setCurrentFormCert((prev) => ({
      ...prev,
      acquired_date: formattedDate,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      acquired_date: false,
    }));
    setErrorMessage('');
    setAcquiredDate(date); // DatePicker 내부 상태 업데이트
  }, []);

  // 입력 필드에 대한 ref (포커스용)
  const certificateNoRef = useRef(null); // 자격증 일련번호
  const certificateNameRef = useRef(null); // 자격증 이름
  const issuingOrgRef = useRef(null); // 발행처
  const acquiredDateRef = useRef(null); // 취득일

  // 첫번째 필드 포커스
  useEffect(() => {
    // 숏폼, 자격증 번호가 null이 아니거나 그리고 현재 자격증 이름에 입력된게 있을때 자격증이름에 포커스
    if ((showAddForm || editingCertNo !== null) && certificateNameRef.current) {
      certificateNameRef.current.focus();
    }
  }, [showAddForm, editingCertNo]);

  return (
    <div className="careerInfoSection">
      <div className="careerInfoHeader">
        <p className="careerInfoTitle">자격증</p>
        <p className={`plusFunction ${isAddButtonDisabled ? 'disable-button' : ''}`} onClick={addCertification}>
          추가 <AddIcon className="plusIcon" />
        </p>
      </div>

      {!showAddForm && editingCertNo === null ? ( // 폼이 열려있지 않을 때 (추가/수정 모드가 아닐 때)
        certificateList && certificateList.length > 0 ? (
          // 기존 자격 목록이 있으면 맵핑하여 표시
          certificateList.map((cert) => {
            return (
              // 키 값을 자격번호로.
              <div key={cert.certification_no} className="careerItemDisplay">
                {/* 여기에 입력된 값 불러오기 */}

                {/* 자격증 */}
                <div className="cert-display-header cert-line-item">
                  <p className="cert-name">{cert.certificate_name}</p>
                  {cert.issuing_org && <span className="cert-org">({cert.issuing_org})</span>}
                </div>

                {/* 취득일, 일련번호 */}
                <div className="cert-details-row">
                  <div className="cert-detail-item">
                    <span className="detail-label">취득일</span>
                    <span className="detail-value">{cert.acquired_date}</span>
                  </div>
                  <div className="cert-detail-item">
                    <span className="detail-label">일련번호</span>
                    <span className="detail-value">{cert.certificate_no}</span>
                  </div>
                </div>

                <div className="itemActions">
                  <EditIcon
                    className="editIcon"
                    style={{ cursor: 'pointer', fontSize: 'large' }}
                    onClick={() => modifiedItemClick(cert.certification_no)}
                  />

                  <DeleteIcon
                    className="deleteIcon"
                    style={{ cursor: 'pointer', fontSize: 'large' }}
                    onClick={() => deleteItemClick(cert.certification_no)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="emptyMessage">자격증을 추가해 주세요</p>
        )
      ) : null}

      {/* 자격증 추가/수정 폼 */}
      {(showAddForm || editingCertNo !== null) && (
        <div className="certificationFormBox certification-datepicker-theme">
          <div>
            <p className="formTitle">{editingCertNo !== null ? '자격증 수정' : '새 자격증 추가'}</p>
          </div>
          <div className="certificationContainer">
            <div className="certificationInputArea">
              {/* 자격증 이름 */}
              <div className="formCol certificate-name">
                <input
                  type="text"
                  name="certificate_name"
                  placeholder="자격증 이름"
                  value={currentFormCert.certificate_name || ''}
                  onChange={formChange}
                  maxLength={50} //
                  className={errors.certificate_name ? 'error-field' : ''}
                  ref={certificateNameRef} // 첫 번째 포커스 대상
                />
              </div>
              {/* 자격증 일련번호 */}
              <div className="formCol">
                <input
                  type="text"
                  name="certificate_no"
                  placeholder="자격증 일련번호"
                  value={currentFormCert.certificate_no || ''}
                  onChange={formChange}
                  maxLength={50}
                  className={errors.certificate_no ? 'error-field' : ''}
                  ref={certificateNoRef}
                />
              </div>
              {/* 발행처 */}
              <div className="formCol">
                <input
                  type="text"
                  name="issuing_org"
                  placeholder="발행처"
                  value={currentFormCert.issuing_org || ''}
                  onChange={formChange}
                  maxLength={50}
                  className={errors.issuing_org ? 'error-field' : ''}
                  ref={issuingOrgRef}
                />
              </div>
              {/* 취득일 */}
              <div className="formCol">
                <DatePicker
                  selected={acquiredDate}
                  onChange={handleDatePickerChange}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="취득일"
                  className={`custom-datepicker-input ${errors.acquired_date ? 'error-field' : ''}`}
                  popperPlacement="bottom-start"
                  customInput={<CustomDataPickerInput ref={acquiredDateRef} />}
                />
              </div>
              <div className="formCol empty-dummy-space"></div> {/* 레이아웃 맞춤용 */}
              {/* 특이사항 */}
              <div className="formColFull">
                <textarea
                  name="notes"
                  placeholder="특이사항 (선택 사항)"
                  value={currentFormCert.notes || ''}
                  onChange={formChange}
                  maxLength={2000}
                ></textarea>
              </div>
            </div>
          </div>

          {/* 유효성 검사 메세지 컴포넌트 */}
          {errorMessage && <ValidationMessage message={errorMessage} />}

          <div className="formButtons">
            <button onClick={cancelForm}>취소</button>
            <button onClick={() => saveAndUpdateForm(currentFormCert)}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default CertificateSection;
