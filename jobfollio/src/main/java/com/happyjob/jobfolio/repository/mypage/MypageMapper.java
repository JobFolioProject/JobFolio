package com.happyjob.jobfolio.repository.mypage;

import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MypageMapper {

    // 유저 정보 조회
    public UserVO selectUserInfo(@Param("user_no")Long userNo);

    // 내 커리어 - 유저 커리어 조회
    public CareerAllDto getMyCareerInfo(@Param("user_no") Long userNo);

    // 학력 조회
    public List<EduInfoVO> getEducationListByUserNo(@Param("user_no") Long userNo);
    public void insertEducation(EduInfoVO eduInfoVO); // 학력 정보 추가
    public void deleteEducation(@Param("user_no") Long userNo,@Param("edu_no") Integer eduNo);  // 학력 정보 제거
    public void updateEducation(EduInfoVO eduInfoVO); // 학력 정보 업데이트

    // 언어 조회
    public List<LanguageSkillVO> getLanguageSkillListByUserNo(@Param("user_no")Long userNo);
    public Integer insertLanguageSkill(LanguageSkillVO languageSkillVO);
    public void deleteLanguageSkill(@Param("user_no")Long userNo);
    public void updateLanguageSkill(LanguageSkillVO languageSkillVO);

    // 스킬 조회
    public List<SkillVO> getSkillListByUserNo(@Param("user_no")Long userNo);
    public Integer insertSkill(SkillVO skillVO);
    public void deleteSkill(@Param("user_no")Long userNo);
    public void updateSkill(SkillVO skillVO);

    // 자격증 조회
    public List<CertificateVO> getCertificateListByUserNo(@Param("user_no")Long userNo);
    public Integer insertCertificate(CertificateVO certificateVO);
    public void deleteCertificate(@Param("user_no")Long userNo);
    public void updateCertificate(CertificateVO certificateVO);

    // 걍략 조회
    public List<CareerHistoryVO> getCareerHistoryListByUserNo(@Param("user_no")Long userNo);
    public Integer insertCareerHistory(CareerHistoryVO careerHistoryVO);
    public void deleteCareerHistory(@Param("user_no")Long userNo, String careerHistory);
    public void updateCareerHistory(CareerHistoryVO careerHistoryVO);

}