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

    // 자격증 조회
    public List<CertificateVO> getCertificateListByUserNo(@Param("user_no")Long userNo);
    public void insertCertification(CertificateVO certificateVO);
    public void deleteCertification(@Param("user_no")Long userNo,@Param("certification_no") Integer certNo);
    public void updateCertification(CertificateVO certificateVO);

    // 언어 조회
    public List<LanguageSkillVO> getLanguageListByUserNo(@Param("user_no")Long userNo);
    public void insertLanguageSkill(LanguageSkillVO languageSkillVO);
    public void deleteLanguageSkill(@Param("user_no")Long userNo, String language);
    public void updateLanguageSkill(LanguageSkillVO languageSkillVO);

    // 경력 조회
    public List<CareerHistoryVO> getCareerHistoryListByUserNo(@Param("user_no")Long userNo);
    public void insertCareerHistory(CareerHistoryVO careerHistoryVO);
    public void deleteCareerHistory(@Param("user_no")Long userNo, @Param("career_no") Integer careerNo);
    public void updateCareerHistory(CareerHistoryVO careerHistoryVO);

    // 스킬 조회
    public List<SkillVO> getSkillListByUserNo(@Param("user_no")Long userNo);
    public void insertSkill(SkillVO skillVO);
    public void deleteSkill(@Param("user_no")Long userNo,@Param("skill_code")String skillCode,@Param("group_code")String groupCode);
    public void updateSkill(SkillVO skillVO);

    // 유저 정보 수정
    int updateByUserId(UserVO user);
    // 유저 회원 탈퇴
    int deleteByUserId(Long user_no);

    // 상세코드 조회
    public void searchByDetailCoad(@Param("user_no")Long userNo, @Param("skill_code")String skillCode,@Param("group_code")String groupCode);

}