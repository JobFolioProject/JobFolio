package com.happyjob.jobfolio.controller.join;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.happyjob.jobfolio.service.join.UserService;
import com.happyjob.jobfolio.vo.join.UserVO;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/join")
public class UserController {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private UserService userService;

    /**
     * 이메일 인증 토큰 발송
     */
    @PostMapping("/send-email-verification")
    public ResponseEntity<Map<String, Object>> sendEmailVerification(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.sendEmailVerification");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String email = (String) paramMap.get("email");

            if (email == null || email.trim().isEmpty()) {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            Map<String, Object> checkMap = new HashMap<>();
            checkMap.put("loginId", email);
            int duplicateCount = userService.checkLoginIdDuplicate(checkMap);

            if (duplicateCount > 0) {
                resultMap.put("result", "N");
                resultMap.put("message", "이미 가입된 이메일입니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            boolean emailSent = userService.sendSignupEmailVerification(email);

            if (emailSent) {
                resultMap.put("result", "Y");
                resultMap.put("message", "인증 토큰이 이메일로 발송되었습니다.");
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일 발송에 실패했습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in sendEmailVerification: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "시스템 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 이메일 인증 토큰 확인
     */
    @PostMapping("/verify-email-token")
    public ResponseEntity<Map<String, Object>> verifyEmailToken(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpSession session) {

        logger.info("+ Start UserController.verifyEmailToken");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String email = (String) paramMap.get("email");
            String token = (String) paramMap.get("token");

            if (email == null || token == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일과 인증번호를 모두 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            boolean isValid = userService.verifyEmailToken(email, token);

            if (isValid) {
                session.setAttribute("verifiedEmail", email);
                session.setAttribute("emailVerifiedAt", new Date());
                session.setMaxInactiveInterval(600);

                resultMap.put("result", "Y");
                resultMap.put("email", email);
                resultMap.put("message", "이메일 인증이 완료되었습니다.");

                logger.info("이메일 인증 완료 - 세션에 저장: " + email);
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "인증번호가 올바르지 않거나 만료되었습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in verifyEmailToken: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "인증 확인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 회원가입
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpSession session) {

        logger.info("+ Start UserController.registerUser");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String verifiedEmail = (String) session.getAttribute("verifiedEmail");
            Date emailVerifiedAt = (Date) session.getAttribute("emailVerifiedAt");
            String inputEmail = (String) paramMap.get("login_id");  // ✅ 수정

            // 디버깅 로그 추가
            logger.info("=== 이메일 검증 디버깅 ===");
            logger.info("세션 인증 이메일: " + verifiedEmail);
            logger.info("입력 이메일: " + inputEmail);
            logger.info("ParamMap 전체: " + paramMap);

            if (verifiedEmail == null || emailVerifiedAt == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일 인증이 필요합니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            long timeDiff = new Date().getTime() - emailVerifiedAt.getTime();
            if (timeDiff > 600000) {
                session.removeAttribute("verifiedEmail");
                session.removeAttribute("emailVerifiedAt");

                resultMap.put("result", "N");
                resultMap.put("message", "이메일 인증이 만료되었습니다. 다시 인증해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            if (inputEmail == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일 정보가 누락되었습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            if (!verifiedEmail.equals(inputEmail)) {
                logger.warn("이메일 불일치 - 세션: '" + verifiedEmail + "', 입력: '" + inputEmail + "'");
                resultMap.put("result", "N");
                resultMap.put("message", "인증된 이메일과 입력한 이메일이 일치하지 않습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // 필수 필드 검증 - 프론트엔드 파라미터 이름에 맞춤
            String[] requiredFields = {"login_id", "user_name", "password", "hp"};  // ✅ 수정
            for (String field : requiredFields) {
                if (paramMap.get(field) == null || paramMap.get(field).toString().trim().isEmpty()) {
                    resultMap.put("result", "N");
                    resultMap.put("message", field + "는 필수 입력값입니다.");
                    return ResponseEntity.badRequest().body(resultMap);
                }
            }

            int registerResult = userService.registerUser(paramMap);

            if (registerResult > 0) {
                session.removeAttribute("verifiedEmail");
                session.removeAttribute("emailVerifiedAt");

                resultMap.put("result", "Y");
                resultMap.put("message", "회원가입이 완료되었습니다.");

                logger.info("회원가입 완료 - 세션 정리: " + inputEmail);
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "회원가입에 실패했습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in registerUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "회원가입 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 이메일 인증 상태 확인
     */
    @GetMapping("/check-email-verification")
    public ResponseEntity<Map<String, Object>> checkEmailVerification(HttpSession session) {

        logger.info("+ Start UserController.checkEmailVerification");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String verifiedEmail = (String) session.getAttribute("verifiedEmail");
            Date emailVerifiedAt = (Date) session.getAttribute("emailVerifiedAt");

            if (verifiedEmail != null && emailVerifiedAt != null) {
                long timeDiff = new Date().getTime() - emailVerifiedAt.getTime();
                if (timeDiff <= 600000) {
                    resultMap.put("result", "Y");
                    resultMap.put("verifiedEmail", verifiedEmail);
                    resultMap.put("remainingTime", 600 - (timeDiff / 1000));
                    return ResponseEntity.ok(resultMap);
                } else {
                    session.removeAttribute("verifiedEmail");
                    session.removeAttribute("emailVerifiedAt");

                    resultMap.put("result", "EXPIRED");
                    resultMap.put("message", "이메일 인증이 만료되었습니다.");
                    return ResponseEntity.ok(resultMap);
                }
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일 인증이 필요합니다.");
                return ResponseEntity.ok(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in checkEmailVerification: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "인증 상태 확인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 로그인
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpSession session) {

        logger.info("+ Start UserController.loginUser");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String loginId = (String) paramMap.get("login_id");      // ✅ 수정
            String password = (String) paramMap.get("password");

            if (loginId == null || password == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디와 비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // UserService에 전달할 paramMap 준비
            Map<String, Object> serviceMap = new HashMap<>();
            serviceMap.put("loginId", loginId);  // 서비스에서는 loginId로 사용
            serviceMap.put("password", password);

            UserVO user = userService.loginUser(serviceMap);

            if (user != null && user.getPassword().equals(password)) {
                session.setAttribute("userNo", user.getUser_no());
                session.setAttribute("loginId", user.getLogin_id());
                session.setAttribute("userName", user.getUser_name());
                session.setAttribute("userType", user.getUser_type());

                resultMap.put("result", "Y");
                resultMap.put("message", "로그인이 완료되었습니다.");
                resultMap.put("userInfo", user);
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in loginUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "로그인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 로그아웃
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logoutUser(HttpSession session) {

        logger.info("+ Start UserController.logoutUser");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            session.invalidate();

            resultMap.put("result", "Y");
            resultMap.put("message", "로그아웃이 완료되었습니다.");
            return ResponseEntity.ok(resultMap);

        } catch (Exception e) {
            logger.error("Error in logoutUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "로그아웃 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 아이디 찾기
     */
    @PostMapping("/find-id")
    public ResponseEntity<Map<String, Object>> findUserId(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.findUserId");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String userName = (String) paramMap.get("user_name");    // ✅ 수정
            String hp = (String) paramMap.get("hp");
            String email = (String) paramMap.get("email");

            if (userName == null || hp == null || email == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "이름, 연락처, 이메일을 모두 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // UserService에 전달할 paramMap 준비
            Map<String, Object> serviceMap = new HashMap<>();
            serviceMap.put("userName", userName);  // 서비스에서는 userName으로 사용
            serviceMap.put("hp", hp);
            serviceMap.put("email", email);

            boolean emailSent = userService.sendFoundIdByEmail(serviceMap);

            if (emailSent) {
                resultMap.put("result", "Y");
                resultMap.put("message", "입력하신 이메일로 아이디를 발송했습니다.");
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in findUserId: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "아이디 찾기 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 비밀번호 재설정 토큰 발송 (리팩토링: 임시 테이블 사용)
     */
    @PostMapping("/send-password-reset-token")
    public ResponseEntity<Map<String, Object>> sendPasswordResetToken(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.sendPasswordResetToken");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String loginId = (String) paramMap.get("login_id");      // ✅ 수정
            String userName = (String) paramMap.get("user_name");    // ✅ 수정
            String hp = (String) paramMap.get("hp");

            if (loginId == null || userName == null || hp == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디, 이름, 연락처를 모두 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // UserService에 전달할 paramMap 준비
            Map<String, Object> serviceMap = new HashMap<>();
            serviceMap.put("loginId", loginId);    // 서비스에서는 loginId로 사용
            serviceMap.put("userName", userName);  // 서비스에서는 userName으로 사용
            serviceMap.put("hp", hp);

            boolean emailSent = userService.sendPasswordResetEmailVerification(serviceMap);

            if (emailSent) {
                resultMap.put("result", "Y");
                resultMap.put("message", "비밀번호 재설정 토큰이 이메일로 발송되었습니다.");
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in sendPasswordResetToken: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "토큰 발송 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 비밀번호 재설정 (리팩토링: 임시 테이블 연동)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.resetPassword");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String loginId = (String) paramMap.get("login_id");        // ✅ 수정
            String resetToken = (String) paramMap.get("reset_token");  // ✅ 수정
            String newPassword = (String) paramMap.get("new_password"); // ✅ 수정

            if (loginId == null || resetToken == null || newPassword == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "모든 필드를 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // UserService에 전달할 paramMap 준비
            Map<String, Object> serviceMap = new HashMap<>();
            serviceMap.put("loginId", loginId);
            serviceMap.put("resetToken", resetToken);
            serviceMap.put("newPassword", newPassword);

            boolean resetSuccess = userService.resetPassword(serviceMap);

            if (resetSuccess) {
                resultMap.put("result", "Y");
                resultMap.put("message", "비밀번호가 성공적으로 변경되었습니다.");
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "토큰이 올바르지 않거나 만료되었습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in resetPassword: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "비밀번호 재설정 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 로그인 상태 확인
     */
    @PostMapping("/check-login-status")
    public ResponseEntity<Map<String, Object>> checkLoginStatus(HttpSession session) {

        logger.info("+ Start UserController.checkLoginStatus");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            Long userNo = (Long) session.getAttribute("userNo");

            if (userNo != null) {
                resultMap.put("result", "Y");
                resultMap.put("userNo", userNo);
                resultMap.put("loginId", session.getAttribute("loginId"));
                resultMap.put("userName", session.getAttribute("userName"));
                resultMap.put("userType", session.getAttribute("userType"));
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "로그인이 필요합니다.");
                return ResponseEntity.ok(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in checkLoginStatus: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "로그인 상태 확인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    // 회원탈퇴기능 비밀번호 인증
    @PostMapping("/userInfoCheck")
    public ResponseEntity<Map<String, Object>> userInfoCheck(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpSession session) {

        logger.info("+ Start UserController.userInfoCheck");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String loginId = (String) paramMap.get("login_id");
            String password = (String) paramMap.get("password");

            if (loginId == null || password == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디와 비밀번호를 입력해주세요.");
                return ResponseEntity.ok(resultMap);
            }

            // UserService에 전달할 paramMap 준비
            Map<String, Object> serviceMap = new HashMap<>();
            serviceMap.put("loginId", loginId);

            UserVO user = userService.loginUser(serviceMap); // DB에서 login_id로 사용자 정보 조회

            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            if (user != null && passwordEncoder.matches(password, user.getPassword())) {
                resultMap.put("result", "Y");
                resultMap.put("userInfo", user);
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
                return ResponseEntity.ok(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in loginUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "정보 확인 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }
}