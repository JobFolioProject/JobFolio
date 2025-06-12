package com.happyjob.jobfolio.service.mypage;

import com.happyjob.jobfolio.repository.mypage.MypageMapper;
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

        // 만약 조회된 결과가 없다면
        if(careerAllDto != null){
            List<EduInfoVO> educationList = mypageMapper.getEducationListByUserNo(userNo);
            careerAllDto.setEducationList(educationList);

            List<LanguageSkillVO> languageSkillList = mypageMapper.getLanguageSkillListByUserNo(userNo);
            careerAllDto.setLanguageSkillList(languageSkillList);

            List<SkillVO> skillList = mypageMapper.getSkillListByUserNo(userNo);
            careerAllDto.setSkillList(skillList);

            List<CertificateVO> certificateList = mypageMapper.getCertificateListByUserNo(userNo);
            careerAllDto.setCertificateList(certificateList);

            // 3. Career History 추가
            List<CareerHistoryVO> careerHistoryList = mypageMapper.getCareerHistoryListByUserNo(userNo);
            careerAllDto.setCreerHistoryList(careerHistoryList);
        }
        return careerAllDto;
    }
    // 기술 추가
    public SkillVO addSkill(SkillVO skillVO) {
        return mypageMapper.insertSkill(skillVO);
    }
    // 학력 추가
    public EduInfoVO addeducation(EduInfoVO eduInfoVO) {
        return mypageMapper.insertEducation(eduInfoVO);
    }
    // 언어 추가
    public LanguageSkillVO addlanguage(LanguageSkillVO languageSkillVO) {
        return mypageMapper.insertLanguage(languageSkillVO);
    }
    // 자격증 추가
    public CertificateVO addcertificate(CertificateVO certificateVO) {
        return mypageMapper.insertCertificate(certificateVO);
    }
    // 경력 추가
    public CareerHistoryVO addcareerhistory(CareerHistoryVO careerHistoryVO) {
        return mypageMapper.insertCareerHistory(careerHistoryVO);
    }

//    public UserVO getUserInfo(Long userNo) {
//        return mypageMapper.selectUserInfo(userNo);
//    }
}
