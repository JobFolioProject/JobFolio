package com.happyjob.jobfolio.controller.join;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.happyjob.jobfolio.service.join.UserService;
import com.happyjob.jobfolio.vo.join.UserVO;

@RestController
@RequestMapping("/api/join")
public class UserController {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private UserService userService;

    // ================= 회원가입 관련 =================

    /**
     * 이메일 인증 토큰 발송
     * POST /api/join/send-email-verification
     */
    @PostMapping("/send-email-verification")
    public Map<String, Object> sendEmailVerification(
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
                return resultMap;
            }

            // 이메일 중복 체크
            Map<String, Object> checkMap = new HashMap<>();
            checkMap.put("loginId", email);
            int duplicateCount = userService.checkLoginIdDuplicate(checkMap);

            if (duplicateCount > 0) {
                resultMap.put("result", "N");
                resultMap.put("message", "이미 가입된 이메일입니다.");
                return resultMap;
            }

            // 이메일 인증 토큰 발송
            boolean emailSent = userService.sendSignupEmailVerification(email);

            if (emailSent) {
                resultMap.put("result", "Y");
                resultMap.put("message", "인증 토큰이 이메일로 발송되었습니다.");
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일 발송에 실패했습니다.");
            }

        } catch (Exception e) {
            logger.error("Error in sendEmailVerification: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "시스템 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.sendEmailVerification");
        return resultMap;
    }

    /**
     * 이메일 인증 토큰 확인
     * POST /api/join/verify-email-token
     */
    @PostMapping("/verify-email-token")
    public Map<String, Object> verifyEmailToken(
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
                return resultMap;
            }

            // 토큰 확인
            boolean isValid = userService.verifyEmailToken(email, token);

            if (isValid) {
                // 세션에 인증된 이메일 저장
                session.setAttribute("verifiedEmail", email);
                session.setMaxInactiveInterval(600); // 10분간 유지

                resultMap.put("result", "Y");
                resultMap.put("message", "이메일 인증이 완료되었습니다.");
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "인증번호가 올바르지 않거나 만료되었습니다.");
            }

        } catch (Exception e) {
            logger.error("Error in verifyEmailToken: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "인증 확인 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.verifyEmailToken");
        return resultMap;
    }

    /**
     * 회원가입
     * POST /api/join/register
     */
    @PostMapping("/register")
    public Map<String, Object> registerUser(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpSession session) {

        logger.info("+ Start UserController.registerUser");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            // 세션에서 인증된 이메일 확인
            String verifiedEmail = (String) session.getAttribute("verifiedEmail");
            String inputEmail = (String) paramMap.get("loginId");

            if (verifiedEmail == null || !verifiedEmail.equals(inputEmail)) {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일 인증을 먼저 완료해주세요.");
                return resultMap;
            }

            // 필수 필드 검증
            String[] requiredFields = {"loginId", "userName", "password", "hp"};
            for (String field : requiredFields) {
                if (paramMap.get(field) == null || paramMap.get(field).toString().trim().isEmpty()) {
                    resultMap.put("result", "N");
                    resultMap.put("message", field + "는 필수 입력값입니다.");
                    return resultMap;
                }
            }

            // 회원가입 처리
            int registerResult = userService.registerUser(paramMap);

            if (registerResult > 0) {
                // 세션에서 인증 정보 삭제
                session.removeAttribute("verifiedEmail");

                resultMap.put("result", "Y");
                resultMap.put("message", "회원가입이 완료되었습니다.");
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "회원가입에 실패했습니다.");
            }

        } catch (Exception e) {
            logger.error("Error in registerUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "회원가입 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.registerUser");
        return resultMap;
    }

    // ================= 로그인 관련 =================

    /**
     * 로그인
     * POST /api/join/login
     */
    @PostMapping("/login")
    public Map<String, Object> loginUser(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpSession session) {

        logger.info("+ Start UserController.loginUser");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String loginId = (String) paramMap.get("loginId");
            String password = (String) paramMap.get("password");

            if (loginId == null || password == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디와 비밀번호를 입력해주세요.");
                return resultMap;
            }

            // 로그인 시도
            UserVO user = userService.loginUser(paramMap);

            if (user != null && user.getPassword().equals(password)) {
                // 로그인 성공 - 세션에 사용자 정보 저장
                session.setAttribute("userNo", user.getUserNo());
                session.setAttribute("loginId", user.getLoginId());
                session.setAttribute("userName", user.getUserName());
                session.setAttribute("userType", user.getUserType());

                resultMap.put("result", "Y");
                resultMap.put("message", "로그인이 완료되었습니다.");
                resultMap.put("userInfo", user);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
            }

        } catch (Exception e) {
            logger.error("Error in loginUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "로그인 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.loginUser");
        return resultMap;
    }

    /**
     * 로그아웃
     * POST /api/join/logout
     */
    @PostMapping("/logout")
    public Map<String, Object> logoutUser(HttpSession session) {

        logger.info("+ Start UserController.logoutUser");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            // 세션 무효화
            session.invalidate();

            resultMap.put("result", "Y");
            resultMap.put("message", "로그아웃이 완료되었습니다.");

        } catch (Exception e) {
            logger.error("Error in logoutUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "로그아웃 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.logoutUser");
        return resultMap;
    }

    // ================= 아이디/비밀번호 찾기 =================

    /**
     * 아이디 찾기
     * POST /api/join/find-id
     */
    @PostMapping("/find-id")
    public Map<String, Object> findUserId(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.findUserId");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String userName = (String) paramMap.get("userName");
            String hp = (String) paramMap.get("hp");
            String email = (String) paramMap.get("email");

            if (userName == null || hp == null || email == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "이름, 연락처, 이메일을 모두 입력해주세요.");
                return resultMap;
            }

            // 아이디 찾기 및 이메일 발송
            boolean emailSent = userService.sendFoundIdByEmail(paramMap);

            if (emailSent) {
                resultMap.put("result", "Y");
                resultMap.put("message", "입력하신 이메일로 아이디를 발송했습니다.");
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            logger.error("Error in findUserId: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "아이디 찾기 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.findUserId");
        return resultMap;
    }

    /**
     * 비밀번호 재설정 토큰 발송
     * POST /api/join/send-password-reset-token
     */
    @PostMapping("/send-password-reset-token")
    public Map<String, Object> sendPasswordResetToken(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.sendPasswordResetToken");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String loginId = (String) paramMap.get("loginId");
            String userName = (String) paramMap.get("userName");
            String hp = (String) paramMap.get("hp");

            if (loginId == null || userName == null || hp == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디, 이름, 연락처를 모두 입력해주세요.");
                return resultMap;
            }

            // 비밀번호 재설정 토큰 발송
            boolean emailSent = userService.sendPasswordResetEmailVerification(paramMap);

            if (emailSent) {
                resultMap.put("result", "Y");
                resultMap.put("message", "비밀번호 재설정 토큰이 이메일로 발송되었습니다.");
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.");
            }

        } catch (Exception e) {
            logger.error("Error in sendPasswordResetToken: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "토큰 발송 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.sendPasswordResetToken");
        return resultMap;
    }

    /**
     * 비밀번호 재설정
     * POST /api/join/reset-password
     */
    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.resetPassword");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String loginId = (String) paramMap.get("loginId");
            String resetToken = (String) paramMap.get("resetToken");
            String newPassword = (String) paramMap.get("newPassword");

            if (loginId == null || resetToken == null || newPassword == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "모든 필드를 입력해주세요.");
                return resultMap;
            }

            // 비밀번호 재설정
            boolean resetSuccess = userService.resetPassword(paramMap);

            if (resetSuccess) {
                resultMap.put("result", "Y");
                resultMap.put("message", "비밀번호가 성공적으로 변경되었습니다.");
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "토큰이 올바르지 않거나 만료되었습니다.");
            }

        } catch (Exception e) {
            logger.error("Error in resetPassword: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "비밀번호 재설정 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.resetPassword");
        return resultMap;
    }

    // ================= 유틸리티 =================

    /**
     * 로그인 상태 확인
     * POST /api/join/check-login-status
     */
    @PostMapping("/check-login-status")
    public Map<String, Object> checkLoginStatus(HttpSession session) {

        logger.info("+ Start UserController.checkLoginStatus");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            Integer userNo = (Integer) session.getAttribute("userNo");

            if (userNo != null) {
                resultMap.put("result", "Y");
                resultMap.put("userNo", userNo);
                resultMap.put("loginId", session.getAttribute("loginId"));
                resultMap.put("userName", session.getAttribute("userName"));
                resultMap.put("userType", session.getAttribute("userType"));
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "로그인이 필요합니다.");
            }

        } catch (Exception e) {
            logger.error("Error in checkLoginStatus: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "로그인 상태 확인 중 오류가 발생했습니다.");
        }

        logger.info("+ End UserController.checkLoginStatus");
        return resultMap;
    }
}