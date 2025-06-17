import '../../../css/user/myPageComponent/CareerHistorySection.css'; // 경력 섹션 전용 CSS 임포트
import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import DatePicker from 'react-datepicker'; // 날짜 선택을 위해 DatePicker 사용
import 'react-datepicker/dist/react-datepicker.css';
import ValidationMessage from './ValidationMessage';

// 입력 받을 폼 데이터
const formCareerData = {
    career_no: null, // 경력 번호
    user_no: null, // 유저 번호
    company_name: '', // 회사이름
    start_date: '', // 시작날짜 (YYYY-MM-DD)
    end_date: '', // 종료날짜 (YYYY-MM-DD)
    position: '', // 포지션
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

// DatePicker의 input 필드를 커스터마이징하고 ref를 연결
const CareerHistorySection = React.memo(({ userNo, careerHistoryList, onListChange }) => {
    const [showAddForm, setShowAddForm] = useState(false); // 새로운 경력 폼의 가시성 제어
    const [editingCareerNo, setEditingCareerNo] = useState(null); // 수정중인 경력 번호
    const [currentFormCareer, setCurrentFormCareer] = useState(formCareerData); // 폼의 현재 데이터
    const [errorMessage, setErrorMessage] = useState(''); // 유효성 검사 에러 메시지

    // 재직중 상태
    const [isCurrentJob, setIsCurrentJob] = useState(false);

    // DatePicker를 위한 Date 객체 상태
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 입력 필드별 에러 상태
    const [errors, setErrors] = useState({
        company_name: false,
        start_date: false,
        end_date: false,
        position: false,
    });

    // 경력 최대 개수 설정
    const MAX_CAREER_COUNT = 5;
    // 추가 버튼 활성화 여부
    const isAddButtonDisabled = careerHistoryList.length >= MAX_CAREER_COUNT;

    // DatePicker 날짜 상태 동기화
    useEffect(() => {
        setStartDate(currentFormCareer.start_date ? new Date(currentFormCareer.start_date) : null);

        // 재직중인 경우 isCurrentJob을 true로 설정하고 endDate는 null
        const isCurrentlyWorking = currentFormCareer.end_date === '재직중';
        setEndDate(
            isCurrentlyWorking ? new Date() : currentFormCareer.end_date ? new Date(currentFormCareer.end_date) : null
        );
        setIsCurrentJob(isCurrentlyWorking);
    }, [currentFormCareer]);

    // "추가" 버튼 클릭 핸들러
    const addCareer = () => {
        if (isAddButtonDisabled) {
            alert(`경력은 최대 ${MAX_CAREER_COUNT}개까지만 추가할 수 있습니다.`);
            setShowAddForm(false); // 폼이 열려있었다면 닫히도록
            setEditingCareerNo(null);
            return;
        }
        setCurrentFormCareer(formCareerData); // 폼 데이터 초기화
        setShowAddForm(true); // 폼을 보이도록 설정
        setEditingCareerNo(null); // 수정 모드 해제
        setErrorMessage('');
        setErrors({}); // 에러 상태 초기화
        setStartDate(null); // DatePicker 초기화
        setEndDate(null); // DatePicker 초기화
        console.log('careerHistoryList', careerHistoryList);
    };

    // 폼 입력 값 변경 핸들러
    const formChange = (e) => {
        const { name, value } = e.target;

        setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
        setErrorMessage('');

        setCurrentFormCareer((prev) => {
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

    // 수정 아이콘 버튼 클릭 핸들러
    const modifiedItemClick = (careerNoToEdit) => {
        const modifyCareer = careerHistoryList.find((career) => career.career_no === careerNoToEdit);
        if (modifyCareer) {
            setCurrentFormCareer(modifyCareer);
            setEditingCareerNo(careerNoToEdit); // 수정 중인 경력 번호 저장
            setShowAddForm(true); // 폼 열기
            setErrorMessage('');
            setErrors({});

            // 재직중이면 체크박스 상태 설정해야함.
            const isCurrentlyWorking = modifyCareer.end_date === '재직중';
            setStartDate(modifyCareer.start_date ? new Date(modifyCareer.start_date) : null);
            setEndDate(
                isCurrentlyWorking ? new Date() : modifyCareer.end_date ? new Date(modifyCareer.end_date) : null
            );
            setIsCurrentJob(isCurrentlyWorking);
        }
    };
    // 삭제 아이콘 버튼 클릭 핸들러
    const deleteItemClick = async (careerNoToDelete) => {
        const isConfirm = window.confirm('정말로 이 경력을 삭제하시겠습니까? 되돌릴 수 없습니다.');

        if (isConfirm) {
            setErrorMessage('');
            try {
                await axios.delete(`/api/myPage/${userNo}/careerhistories/${careerNoToDelete}`); // URL 변경
                alert('경력이 삭제되었습니다.');

                if (onListChange) {
                    const updatedCareerHistoryList = careerHistoryList.filter(
                        (career) => career.career_no !== careerNoToDelete
                    );
                    onListChange(updatedCareerHistoryList);
                }
            } catch (error) {
                console.error('경력 삭제 실패:', error);
                alert('경력 삭제에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    // 폼 취소 버튼 핸들러
    const cancelForm = () => {
        const isConfirm = window.confirm('작성 중인 내용을 취소하시겠습니까?');
        if (isConfirm) {
            setCurrentFormCareer(formCareerData);
            setShowAddForm(false);
            setEditingCareerNo(null);
            setErrorMessage('');
            setErrors({});
            setStartDate(null);
            setEndDate(null);
            setIsCurrentJob(false); // 폼 취소시에도 상태 초기화(체크해제)
        }
    };

    // 데이터 저장 및 수정
    const saveAndUpdateForm = async () => {
        setErrorMessage('');
        const messageToSet = '저장에 필요한 필수 정보를 입력해주세요.';

        setErrors({});
        let hasError = false;
        let firstErrorRef = null;

        // 모든 필수 필드 유효성 검사
        if (!currentFormCareer.company_name) {
            setErrors((prev) => ({ ...prev, company_name: true }));
            if (!firstErrorRef) firstErrorRef = companyNameRef;
            hasError = true;
        }
        if (!currentFormCareer.start_date) {
            setErrors((prev) => ({ ...prev, start_date: true }));
            if (!firstErrorRef) firstErrorRef = startDateRef;
            hasError = true;
        }
        if (!isCurrentJob && !currentFormCareer.end_date) {
            // 종료일은 필수로 하되, 시작일보다 빠를 수 없음
            setErrors((prev) => ({ ...prev, end_date: true }));
            if (!firstErrorRef) firstErrorRef = endDateRef;
            hasError = true;
        } else if (!isCurrentJob) {
            const sd = new Date(currentFormCareer.start_date);
            const ed = new Date(currentFormCareer.end_date);
            if (ed < sd) {
                setErrors((prev) => ({ ...prev, end_date: true }));
                if (!firstErrorRef) firstErrorRef = endDateRef;
                hasError = true;
                setErrorMessage('종료일은 시작일보다 빠를 수 없습니다.'); // 구체적인 메시지
            }
        }
        if (!currentFormCareer.position) {
            setErrors((prev) => ({ ...prev, position: true }));
            if (!firstErrorRef) firstErrorRef = positionRef;
            hasError = true;
        }

        if (hasError) {
            setTimeout(() => {
                // 종료일 에러 메시지가 있다면 그걸 우선하고, 아니면 일반 메시지
                const finalMessage = errorMessage || messageToSet;
                setErrorMessage(finalMessage);

                if (firstErrorRef && firstErrorRef.current) {
                    firstErrorRef.current.focus();
                    firstErrorRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest',
                    });
                }
            }, 10);
            return;
        }

        const finalDateToSend = {
            ...currentFormCareer,
            user_no: userNo,
            end_date: isCurrentJob ? '재직중' : currentFormCareer.end_date, // 재직중이면 재직중 문자열
        };

        // 수정 시작
        try {
            let response;

            if (editingCareerNo) {
                response = await axios.put(`/api/myPage/${userNo}/careerhistories/${editingCareerNo}`, finalDateToSend); // URL 변경
                alert('경력이 수정되었습니다.');

                if (onListChange) {
                    const updatedCareerHistoryList = careerHistoryList.map((career) =>
                        career.career_no === editingCareerNo ? { ...career, ...finalDateToSend } : career
                    );
                    onListChange(updatedCareerHistoryList);
                }
            } else {
                // 저장 시작
                if (careerHistoryList.length >= MAX_CAREER_COUNT) {
                    alert(`경력은 최대 ${MAX_CAREER_COUNT}개까지만 추가할 수 있습니다.`);
                    setCurrentFormCareer(formCareerData);
                    setShowAddForm(false);
                    setEditingCareerNo(null);
                    setErrors({});
                    setStartDate(null);
                    setEndDate(null);
                    return;
                }

                response = await axios.post(`/api/myPage/${userNo}/careerhistories`, finalDateToSend); // URL 변경
                alert('경력이 저장되었습니다.');

                if (onListChange) {
                    const newCareer = response.data; // 백엔드에서 반환한 새 데이터 (ex. career_no 포함)
                    console.log('새 경력 데이터:', newCareer);
                    onListChange([...careerHistoryList, newCareer]);
                }
            }

            // 저장/수정 성공 후 폼 초기화 및 닫기
            setCurrentFormCareer(formCareerData);
            setShowAddForm(false);
            setEditingCareerNo(null);
            setErrorMessage('');
            setErrors({});
            setStartDate(null);
            setEndDate(null);
            setIsCurrentJob(false);
        } catch (error) {
            console.error('경력 저장/수정 실패:', error);
            alert('경력 저장/수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // DatePicker 날짜 변경 핸들러
    const handleDatePickerChange = useCallback(
        (dateName) => (date) => {
            const formattedDate = date
                ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
                      date.getDate()
                  ).padStart(2, '0')}`
                : '';
            setCurrentFormCareer((prev) => ({
                ...prev,
                [dateName]: formattedDate,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [dateName]: false,
            }));
            setErrorMessage('');
            if (dateName === 'start_date') {
                setStartDate(date);
            } else if (dateName === 'end_date') {
                setEndDate(date);
            }
        },
        []
    );

    // 입력 필드에 대한 ref (포커스용)
    const companyNameRef = useRef(null);
    const startDateRef = useRef(null); // DatePicker
    const endDateRef = useRef(null); // DatePicker
    const positionRef = useRef(null);

    // 첫 번째 필드 포커스
    useEffect(() => {
        if ((showAddForm || editingCareerNo !== null) && companyNameRef.current) {
            companyNameRef.current.focus();
        }
    }, [showAddForm, editingCareerNo]);

    // UI에 표시할 종료 날짜 (재직중인 경우 "재직중" 표시)
    const displayEndDate = (career) => {
        if (career.end_date === '재직중') {
            // '재직중'이라는 문자열을 저장한다면
            return '재직중';
        }
        return career.end_date ? career.end_date : '';
    };

    // 재직중 체크박스 상태 관리
    const handleCurrentJobChange = (e) => {
        const isChecked = e.target.checked;
        setIsCurrentJob(isChecked);
        if (isChecked) {
            setCurrentFormCareer((prev) => ({ ...prev, end_date: '재직중' }));
            setEndDate(new Date()); // DatePicker 종료일 초기화
        } else {
            setCurrentFormCareer((prev) => ({ ...prev, end_date: '' }));
            // 체크 해제 시에도 초기화 (사용자가 직접 선택하도록)
            setEndDate(null); // 체크 해제 시 DatePicker 초기화
        }
        setErrors((prevErrors) => ({ ...prevErrors, end_date: false }));
        setErrorMessage('');
    };

    return (
        <div className="careerInfoSection">
            <div className="careerInfoHeader">
                <p className="careerInfoTitle">경력</p>
                <p className={`plusFunction ${isAddButtonDisabled ? 'disabled-button' : ''}`} onClick={addCareer}>
                    추가 <AddIcon className="plusIcon" />
                </p>
            </div>

            {isAddButtonDisabled && !showAddForm && (
                <p className="limit-message">경력은 최대 {MAX_CAREER_COUNT}개까지만 추가할 수 있습니다.</p>
            )}

            {/* 경력 목록 표시 */}
            {!showAddForm && editingCareerNo === null ? (
                careerHistoryList && careerHistoryList.length > 0 ? (
                    careerHistoryList.map((career) => {
                        return (
                            <div key={career.career_no} className="careerItemDisplay">
                                {/* 회사이름, 기간, 포지션 */}
                                <div className="career-display-header career-line-item">
                                    <p className="career-company-name">{career.company_name}</p>
                                    <span className="career-period">
                                        | {career.start_date} ~ {displayEndDate(career)}
                                    </span>
                                </div>

                                <div className="career-details-row">
                                    <div className="career-detail-item">
                                        <span className="detail-value">{career.position}</span>
                                    </div>
                                </div>

                                {career.notes && (
                                    <div className="career-notes-row">
                                        <span className="detail-value">{career.notes}</span>
                                    </div>
                                )}

                                <div className="itemActions">
                                    <EditIcon
                                        className="editIcon"
                                        style={{ cursor: 'pointer', fontSize: 'large' }}
                                        onClick={() => modifiedItemClick(career.career_no)}
                                    />
                                    <DeleteIcon
                                        className="deleteIcon"
                                        style={{ cursor: 'pointer', fontSize: 'large' }}
                                        onClick={() => deleteItemClick(career.career_no)}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="emptyMessage">경력을 추가해 주세요</p>
                )
            ) : null}

            {/* 경력 추가/수정 폼 */}
            {(showAddForm || editingCareerNo !== null) && (
                <div className="careerFormBox career-datepicker-theme">
                    <div>
                        <p className="formTitle">{editingCareerNo !== null ? '경력 수정' : '새 경력 추가'}</p>
                    </div>
                    <div className="careerContainer">
                        <div className="careerInputArea">
                            {/* 회사이름 */}
                            <div className="formCol company-name-field">
                                <input
                                    type="text"
                                    name="company_name"
                                    placeholder="회사명"
                                    value={currentFormCareer.company_name || ''}
                                    onChange={formChange}
                                    maxLength={50}
                                    className={errors.company_name ? 'error-field' : ''}
                                    ref={companyNameRef}
                                />
                            </div>

                            {/* 시작일자 */}
                            <div className="formCol">
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleDatePickerChange('start_date')}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="입사일"
                                    className={`custom-datepicker-input ${errors.start_date ? 'error-field' : ''}`}
                                    popperPlacement="bottom-start"
                                    customInput={<CustomDataPickerInput ref={startDateRef} />}
                                    maxDate={new Date()}
                                />
                            </div>

                            {/* 종료일자 */}
                            <div className="formCol">
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleDatePickerChange('end_date')}
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="퇴사일"
                                    className={`custom-datepicker-input ${errors.end_date ? 'error-field' : ''}`}
                                    popperPlacement="bottom-start"
                                    customInput={<CustomDataPickerInput ref={endDateRef} />}
                                    readOnly={isCurrentJob} // '재직중'이면 readOnly
                                    minDate={startDate} // 시작일자보다 빠를 수 없음
                                />
                            </div>

                            {/* 재직중 체크박스 */}
                            <div className="formCol current-job-checkbox-group">
                                <input
                                    type="checkbox"
                                    id="currentJob"
                                    checked={currentFormCareer.end_date === '재직중'}
                                    onChange={handleCurrentJobChange}
                                />
                                <label htmlFor="currentJob">재직중</label>
                            </div>

                            {/* 포지션 */}
                            <div className="formCol position-field">
                                <input
                                    type="text"
                                    name="position"
                                    placeholder="직무 (예: 백엔드 개발자)"
                                    value={currentFormCareer.position || ''}
                                    onChange={formChange}
                                    maxLength={50}
                                    className={errors.position ? 'error-field' : ''}
                                    ref={positionRef}
                                />
                            </div>

                            {/* 활동설명 */}
                            <div className="formColFull">
                                <textarea
                                    name="notes"
                                    placeholder="활동 설명을 입력해주세요. 
                  - 경력사항 별로 중요한 내용만 엄선해서 작성하는 것이 중요합니다.
                  - 담당한 업무 내용을 요약해서 작성해 보세요
                  - 프로젝트 내용을 적을 경우. 역할/팀구성/기여도/성과를 기준으로 요약해서 작성해보세요"
                                    value={currentFormCareer.notes || ''}
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
                        <button onClick={saveAndUpdateForm}>저장</button>
                    </div>
                </div>
            )}
        </div>
    );
});

export default CareerHistorySection;
