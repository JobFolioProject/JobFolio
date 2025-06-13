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

    public void deleteByUserId(Long userNo) {
        logger.info("Calling deleteByUserId for user ID: " + userNo);
    }

    public void updateByUserId(Long userNo) {
        logger.info("Calling updateByUserId for user ID: " + userNo);
        // 예: MyCareerInfoRequestDto를 받아 여러 테이블을 업데이트하는 로직
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
            List<LanguageSkillVO> languageSkillList = mypageMapper.getLanguageSkillListByUserNo(userNo);
            careerAllDto.setLanguageSkillList(languageSkillList);
            // 스킬 목록
            List<SkillVO> skillList = mypageMapper.getSkillListByUserNo(userNo);
            careerAllDto.setSkillList(skillList);
            // 자격 목록
            List<CertificateVO> certificateList = mypageMapper.getCertificateListByUserNo(userNo);
            careerAllDto.setCertificateList(certificateList);
            // 경력 목록
            List<CareerHistoryVO> careerHistoryList = mypageMapper.getCareerHistoryListByUserNo(userNo);
            careerAllDto.setCreerHistoryList(careerHistoryList);
        }
        return careerAllDto;
    }


    // 기술 정보 추가
    public Integer addSkill(SkillVO skillVO) {
        return mypageMapper.insertSkill(skillVO);
    }
    public void updateSkill(SkillVO skillVO) {
        mypageMapper.updateSkill(skillVO);
    }
    public void deleteSkill(Long userNo) {
        mypageMapper.deleteSkill(userNo);
    }


    // 언어 정보 추가
    public Integer addLanguage(LanguageSkillVO languageSkillVO) {
        return mypageMapper.insertLanguageSkill(languageSkillVO);
    }
    public void updateLanguage(LanguageSkillVO languageSkillVO) {
        mypageMapper.updateLanguageSkill(languageSkillVO);
    }
    public void deleteLanguage(Long userNo) {
        mypageMapper.deleteLanguageSkill(userNo);
    }

    // 자격증 정보 추가
    public Integer addCertificate(CertificateVO certificateVO) {
        return mypageMapper.insertCertificate(certificateVO);
    }
    public void updateCertificate(CertificateVO certificateVO) {
        mypageMapper.updateCertificate(certificateVO);
    }
    public void deleteCertificate(Long userNo) {
        mypageMapper.deleteCertificate(userNo);
    }


    // 경력 정보 추가
    public CareerHistoryVO addCareerhistory(CareerHistoryVO careerHistoryVO) {
        return mypageMapper.insertCareerHistory(careerHistoryVO);
    }
    public void updateCareerhistory(CareerHistoryVO careerHistoryVO) {
        mypageMapper.updateCareerHistory(careerHistoryVO);
    }
    public void deleteCareerhistory(Long userNo) {
        mypageMapper.deleteCertificate(userNo);
    }

    // 학력 정보
    public Integer addEducation(EduInfoVO eduInfoVO) {
        return mypageMapper.insertEducation(eduInfoVO);
    }
    public void deleteByUserNoAndEduNo(Long userNo, Integer eduNo) {
        mypageMapper.deleteEducation(userNo,eduNo);
    }
    public void updateByUserNoAndEduNo(EduInfoVO eduInfoVO) {
        mypageMapper.updateEducation(eduInfoVO);
    }
}
