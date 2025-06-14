import '../../../css/user/myPageComponent/EducationSection.css';
import React, { useEffect, useState, useRef, useCallback, forwardRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ValidationMessage from './ValidationMessage ';

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
  // gpa_scale: '',
  notes: '',
};

//// DatePicker의 input 필드를 커스터마이징하고 ref를 연결
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

// React.memo로 감싸서 props가 변경되지 않으면 불필요한 리렌더링 방지
const EducationSection = React.memo(({ userNo, educationList, onListChange }) => {
  const [showAddForm, setShowAddForm] = useState(false); // 추가를 눌렀을때 드롭다운으로 폼을 보여줄지 말지 결정
  const [editingEduNo, setEditingEduNo] = useState(null); // 수정중인 항목의 ID를 (eduNo)를 가저옴
  const [currentFormEdu, setCurrentFormEdu] = useState(formEduData); // 업데이트할 항목의 데이터를 초기화
  const [enrollDate, setEnrollDate] = useState(null); // DatePicker를 위한 state 추가 (Date 객체 사용)
  const [gradDate, setGradDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [errors, setErrors] = useState({
    school_name: false,
    edu_status: false,
    enroll_date: false,
    grad_date: false,
    major: false,
    sub_major: false,
    gpa: false,
    // gpa_scale: false,
  });

  useEffect(() => {
    setEnrollDate(currentFormEdu.enroll_date ? new Date(currentFormEdu.enroll_date) : null);
    setGradDate(currentFormEdu.grad_date ? new Date(currentFormEdu.grad_date) : null);
  }, [currentFormEdu]);

  // 초졸 중졸 고졸 대졸 ------------- 이후 시간이 남을 때 DB추가하고 작업해보기
  //const [topLevelEduType, setTopLevelEduType] = useState(''); // 예: '고등학교', '대학교', '대학원'

  // 추가 버튼을 클릭했을 시 이벤트 수정모드 X
  const addEducation = () => {
    // 먼저 폼 상태 내용를 초기화
    setCurrentFormEdu(formEduData);
    setShowAddForm(true);
    setEditingEduNo(null);
    setEnrollDate(null);
    setGradDate(null);
    setErrorMessage('');
    setErrors({});
  };

  // 폼(인풋)에 값 입력을 위한 폼체인지
  const formChange = (e) => {
    const { name, value } = e.target;

    // 입력을 할때 에러 상태 초기화
    setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    setErrorMessage('');

    setCurrentFormEdu((prev) => {
      let newValue = value;
      let newGradDate = prev.grad_date;
      let newGradDateState = gradDate;

      // gpa 필드 제어
      if (name === 'gpa') {
        // 숫자, 소수점 외 모든 문자 제거
        const filteredGpaValue = newValue.replace(/[^0-9.]/g, '');

        // 소수점이 두개 이상 들어오는 경우 첫번째 소수점만 남기고 제거
        const parts = filteredGpaValue.split('.');
        if (parts.length > 2) {
          newValue = parts[0] + '.' + parts.slice(1).join('');
        } else {
          newValue = filteredGpaValue;
        }
      }

      if (name === 'edu_status') {
        if (newValue === '재학' || newValue === '휴학') {
          newGradDate = '';
          newGradDateState = null;
        }
      }
      // 상태 업데이트
      const newState = {
        ...prev,
        [name]: newValue,
        grad_date: newGradDate, //  졸업일자 값을 조검에 따라 업데이트
      };
      setGradDate(newGradDateState);

      return newState;
    });
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
      // DatePicker 상태 초기화
      setEnrollDate(null);
      setGradDate(null);
      setErrors({}); // 폼 닫을 때 에러 상태 초기화
      setErrorMessage(''); // 메시지 초기화
    }
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
      // DatePicker 상태 설정
      setEnrollDate(modiftyEdu.enroll_date ? new Date(modiftyEdu.enroll_date) : null);
      setGradDate(modiftyEdu.grad_date ? new Date(modiftyEdu.grad_date) : null);
      setErrors({}); // 폼 닫을 때 에러 상태 초기화
      setErrorMessage(''); // 메시지 초기화
    }
  };

  // 삭제 아이콘 버튼 이벤트
  const deleteItemClick = async (eduNoToDelete) => {
    const isConfirm = window.confirm('정말로 이 학력을 삭제하시겠습니까? 되돌릴 수 없습니다.');

    if (isConfirm) {
      setErrorMessage('');
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
          alert('학력 삭제에 실패했습니다. 다시 시도해주세요.');
        });
    }
  };

  // 데이터 저장 및 수정 AXIOS
  const saveForm = async (currentFormEdu) => {
    // 에러 상태 초기화
    setErrorMessage(''); // 메시지 초기화

    // 메세지 재호출
    const messageToSet = '저장에 필요한 필수 정보를 입력해주세요.';

    setErrors({}); // 폼 닫을 때 에러 상태 초기화
    let hasError = false;
    let firstErrorRef = null;
    // 모든 필수 필드 유효성 검사 시작
    // 학교명 검사
    if (!currentFormEdu.school_name) {
      setErrors((prev) => ({ ...prev, school_name: true }));
      if (!firstErrorRef) firstErrorRef = schoolNameRef;
      hasError = true;
    }

    // 졸업여부 선택
    if (!currentFormEdu.edu_status) {
      setErrors((prev) => ({ ...prev, edu_status: true }));
      if (!firstErrorRef) firstErrorRef = eduStatusRef;
      hasError = true;
    }
    // 3. 입학일자 검사
    if (!currentFormEdu.enroll_date) {
      setErrors((prev) => ({ ...prev, enroll_date: true }));
      if (!firstErrorRef) firstErrorRef = enrollDateInputRef;
      hasError = true;
    }
    // 졸업일자 검사 (재학/휴학이 아닐 경우 필수) 및 날짜 관계 검사
    if (currentFormEdu.edu_status !== '재학' && currentFormEdu.edu_status !== '휴학') {
      if (!currentFormEdu.grad_date) {
        setErrors((prev) => ({ ...prev, grad_date: true }));
        if (!firstErrorRef) firstErrorRef = gradDateInputRef;
        hasError = true;
      } else {
        // 졸업일자가 입학일자보다 빠를 수 없음
        const ed = new Date(currentFormEdu.enroll_date);
        const gd = new Date(currentFormEdu.grad_date);
        if (gd < ed) {
          // alert('졸업일자는 입학일자보다 빠를 수 없습니다.');
          setErrors((prev) => ({ ...prev, grad_date: true }));
          if (!firstErrorRef) firstErrorRef = gradDateInputRef;
          hasError = true;
        }
      }
    }
    // 전공 검사
    if (!currentFormEdu.major) {
      setErrors((prev) => ({ ...prev, major: true }));
      if (!firstErrorRef) firstErrorRef = majorRef;
      hasError = true;
    }

    // 학점 검사
    if (!currentFormEdu.gpa) {
      setErrors((prev) => ({ ...prev, gpa: true }));
      if (!firstErrorRef) firstErrorRef = gpaRef;
      hasError = true;
    }

    // 기준학점 검사 <= DB를 만들어야함
    // if (!currentFormEdu.gpa_scale) {
    //   setErrors((prev) => ({ ...prev, gpa_scale: true }));
    //   if (!firstErrorRef) firstErrorRef = gpaScaleRef;
    //   hasError = true;
    // }

    // 입력에 실패했을때? 나오는 에러 문구
    if (hasError) {
      // 첫 번째 에러 필드로 포커스 이동하기
      setTimeout(() => {
        setErrorMessage(messageToSet);
        if (firstErrorRef && firstErrorRef.current) {
          firstErrorRef?.current.focus();
        }
      }, 10);
      return;
    }

    try {
      let response;

      // 수정 모드
      if (editingEduNo) {
        response = await axios.put(`/api/myPage/${userNo}/educations/${editingEduNo}`, currentFormEdu);
        alert('학력이 수정되었습니다.');

        // 수정된 항목을 목록에서 찾아서 교체 (부분 갱신)
        if (onListChange) {
          const updatedEducationList = educationList.map((edu) =>
            edu.edu_no === editingEduNo ? { ...edu, ...currentFormEdu } : edu
          );
          onListChange(updatedEducationList);
        }
      } else {
        response = await axios.post(`/api/myPage/${userNo}/educations`, currentFormEdu);
        alert('학력이 저장 되었습니다.');

        // onListChange 콜백 함수를 넣어줘야 화면에 다시 그려줌
        if (onListChange) {
          const newEdu = response.data; // 반환한 새 데이터
          console.log('데이터 (newEdu 객체 전체) : ', newEdu);

          onListChange([...educationList, newEdu]);
        }
      }

      // 저장 성공후 초기화
      setCurrentFormEdu(formEduData);
      setShowAddForm(false); // 폼닫기
      setEditingEduNo(null); // 적은 내용 초기화
      setEnrollDate(null); // DatePicker 상태 초기화
      setGradDate(null);
      setErrors({}); // 성공 시 에러 상태 초기화
    } catch (error) {
      console.log(error);
      alert('학력 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // DatePicker 날짜 변경 핸들러
  const handleDatePickerChange = useCallback(
    (dateName) => (date) => {
      // DatePicker에서 받은 Date 객체를 'YYYY-MM-DD' 형식 문자열로 변환
      const formattedDate = date
        ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
            2,
            '0'
          )}`
        : '';
      setCurrentFormEdu((prev) => ({
        ...prev,
        [dateName]: formattedDate,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [dateName]: false,
      }));
      setErrorMessage('');
      if (dateName === 'enroll_date') {
        setEnrollDate(date);
      } else if (dateName === 'grad_date') {
        setGradDate(date);
      }
    },
    []
  );

  // 입력 필드에 대한 ref (포커스 제어용)
  const schoolNameRef = useRef(null);
  const majorRef = useRef(null);
  const eduStatusRef = useRef(null);
  const gradDateInputRef = useRef(null);
  const enrollDateInputRef = useRef(null);
  const gpaRef = useRef(null); // 학점 input용
  const gpaScaleRef = useRef(null); // 기준학점 select용

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

  // '기준학점' 드롭다운 옵션
  const gpaScaleOptions = ['기준학점', '4.0', '4.5', '7.0', '100'];
  // 학점 유효성 검사
  const [gpaError, setGpaError] = useState('');

  return (
    <div className="careerInfoSection">
      <div className="careerInfoHeader">
        <p className="careerInfoTitle">학력</p>
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

                {/* 학교명 */}
                <div className="edu-display-header edu-line-item">
                  <p className="edu-school-name">{edu.school_name}</p>
                  <span className="edu-period">
                    {' '}
                    | {edu.enroll_date} ~ {displayGradDate(edu)}{' '}
                    {edu.edu_status && <span className="edu.edu-status-display">({edu.edu_status})</span>}
                  </span>
                </div>

                {/* 전공 정보 */}
                <div className="edu-line-item edu-major-line">
                  <p className="edu-major-name">{edu.major}</p>
                  {edu.sub_major && <span className="edu-sub-major">({edu.sub_major})</span>}{' '}
                  {/* 부전공이 있다면 괄호로 표시 */}
                </div>

                {/*  학점 정보 */}
                <div className="edu-details-row">
                  <div className="edu-detail-item">
                    <span className="detail-label">학점</span>
                    <span className="detail-value">{edu.gpa}</span>
                  </div>
                  {/* 지역 정보는 현재 데이터에 없으므로 포함하지 않음 */}
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
        <div className="educationFormBox education-datepicker-theme">
          <div>
            <p className="formTitle">{editingEduNo !== null ? '학력 수정' : '새 학력 추가'}</p>
          </div>
          <div className="educationContainer">
            <div className="educationInputArea">
              <div className="formCol school-name-field">
                <input
                  className={`school-name-field ${errors.school_name ? 'error-field' : ''}`}
                  type="text"
                  name="school_name"
                  placeholder="학교명"
                  value={currentFormEdu.school_name || ''}
                  ref={schoolNameRef}
                  onChange={formChange}
                  maxLength={10}
                />
              </div>

              <div className="formCol">
                <select
                  name="edu_status"
                  value={currentFormEdu.edu_status || ''}
                  onChange={formChange}
                  ref={eduStatusRef}
                  className={errors.edu_status ? 'error-field' : ''}
                >
                  <option value="">졸업여부</option>

                  {eduStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formCol">
                <DatePicker
                  selected={enrollDate}
                  onChange={handleDatePickerChange('enroll_date')} // 날짜 변경 시 currentFormEdu 업데이트
                  dateFormat="yyyy-MM-dd"
                  placeholderText="입학일자"
                  className={`custom-datepicker-input ${errors.enroll_date ? 'error-field' : ''}`} // 커스텀 스타일을 위한 클래스 추가
                  popperPlacement="bottom-start"
                  customInput={<CustomDataPickerInput ref={enrollDateInputRef} />} // ref를 customInput에 직접 전달
                />
              </div>

              <div className="formCol">
                <DatePicker
                  selected={gradDate}
                  onChange={handleDatePickerChange('grad_date')} // 날짜 변경 시 currentFormEdu 업데이트
                  dateFormat="yyyy-MM-dd"
                  placeholderText="졸업일자"
                  className={`custom-datepicker-input ${errors.grad_date ? 'error-field' : ''}`} // 커스텀 스타일을 위한 클래스 추가
                  readOnly={currentFormEdu.edu_status === '재학' || currentFormEdu.edu_status === '휴학'}
                  minDate={enrollDate}
                  popperPlacement="bottom-start"
                  customInput={<CustomDataPickerInput ref={gradDateInputRef} />} // ref를 customInput에 직접 전달
                />
              </div>

              <div className="formCol empty-dummy-space"></div>

              <div className="formCol">
                <input
                  type="text"
                  name="major"
                  placeholder="전공"
                  value={currentFormEdu.major || ''}
                  ref={majorRef}
                  onChange={formChange}
                  maxLength={8}
                  className={errors.major ? 'error-field' : ''}
                />
              </div>
              <div className="formCol">
                <input
                  type="text"
                  name="sub_major"
                  placeholder="부전공"
                  value={currentFormEdu.sub_major || ''}
                  onChange={formChange}
                  maxLength={8}
                />
              </div>

              <div className="formCol">
                <input
                  className={`gpa-field ${errors.gpa ? 'error-field' : ''}`}
                  type="text"
                  name="gpa"
                  placeholder="학점"
                  value={currentFormEdu.gpa || ''}
                  onChange={formChange}
                  maxLength={7}
                  ref={gpaRef}
                />
              </div>
              <div className="formCol">
                {/* <select
                  id="gpa_scale"
                  name="gpa_scale"
                  value={currentFormEdu.gpa_scale || ''}
                  onChange={formChange}
                  className={errors.gpa_scale ? 'error-field' : ''}
                > */}
                {/* 옵션들은 아래에서 정의할 gpaScaleOptions 배열을 사용 */}
                {/* {gpaScaleOptions.map((option) => (
                    <option key={option} value={option === '기준학점' ? '' : option}>
                      {option}
                    </option>
                  ))}
                </select> */}
              </div>

              <div className="formColFull">
                <textarea
                  name="notes"
                  placeholder="특이사항"
                  value={currentFormEdu.notes || ''}
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
            <button onClick={() => saveForm(currentFormEdu)}>저장</button>
          </div>
        </div>
      )}
    </div>
  );
});

export default EducationSection;
