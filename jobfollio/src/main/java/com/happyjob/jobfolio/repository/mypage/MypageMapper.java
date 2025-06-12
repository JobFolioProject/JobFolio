package com.happyjob.jobfolio.repository.mypage;

import com.happyjob.jobfolio.vo.mypage.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MypageMapper {

//    // 유저 정보 조회
//    public UserVO selectUserInfo(@Param("user_no")Long userNo);
    
    // 내 커리어 - 유저 커리어 조회
    public CareerAllDto getMyCareerInfo(@Param("user_no") Long userNo);
    // 학력 조회
    public List<EduInfoVO> getEducationListByUserNo(@Param("user_no") Long userNo);
    // 언어 조회
    public List<LanguageSkillVO> getLanguageSkillListByUserNo(@Param("user_no")Long userNo);
    // 스킬 조회
    public List<SkillVO> getSkillListByUserNo(@Param("user_no")Long userNo);
    // 자격증 조회
    public List<CertificateVO> getCertificateListByUserNo(@Param("user_no")Long userNo);
    // 걍략 조회
    public  List<CareerHistoryVO> getCareerHistoryListByUserNo(@Param("user_no")Long userNo);

    // insert
    // 기술 스택 추가
    public SkillVO insertSkill(SkillVO skillVO);
    // 학력 정보 추가
    public EduInfoVO insertEducation(EduInfoVO eduInfoVO);
    // 언어 능력 추가
    public LanguageSkillVO insertLanguage(LanguageSkillVO languageSkillVO);
    // 자격증 추가
    public CertificateVO insertCertificate(CertificateVO certificateVO);
    // 경력 사항 추가
    public CareerHistoryVO insertCareerHistory(CareerHistoryVO careerHistoryVO);



}