import '../../../css/user/myPageComponent/UserInfo.css';
import '../../../css/user/myPageComponent/MyCareer.css';
import EducationSection from './EducationSection';
import CertificateSection from './CertificateSection';
import LanguageSection from './LanguageSection';
import CareerHistorySection from './CareerHistorySection';
import SkillSection from './SkillSection';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../utils/axiosConfig';
import React, { useState, useEffect, useCallback } from 'react';

// MyCareer 초기 객체 설정
const careerDataState = {
    user_no: null,
    hobby: '',
    notes: '',
    educationList: [],
    languageSkillList: [],
    skillList: [],
    certificateList: [],
    careerHistoryList: [],
};

const MyCareer = () => {
    // 🔐 AuthContext에서 사용자 정보 가져오기
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();

    // 백엔드에서 불러온 모든 커리어 데이터를 저장하는 상태 (CareerDto)
    const [careerData, setCareerData] = useState(careerDataState);

    // 로딩상태
    const [loading, setLoading] = useState(true);
    // 에러상태
    const [error, setError] = useState(null);

    // 🔄 데이터를 백엔드에서 다시 불러오는 함수 (useCallback으로 메모이제이션)
    const fetchCareerData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // AuthContext에서 userNo 가져오기
            if (user?.userNo) {
                const response = await axios.get(`/api/myPage/${user.userNo}/career`);
                const responseData = response;

                // 각 리스트에 null 이나 undefined가 있으면 걸러냄
                const cleanedCareerData = {
                    ...responseData,
                    user_no: user.userNo, // AuthContext의 userNo 사용
                    educationList: responseData.educationList?.filter(Boolean) || [],
                    languageSkillList: responseData.languageSkillList?.filter(Boolean) || [],
                    skillList: responseData.skillList?.filter(Boolean) || [],
                    certificateList: responseData.certificateList?.filter(Boolean) || [],
                    careerHistoryList: responseData.careerHistoryList?.filter(Boolean) || [],
                };

                setCareerData(cleanedCareerData); // 걸러낸 데이터 상태에 설정
                console.log('초기 커리어 데이터 확인:', cleanedCareerData);
            } else {
                setError('사용자 정보가 없습니다.');
            }
        } catch (error) {
            console.error('커리어 데이터 로딩 실패:', error);
            setError('데이터 로딩 실패');

            // 초기값으로 되돌리기
            setCareerData(careerDataState);
        } finally {
            setLoading(false);
        }
    }, [user?.userNo]);

    // 🔄 데이터 호출 (user 정보가 로드된 후)
    useEffect(() => {
        if (!authLoading && isAuthenticated && user?.userNo) {
            fetchCareerData();
        } else if (!authLoading && !isAuthenticated) {
            setError('로그인이 필요합니다.');
            setLoading(false);
        }
    }, [user?.userNo, isAuthenticated, authLoading, fetchCareerData]);

    // 🔄 각 섹션 컴포넌트로부터 리스트 변경을 전달받을 콜백 함수들
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
            languageSkillList: updatedList, // 언어 리스트만 새로운 리스트로 교체
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

    // 🔄 로딩 상태 처리
    if (authLoading || loading) {
        return (
            <div className="userInfoWrap">
                <div className="userInfoContent">
                    <p>🔄 커리어 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 🚫 인증 실패 또는 에러 발생 시
    if (!isAuthenticated || !user) {
        return (
            <div className="userInfoWrap">
                <div className="userInfoContent">
                    <p className="error-message">🔒 로그인이 필요합니다.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="userInfoWrap">
                <div className="userInfoContent">
                    <p className="error-message">❌ {error}</p>
                    <button
                        onClick={fetchCareerData}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (careerData === null) {
        return (
            <div className="userInfoWrap">
                <div className="userInfoContent">
                    <p>📋 데이터가 준비되지 않았습니다.</p>
                </div>
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
                {/* sessionStorage userNo 대신 AuthContext user.userNo 사용 */}
                <EducationSection
                    userNo={user.userNo}
                    educationList={careerData.educationList}
                    onListChange={handleEducationListChange}
                />
                <CertificateSection
                    userNo={user.userNo}
                    certificateList={careerData.certificateList}
                    onListChange={handleCertificateListChange}
                />
                <LanguageSection
                    userNo={user.userNo}
                    languageSkillList={careerData.languageSkillList}
                    onListChange={handleLanguageListChange}
                />
                <CareerHistorySection
                    userNo={user.userNo}
                    careerHistoryList={careerData.careerHistoryList}
                    onListChange={handleCareerHistoryListChange}
                />
                <SkillSection
                    userNo={user.userNo}
                    skillList={careerData.skillList}
                    onListChange={handleSkillListChange}
                />
            </div>
        </div>
    );
};

export default MyCareer;
