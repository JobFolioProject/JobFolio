package com.happyjob.jobfolio.controller.mypage;

import com.happyjob.jobfolio.service.mypage.MypageService;
import com.happyjob.jobfolio.service.resume.ResumeService;
import com.happyjob.jobfolio.vo.admin.CustomerListDto;
import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.*;
import com.happyjob.jobfolio.vo.pay.PayModel;
import com.happyjob.jobfolio.vo.usermgr.UserModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    @Autowired
    private ResumeService resumeService;

    // ======================================== 회원 정보 =============================================
    // 마이페이지 - 회원정보 조회
    @GetMapping("/userInfo/{userNo}")
    public ResponseEntity<UserVO> getUserInfo(@PathVariable("userNo") Long userNo) {

        UserVO userVO= mypageService.getUserInfo(userNo);
        String userid= userVO.getLogin_id().replaceAll("^.*?_", "");
        userVO.setLogin_id(userid);

        return ResponseEntity.ok(userVO);
    }

    // 마이페이지 - 회원정보 수정
    @PostMapping("/editUserInfo")
    public ResponseEntity<String> editUserInfo(@RequestBody UserVO userInfo) {
        try {
            int result = mypageService.updateByUserId(userInfo);
            if (result > 0) {
                return ResponseEntity.ok("수정 완료");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("수정 실패: " + e.getMessage());
        }
    }

    // 마이페이지 - 회원 탈퇴
    @GetMapping("/userInfo/{userNo}/delete")
    public ResponseEntity<String> deleteByUserId(@PathVariable("userNo") Long userNo) {
        try {
            int result = mypageService.deleteByUserId(userNo);
            if (result > 0) {
                return ResponseEntity.ok("탈퇴 완료");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 사용자를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("탈퇴 실패: " + e.getMessage());
        }
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
    public ResponseEntity<String> updateEducation(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "edu_no") Long eduNo,  @RequestBody EduInfoVO eduInfoVO){
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
    @PutMapping("/{user_no}/careerhistories/{carrer_no}")
    public ResponseEntity<String> updateMyCareer(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "carrer_no") Integer carrerNo, @RequestBody CareerHistoryVO careerHistoryVO) {
        careerHistoryVO.setUser_no(userNo);
        careerHistoryVO.setCareer_no(carrerNo);
        mypageService.updateByUserNoAndCareerhistory(careerHistoryVO);
        return new ResponseEntity<>("경력 사항이 정상적으로 수정되었습니다.",HttpStatus.CREATED);
    }
    @DeleteMapping("/{user_no}/careerhistories/{carrer_no}")
    public ResponseEntity<String> deleteCareerHisory(@PathVariable(name = "user_no") Long userNo, @PathVariable(name = "carrer_no") Integer carrerNo) {
        mypageService.deleteByUserNoAndCareerhistory(userNo,carrerNo);
        return new ResponseEntity<>("경력 사항이 정상적으로 삭제되었습니다.", HttpStatus.CREATED);
    }


    // 기술(스킬)
    // 스킬 공통 목록
    @GetMapping("/skills/all")
    public ResponseEntity<List<CommSkillDto>> getCareerSkillList() {
        List<CommSkillDto> commSkillDto = mypageService.getAllCommonSkills();

        return ResponseEntity.ok(commSkillDto);
    }
    // 사용자 스킬 목록
    @GetMapping("/{user_no}/skills")
    public ResponseEntity<List<SkillVO>> getUserSkills(@PathVariable(name = "user_no") Long userNo) {
        List<SkillVO> dto = mypageService.getUserNoBySkill(userNo);
        return ResponseEntity.ok(dto);
    }
    // 스킬 추가
    @PostMapping("/{user_no}/skills")
    public ResponseEntity<SkillVO> addSkill(@PathVariable(name = "user_no") Long userNo, @RequestBody SkillVO skillVO) {
        skillVO.setUser_no(userNo);
        mypageService.addSkill(skillVO);
        return new ResponseEntity<>(skillVO, HttpStatus.CREATED);
    }
    // 스킬 업데이트
    @PutMapping("/{user_no}/skills/{skill_code}/{group_code}")
    public ResponseEntity<String> updateSkill(@PathVariable(name = "user_no") Long userNo,
                                              @PathVariable(name = "skill_code") String skill_code,
                                              @PathVariable(name = "group_code") String group_code,
                                              @RequestBody  SkillVO skillVO) {
        mypageService.updateSkill(skillVO);
        return new ResponseEntity<>("기술 사항이 정상적으로 수정되었습니다.", HttpStatus.CREATED);
    }
    // 스킬 삭제
    @DeleteMapping("/{user_no}/skills/{skill_code}/{group_code}")
    public ResponseEntity<String> deleteSkill(@PathVariable(name = "user_no") Long userNo,
                                              @PathVariable(name = "skill_code") String skillCode,
                                              @PathVariable(name = "group_code") String groupCode){
        mypageService.deleteSkill(userNo,skillCode,groupCode);
        return new ResponseEntity<>("기술 사항이 정상적으로 삭제되었습니다.", HttpStatus.CREATED);
    }



    // ======================================== 결제 내역 =============================================
    // 마이페이지 - 결제 내역 조회
    @GetMapping("/payHistory/{user_no}")
    public ResponseEntity<PayResponseDto> payHistory(@PathVariable(name = "user_no") Long userNo,
                                               @RequestParam(required = false) String search,
                                               @RequestParam(defaultValue = "1") int page,
                                               @RequestParam(defaultValue  = "10") int limit,
                                             @RequestParam(name = "status", defaultValue = "1") int pay_status) {


        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("user_no", userNo);
        paramMap.put("search", search);
        int offset = (page - 1) * limit;
        paramMap.put("offset", offset);
        paramMap.put("limit", limit);
        paramMap.put("page", page);
        paramMap.put("status", pay_status);

        int totalCount = mypageService.getTotalPayCount(paramMap);
        List<PayHisDto> payHistoryData = mypageService.getPayHistory(paramMap);

        return ResponseEntity.ok(new PayResponseDto(payHistoryData,totalCount));
    }

    // ======================================== 좋아요 내역 =============================================
    // 마이페이지 - 좋아요 내역 조회
    @GetMapping("/postLike/{user_no}")
    public Map<String, Object> postLike(@PathVariable Long userNo) {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        return resultMap;
    }
}
