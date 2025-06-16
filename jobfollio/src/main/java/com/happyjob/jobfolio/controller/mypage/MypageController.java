package com.happyjob.jobfolio.controller.mypage;

import com.happyjob.jobfolio.service.mypage.MypageService;
import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.*;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/myPage")
public class MypageController {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();


    // 마이페이지 - 서비스 연결
    @Autowired
    private MypageService mypageService;

    // ======================================== 회원 정보 =============================================
    // 마이페이지 - 회원정보 조회
    @GetMapping("/userInfo/{userNo}")
    public ResponseEntity<UserVO> getUserInfo(@PathVariable("userNo") Long userNo) {

        UserVO userVO= mypageService.getUserInfo(userNo);

        return ResponseEntity.ok(userVO);
    }

    // 마이페이지 - 회원 탈퇴
    @DeleteMapping("/userInfo/{userNo}/delete")
    public Map<String, Object> deleteByUserId(@PathVariable Long userNo, @RequestBody UserVO userVO) {


        mypageService.deleteByUserId(userNo);
        Map<String, Object> resultMap = new HashMap<String, Object>();

        return resultMap;
    }

    // 마이페이지 - 회원정보 수정
    @PutMapping("/userInfo/{userNo}/update")
    public Map<String, Object> updateByUserId(@RequestParam Long userNo) {

        mypageService.updateByUserId(userNo);

        Map<String, Object> resultMap = new HashMap<String, Object>();

        return resultMap;
    }

    // ======================================== 이력서 내역 =============================================
    // 마이페이지 - 이력서 내역 조회
    @GetMapping("/resumeDetail/{userNo}")
    public Map<String, Object> resumeDetailList(@PathVariable(name = "user_no") Long userNo) {

        // 해당 유저의 이력서 리스트를 찾아 불러오기
//        List<ResumeInfoVO> resumeList = mypageService.resumeDetailList(userNo);

        Map<String, Object> resultMap = new HashMap<String, Object>();

        return resultMap;
    }

    // ======================================== 내 커리어 =============================================

    // 마이페이지 - 내 커리어 조회
    // 유저 정보, 기술, 언어, 자격증, 학력을 조회
    // /api/myPage/{userNo}/career 엔드포인트
    @GetMapping("/{user_no}/career")
    public ResponseEntity<CareerAllDto> myCareerById(@PathVariable(name = "user_no") Long userNo) {

        //서비스 호출 - userNo를 넘겨서 모든 데이터를 조회
        CareerAllDto dto = mypageService.getMyCareerInfo(userNo);

        return ResponseEntity.ok(dto);
    }

    // 기술 스택
    @PostMapping("/{user_no}/skills")
    public ResponseEntity<String> addSkill(@PathVariable(name = "user_no") Long userNo, @RequestBody SkillVO skillVO) {


        mypageService.addSkill(skillVO);
        return new ResponseEntity<>("기술 사항이 정상적으로 추가되었습니다.", HttpStatus.CREATED);
    }

