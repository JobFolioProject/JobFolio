package com.happyjob.jobfolio.service.mypage;

import com.happyjob.jobfolio.repository.mypage.MypageMapper;
import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.*;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MypageService {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();

    @Autowired
    private MypageMapper mypageMapper;

    // 회원정보 조회
    public UserVO getUserInfo(Long userNo) {
        return mypageMapper.selectUserInfo(userNo);
    }

    public int deleteByUserId(Long userNo) {
        return mypageMapper.deleteByUserId(userNo);
    }

    public int updateByUserId(UserVO userInfo) {
        System.out.println(userInfo);
        System.out.println("-----------------------service-------------------------------------");
        return mypageMapper.updateByUserId(userInfo);
    }

    // 커리어 조회
    public CareerAllDto getMyCareerInfo(Long userNo) {
        logger.info("getMyCareerInfo() 호출 userNo: " + userNo);

        // MypageMapper를 호출하여 데이터베이스에서 CareerDto 전체를 조회
        // 각 리스트 필드(educationList, languageSkillList, skillList, certificateList, careerHistory)에 맞게 매핑
        CareerAllDto careerAllDto = mypageMapper.getMyCareerInfo(userNo);

        // 만약 비어있지 않다면
        if(careerAllDto != null){

            // 학력 목록
            List<EduInfoVO> educationList = mypageMapper.getEducationListByUserNo(userNo);
            careerAllDto.setEducationList(educationList);
            // 언어 목록
            List<LanguageSkillVO> languageSkillList = mypageMapper.getLanguageListByUserNo(userNo);
            careerAllDto.setLanguageSkillList(languageSkillList);
            // 스킬 목록
            List<SkillVO> skillList = mypageMapper.getSkillListByUserNo(userNo);
            careerAllDto.setSkillList(skillList);
            // 자격 목록
            List<CertificateVO> certificateList = mypageMapper.getCertificateListByUserNo(userNo);
            careerAllDto.setCertificateList(certificateList);
            // 경력 목록
            List<CareerHistoryVO> careerHistoryList = mypageMapper.getCareerHistoryListByUserNo(userNo);
            careerAllDto.setCareerHistoryList(careerHistoryList);
        }
        return careerAllDto;
    }

    // 학력 정보
    public void addEducation(EduInfoVO eduInfoVO) {
        mypageMapper.insertEducation(eduInfoVO);
    }
    public void deleteByUserNoAndEduNo(Long userNo, Integer eduNo) {
        mypageMapper.deleteEducation(userNo,eduNo);
    }
    public void updateByUserNoAndEduNo(EduInfoVO eduInfoVO) {
        mypageMapper.updateEducation(eduInfoVO);
    }

    // 자격증 정보 추가
    public void addCertification(CertificateVO certificateVO) {
        mypageMapper.insertCertification(certificateVO);
    }
    public void deleteByUserNoAndCertNo(Long userNo, Integer certNo) {
        mypageMapper.deleteCertification(userNo,certNo);
    }
    public void updateByUserNoAndCertNo(CertificateVO certificateVO) {
        mypageMapper.updateCertification(certificateVO);
    }

    // 언어 정보 추가
    public void addLanguageSkill(LanguageSkillVO languageSkillVO) {
        mypageMapper.insertLanguageSkill(languageSkillVO);
    }
    public void deleteByUserNoAndLanguage(Long userNo, String language) {
        mypageMapper.deleteLanguageSkill(userNo,language);
    }
    public void updateByUserNoAndLanguage(LanguageSkillVO languageSkillVO) {
        mypageMapper.updateLanguageSkill(languageSkillVO);
    }

    // 경력 정보 추가
    public void addCareerhistory(CareerHistoryVO careerHistoryVO) {
        mypageMapper.insertCareerHistory(careerHistoryVO);
    }
    public void updateByUserNoAndCareerhistory(CareerHistoryVO careerHistoryVO) {
        mypageMapper.updateCareerHistory(careerHistoryVO);
    }
    public void deleteByUserNoAndCareerhistory(Long userNo, Integer carrerNo) {
        mypageMapper.deleteCareerHistory(userNo,carrerNo);
    }

    // 기술 정보 추가
    public void addSkill(SkillVO skillVO) {
        mypageMapper.insertSkill(skillVO);
    }
    public void updateSkill(SkillVO skillVO) {
        mypageMapper.updateSkill(skillVO);
    }
    public void deleteSkill(Long userNo,String skillCode,String groupCode) {
        mypageMapper.deleteSkill(userNo,skillCode,groupCode);
    }

    public void getAllCommonSkills() {
        mypageMapper.selectAllCommonSkills();
    }
    public List<SkillVO> getUserNoBySkill(Long userNo) {
        return mypageMapper.selectUserSkill(userNo);
    }

}
