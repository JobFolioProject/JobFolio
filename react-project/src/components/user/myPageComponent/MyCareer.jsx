import '../../../css/user/myPageComponent/UserInfo.css';
import '../../../css/user/myPageComponent/MyCareer.css';
import EducationSection from './EducationSection';
import CertificateSection from './CertificateSection';
import LanguageSection from './LanguageSection';
import CareerHistorySection from './CareerHistorySection';
import SkillSection from './SkillSection';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';

// MyCareer 초기 객체 설정
const careerDataState = {
    user_no: null, // DTO 필드명과 일치 (user_no)
    hobby: '',
    notes: '',
    educationList: [],
    languageSkillList: [],
    skillList: [],
    certificateList: [],
    careerHistoryList: [],
};

const MyCareer = () => {
    // 백엔드에서 불러온 모든 커리어 데이터를 저장하는 상태 (CareerDto)
    const [careerData, setCareerData] = useState(careerDataState);
    // 로딩상태
    const [loading, setLoading] = useState(true);
    // 에러상태
    const [error, setError] = useState(null);

    // userNo를 sessionStorage에서 가져와 상태로 관리
    // TODO: [임시 테스트용] 실제 userNo는 sessionStorage에서 불러오도록 변경해야 함
    const [userNo, setUserNo] = useState(null); // <---- null로

    // 컴포넌트 마운트 시 sessionStorage에서 userNo를 읽어오는 useEffect
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser); // JSON으로 넘어오니 파싱해주기
            if (userData && typeof userData.userNo === 'number') {
                setUserNo(userData.userNo); // userNo 속성만 추출
                console.log('sessionStorage에서 불러온 userNo:', userData);
            } else {
                console.log('userNo가 없습니다', storedUser);
            }
        } else {
            console.error('회원 정보가 없습니다. 로그인 상태를 확인하세요.');
            setError('로그인이 필요합니다.'); // 에러 메시지 설정
            setLoading(false); // 로딩 중단
            // userNo가 없는 경우 API 호출을 시도하지 않고, 적절한 처리 (예: 로그인 페이지로 리다이렉트)를 진행
        }
    }, []);

    //userNo가 null이 아닐 때만 API 호출을 시도하도록
    // 데이터를 백엔드에서 다시 불러오는 함수 (useCallback으로 메모이제이션)
    // 데이터 요청청
    const fetchCareerData = useCallback(async () => {
        try {
            setLoading(true);

            if (userNo !== null) {
                const response = await axios.get(`/api/myPage/${userNo}/career`);
                const responseData = response.data;

                // 각 리스트에 null 이나 undifined가 있으면 걸러냄
                const cleanedCareerData = {
                    ...responseData,
                    educationList: responseData.educationList?.filter(Boolean) || [],
                    languageSkillList: responseData.languageSkillList?.filter(Boolean) || [],
                    skillList: responseData.skillList?.filter(Boolean) || [],
                    certificateList: responseData.certificateList?.filter(Boolean) || [],
                    careerHistoryList: responseData.careerHistoryList?.filter(Boolean) || [],
                };

                setCareerData(cleanedCareerData); // 걸러낸 데이터 상태에 설정
                console.log('초기 데이터 확인', cleanedCareerData);
            }
        } catch (error) {
            console.log(error);
            setError('데이터 로딩 실패');

            // 초기값으로 되돌리기
            setCareerData(careerDataState);
        } finally {
            setLoading(false);
        }
    }, [userNo]);

    // 데이터 호출
    useEffect(() => {
        if (userNo !== null) {
            fetchCareerData();
        }
    }, [userNo, fetchCareerData]);

    //각 섹션 컴포넌트로부터 리스트 변경을 전달받을 콜백 함수들
    const handleEducationListChange = useCallback((updatedList) => {
        setCareerData((prev) => ({
            ...prev,
            educationList: updatedList,
        }));
    }, []);

    const handleCertificateListChange = useCallback((updatedList) => {
        setCareerData((prev) => ({
            ...prev,
            certificateList: updatedList, // 자격증 리스트만 새로운 리스트로 교체
        }));
    }, []);

    const handleLanguageListChange = useCallback((updatedList) => {
        setCareerData((prev) => ({
            ...prev,
            languageSkillList: updatedList, // 언어어 리스트만 새로운 리스트로 교체
        }));
    }, []);

    const handleCareerHistoryListChange = useCallback((updatedList) => {
        setCareerData((prev) => ({
            ...prev,
            careerHistoryList: updatedList, // 경력 리스트만 새로운 리스트로 교체
        }));
    }, []);

    const handleSkillListChange = useCallback((updatedList) => {
        setCareerData((prev) => ({
            ...prev,
            skillList: updatedList, // 기술 리스트만 새로운 리스트로 교체
        }));
    }, []);

    if (loading || userNo === null) {
        return (
            <div className="userInfoWrap">
                <p>커리어 데이터를 불러오는 중...</p>
            </div>
        );
    }
    // 에러 발생 시
    if (error) {
        return (
            <div className="userInfoWrap">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (careerData === null) {
        return (
            <div className="userInfoWrap">
                <p>데이터가 준비되지 않았습니다.</p>
            </div>
        );
    }

    /*
   * 정리 
    학력: 학력 구분(사람인) 각각 폼 입력 받는거 다르게 또는 기준학점(4.0, 4.5, 7, 100) 테이블 또는 컬럼 생각해보기
    자격증: 한국산업인력공단 API 자격목록 가져와서 팝업창으로 검색해서 바로 넣을 수 있게.
    언어: 같은 언어, 유저면 바인딩 에러 select로 하드코딩하거나. 언어 목록들 공통코드로 관리? 현재는 입력 받는걸로.. 
    경력: 
    스킬:
   */
    return (
        <div className="userInfoWrap">
            <div className="userInfoContent">
                <EducationSection
                    userNo={userNo}
                    educationList={careerData.educationList}
                    onListChange={handleEducationListChange}
                />
                <CertificateSection
                    userNo={userNo}
                    certificateList={careerData.certificateList}
                    onListChange={handleCertificateListChange}
                />
                <LanguageSection
                    userNo={userNo}
                    languageSkillList={careerData.languageSkillList}
                    onListChange={handleLanguageListChange}
                />
                <CareerHistorySection
                    userNo={userNo}
                    careerHistoryList={careerData.careerHistoryList}
                    onListChange={handleCareerHistoryListChange}
                />
                <SkillSection userNo={userNo} skillList={careerData.skillList} onListChange={handleSkillListChange} />
            </div>
        </div>
    );
};

export default MyCareer;