    //학력 저장 - 리액트에서 받는걸 생각해야함.
    @PostMapping("/{user_no}/educations")
    public ResponseEntity<EduInfoVO> addEducation(@PathVariable(name = "user_no") Long userNo, @RequestBody EduInfoVO eduInfoVO) {
        // URL에서 받은 user_no를 eduInfoVO에 설정
        eduInfoVO.setUser_no(userNo);
        // 서비스 호출
        mypageService.addEducation(eduInfoVO);
        return new ResponseEntity<>(eduInfoVO, HttpStatus.CREATED);
    }
    // 학력 수정
    @PutMapping("/{user_no}/educations/{edu_no}")
    public ResponseEntity<String> updateEducation(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "edu_no") Integer eduNo,  @RequestBody EduInfoVO eduInfoVO){
        eduInfoVO.setUser_no(userNo);
        eduInfoVO.setEdu_no(eduNo);
        mypageService.updateByUserNoAndEduNo(eduInfoVO);
        return new ResponseEntity<>("학력 사항이 정상적으로 수정되었습니다.", HttpStatus.CREATED);
    }
    // 학력 삭제
    @DeleteMapping("/{user_no}/educations/{edu_no}")
    public ResponseEntity<String> deleteEducation(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "edu_no") Integer eduNo) {
        // 서비스 호출
        mypageService.deleteByUserNoAndEduNo(userNo,eduNo);
        return new ResponseEntity<>("학력 사항이 정상적으로 삭제되었습니다", HttpStatus.CREATED);
    }

    // 자격증
    @PostMapping("/{user_no}/certificates")
    public ResponseEntity<CertificateVO> addCertificate(@PathVariable(name = "user_no") Long userNo, @RequestBody CertificateVO certificateVO) {
        // URL에서 받은 user_no를 certificateVO 설정
        certificateVO.setUser_no(userNo);
        // 서비스 호출
        mypageService.addCertification(certificateVO);
        return new ResponseEntity<>(certificateVO, HttpStatus.CREATED);
    }
    @PutMapping("/{user_no}/certificates/{certification_no}")
    public ResponseEntity<String> updateCertificateion(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "certification_no") Integer certNo, @RequestBody CertificateVO certificateVO) {
        certificateVO.setUser_no(userNo);
        certificateVO.setCertification_no(certNo);
        mypageService.updateByUserNoAndCertNo(certificateVO);
        return new ResponseEntity<>("자격 정보가 정상적으로 수정되었습니다.", HttpStatus.CREATED);
    }
    @DeleteMapping("/{user_no}/certificates/{certification_no}")
    public ResponseEntity<String> deleteCertificate(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "certification_no") Integer certNo) {

        mypageService.deleteByUserNoAndCertNo(userNo,certNo);
        return new ResponseEntity<>("자격 정보가 정상적으로 삭제되었습니다", HttpStatus.CREATED);
    }

    // 언어
    @PostMapping("/{user_no}/languages")
    public ResponseEntity<LanguageSkillVO> addLanguageSkill(@PathVariable(name = "user_no") Long userNo, @RequestBody LanguageSkillVO languageSkillVO) {
        // URL에서 받은 user_no를 languageSkillVO 설정
        languageSkillVO.setUser_no(userNo);
        mypageService.addLanguageSkill(languageSkillVO);
        return new ResponseEntity<>(languageSkillVO, HttpStatus.CREATED);
    }
    @PutMapping("/{user_no}/languages/{laguages}")
    public ResponseEntity<String> updateLaguageSkill(@PathVariable(name = "user_no") Long userNo, @PathVariable String laguages, @RequestBody LanguageSkillVO languageSkillVO) {
        languageSkillVO.setUser_no(userNo);
        languageSkillVO.setLanguage(laguages);
        mypageService.updateByUserNoAndLanguage(languageSkillVO);
        return new ResponseEntity<>("언어 정보가 정상적으로 수정되었습니다.", HttpStatus.CREATED);
    }
    @DeleteMapping("/{user_no}/languages/{languages}")
    public ResponseEntity<String> deleteLanguageSkill(@PathVariable(name = "user_no") Long userNo, @PathVariable String languages) {
        mypageService.deleteByUserNoAndLanguage(userNo,languages);
        return new ResponseEntity<>("언어 정보가 정상적으로 삭제되었습니다.", HttpStatus.CREATED);
    }

    // 경력
    @PostMapping("/{user_no}/careerhistories")
    public ResponseEntity<CareerHistoryVO> addCareerHistory(@PathVariable(name = "user_no") Long userNo, @RequestBody CareerHistoryVO careerHistoryVO) {
        mypageService.addCareerhistory(careerHistoryVO);
        return new ResponseEntity<>(careerHistoryVO, HttpStatus.CREATED);
    }
    @PutMapping("/myCareer/{user_no}/update")
    public ResponseEntity<String> modifyMyCareer(@PathVariable(name = "user_no") Long userNo, @RequestBody CareerHistoryVO careerHistoryVO) {
        return new ResponseEntity<>("",HttpStatus.CREATED);
    }
    @DeleteMapping("/{user_no}/careerhistories/{carrer_no}")
    public ResponseEntity<String> deleteCareerHisory(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "carrer_no") Integer carrerNo) {
        mypageService.deleteCareerhistory(userNo,carrerNo);
        return new ResponseEntity<>("", HttpStatus.CREATED);
    }



    // ======================================== 결재 내역 =============================================
    // 마이페이지 - 결재 내역 조회
    @GetMapping("/payHistory/{user_no}")
    public Map<String, Object> payHistory(@PathVariable Long userNo) {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        return resultMap;
    }

    // ======================================== 좋아요 내역 =============================================
    // 마이페이지 - 좋아요 내역 조회
    @GetMapping("/postLike/{user_no}")
    public Map<String, Object> postLike(@PathVariable Long userNo) {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        return resultMap;
    }
}
