package com.happyjob.jobfolio.controller.join;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.happyjob.jobfolio.security.UserPrincipal;
import com.happyjob.jobfolio.service.join.UserService;
import com.happyjob.jobfolio.util.CookieUtil;
import com.happyjob.jobfolio.vo.join.UserVO;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/join")
public class UserController {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private UserService userService;

    @Autowired
    private CookieUtil cookieUtil;

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

            // DB 컬럼명 통일
            Map<String, Object> checkMap = new HashMap<>();
            checkMap.put("login_id", email);
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
            String inputEmail = (String) paramMap.get("login_id");

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

            String[] requiredFields = {"login_id", "user_name", "password", "hp"};
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

        } catch (IllegalArgumentException e) {
            // 백엔드 검증 에러
            logger.error("Validation error in registerUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(resultMap);
        } catch (Exception e) {
            logger.error("Error in registerUser: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "회원가입 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * JWT 로그인 (쿠키 기반)
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpServletResponse response) {

        logger.info("+ Start UserController.loginUser");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            // 프론트엔드에서 오는 데이터 형식에 맞춰 변환
            String login_id = (String) paramMap.get("login_id");
            if (login_id == null) {
                login_id = (String) paramMap.get("loginId"); // 호환성
            }
            String password = (String) paramMap.get("password");

            if (login_id == null || password == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "아이디와 비밀번호를 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // UserService의 JWT 인증 메서드 사용
            Map<String, Object> authRequest = new HashMap<>();
            authRequest.put("login_id", login_id);
            authRequest.put("password", password);

            Map<String, Object> authResult = userService.authenticateUser(authRequest);

            if ((Boolean) authResult.get("success")) {
                // Access Token은 응답 JSON에 포함 (Bearer Token 방식)
                String accessToken = (String) authResult.get("accessToken");
                String refreshToken = (String) authResult.get("refreshToken");

                // Refresh Token만 쿠키에 저장 (기존 방식 유지)
                cookieUtil.createRefreshTokenCookie(response, refreshToken);

                resultMap.put("result", "Y");
                resultMap.put("message", "로그인이 완료되었습니다.");

                // Access Token을 응답에 포함 (새로운 방식)
                resultMap.put("accessToken", accessToken);

                UserVO userVO = (UserVO) authResult.get("user");
                Map<String, Object> safeUser = new HashMap<>();
                safeUser.put("user_no", userVO.getUser_no());
                safeUser.put("login_id", userVO.getLogin_id());
                safeUser.put("user_name", userVO.getUser_name());
                safeUser.put("user_type", userVO.getUser_type());

                resultMap.put("user", safeUser);

                logger.info("JWT 로그인 성공 (Bearer Token 방식): " + login_id);
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", (String) authResult.get("message"));
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
     * JWT 로그아웃 (쿠키 삭제)
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logoutUser(HttpServletResponse response) {

        logger.info("+ Start UserController.logoutUser");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            // JWT 쿠키 삭제
            cookieUtil.deleteAllAuthCookies(response);

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
     * JWT 토큰 갱신
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response) {

        logger.info("+ Start UserController.refreshToken");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            // 쿠키에서 refresh token 추출
            String refreshToken = cookieUtil.getRefreshTokenFromCookie(request);

            if (refreshToken == null) {
                // 400 대신 200 OK로 응답 (현업 방식)
                resultMap.put("result", "N");
                resultMap.put("message", "로그아웃 상태입니다.");
                logger.info("Refresh token이 없음 - 로그아웃 상태");
                return ResponseEntity.ok(resultMap); // ← 200 OK
            }

            Map<String, Object> refreshResult = userService.refreshToken(refreshToken);

            if ((Boolean) refreshResult.get("success")) {
                // 새로운 access token을 응답에 포함 (Bearer Token 방식)
                String newAccessToken = (String) refreshResult.get("accessToken");

                resultMap.put("result", "Y");
                resultMap.put("message", "토큰이 갱신되었습니다.");
                resultMap.put("accessToken", newAccessToken); // 응답에 새 토큰 포함

                logger.info("토큰 갱신 성공");
                return ResponseEntity.ok(resultMap);
            } else {
                // 리프레시 토큰도 만료된 경우 모든 쿠키 삭제
                cookieUtil.deleteAllAuthCookies(response);

                // 400 대신 200 OK로 응답 (현업 방식)
                resultMap.put("result", "N");
                resultMap.put("message", "세션이 만료되었습니다.");
                logger.info("Refresh token 만료 - 로그아웃 처리");
                return ResponseEntity.ok(resultMap); // ← 200 OK
            }

        } catch (Exception e) {
            logger.error("Error in refreshToken: ", e);

            // 에러도 200 OK로 응답 (현업 방식)
            resultMap.put("result", "N");
            resultMap.put("message", "인증 오류가 발생했습니다.");
            return ResponseEntity.ok(resultMap); // ← 200 OK
        }
    }

    /**
     * JWT 로그인 상태 확인
     */
    @PostMapping("/check-login-status")
    public ResponseEntity<Map<String, Object>> checkLoginStatus() {

        logger.info("+ Start UserController.checkLoginStatus");

        Map<String, Object> resultMap = new HashMap<>();

        try {
            // Spring Security에서 현재 인증 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated() &&
                    authentication.getPrincipal() instanceof UserPrincipal) {

                UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

                resultMap.put("result", "Y");
                resultMap.put("user_no", userPrincipal.getUser_no());
                resultMap.put("login_id", userPrincipal.getLogin_id());
                resultMap.put("user_name", userPrincipal.getUser_name());
                resultMap.put("user_type", userPrincipal.getUser_type());

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
            String user_name = (String) paramMap.get("user_name");
            String hp = (String) paramMap.get("hp");

            if (user_name == null || hp == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "이름과 연락처를 모두 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            Map<String, Object> serviceMap = new HashMap<>();
            serviceMap.put("user_name", user_name);
            serviceMap.put("hp", hp);

            UserVO user = userService.findUserByNameAndHp(serviceMap);

            if (user != null) {
                String fullEmail = user.getLogin_id();

                resultMap.put("result", "Y");
                resultMap.put("found_id", fullEmail);
                resultMap.put("reg_date", user.getReg_date());
                resultMap.put("message", "아이디를 찾았습니다.");
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


    private String maskEmail(String email) {
        if (email == null || email.length() <= 3) {
            return "***@***";
        }

        String[] parts = email.split("@");
        if (parts.length != 2) return "***@***";

        String localPart = parts[0];
        String domain = parts[1];

        if (localPart.length() <= 3) {
            return localPart.charAt(0) + "**@" + domain;
        } else {
            return localPart.substring(0, 3) + "***@" + domain;
        }
    }

    /**
     * 비밀번호 재설정 토큰 발송 (DB 컬럼명 통일)
     */
    @PostMapping("/send-password-reset-token")
    public ResponseEntity<Map<String, Object>> sendPasswordResetToken(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.sendPasswordResetToken");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String email = (String) paramMap.get("email");

            if (email == null || email.trim().isEmpty()) {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일을 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // 이메일이 DB에 존재하는지 확인
            boolean emailExists = userService.checkEmailExists(email);

            if (!emailExists) {
                resultMap.put("result", "N");
                resultMap.put("message", "등록되지 않은 이메일입니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // 인증번호 발송
            boolean emailSent = userService.sendPasswordResetVerification(email);

            if (emailSent) {
                resultMap.put("result", "Y");
                resultMap.put("message", "인증번호가 이메일로 발송되었습니다.");
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일 발송에 실패했습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in sendPasswordResetEmail: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "이메일 발송 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 비밀번호 찾기 - 인증번호 확인 및 새 비밀번호 발송
     */
    @PostMapping("/verify-password-reset-and-send-new")
    public ResponseEntity<Map<String, Object>> verifyPasswordResetAndSendNew(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.verifyPasswordResetAndSendNew");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String email = (String) paramMap.get("email");
            String verificationCode = (String) paramMap.get("verification_code");

            if (email == null || verificationCode == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "이메일과 인증번호를 모두 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // 인증번호 확인 및 새 비밀번호 생성/발송
            boolean success = userService.verifyCodeAndResetPassword(email, verificationCode);

            if (success) {
                resultMap.put("result", "Y");
                resultMap.put("message", "새로운 비밀번호가 이메일로 발송되었습니다.");
                return ResponseEntity.ok(resultMap);
            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "인증번호가 올바르지 않거나 만료되었습니다.");
                return ResponseEntity.badRequest().body(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in verifyPasswordResetAndSendNew: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "비밀번호 재설정 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

    /**
     * 비밀번호 재설정 (DB 컬럼명 통일)
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request) {

        logger.info("+ Start UserController.resetPassword");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            String login_id = (String) paramMap.get("login_id");
            String resetToken = (String) paramMap.get("reset_token");
            String newPassword = (String) paramMap.get("new_password");

            if (login_id == null || resetToken == null || newPassword == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "모든 필드를 입력해주세요.");
                return ResponseEntity.badRequest().body(resultMap);
            }

            // DB 컬럼명 통일
            Map<String, Object> serviceMap = new HashMap<>();
            serviceMap.put("login_id", login_id);
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

        } catch (IllegalArgumentException e) {
            // 백엔드 검증 에러
            logger.error("Validation error in resetPassword: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(resultMap);
        } catch (Exception e) {
            logger.error("Error in resetPassword: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "비밀번호 재설정 중 오류가 발생했습니다.");
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

    @PostMapping("/userInfoCheck")
    public ResponseEntity<Map<String, Object>> userInfoCheck(
            @RequestBody Map<String, Object> paramMap,
            HttpServletRequest request,
            HttpServletResponse response) {

        logger.info("+ Start UserController.userInfoCheck");
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        try {
            // 현재 로그인된 사용자 정보 가져오기 (Spring Security)
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated() ||
                    !(authentication.getPrincipal() instanceof UserPrincipal)) {

                resultMap.put("result", "N");
                resultMap.put("message", "로그인이 필요합니다.");
                return ResponseEntity.ok(resultMap);
            }

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String currentLoginId = userPrincipal.getLogin_id();
            Long currentUserNo = userPrincipal.getUser_no();

            // 입력받은 비밀번호
            String inputPassword = (String) paramMap.get("password");

            if (inputPassword == null || inputPassword.trim().isEmpty()) {
                resultMap.put("result", "N");
                resultMap.put("message", "비밀번호를 입력해주세요.");
                return ResponseEntity.ok(resultMap);
            }

            // 1단계: 비밀번호 확인
            Map<String, Object> userCheckMap = new HashMap<>();
            userCheckMap.put("login_id", currentLoginId);

            UserVO user = userService.getUserByLoginId(userCheckMap);

            if (user == null) {
                resultMap.put("result", "N");
                resultMap.put("message", "사용자 정보를 찾을 수 없습니다.");
                return ResponseEntity.ok(resultMap);
            }

            // BCrypt 비밀번호 검증
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (!passwordEncoder.matches(inputPassword, user.getPassword())) {
                resultMap.put("result", "N");
                resultMap.put("message", "비밀번호가 올바르지 않습니다.");
                return ResponseEntity.ok(resultMap);
            }

            // 2단계: 탈퇴 처리
            Map<String, Object> withdrawMap = new HashMap<>();
            withdrawMap.put("user_no", currentUserNo);
            withdrawMap.put("login_id", currentLoginId);

            int withdrawResult = userService.withdrawUser(withdrawMap);

            if (withdrawResult > 0) {
                // 3단계: 자동 로그아웃 처리
                try {
                    // Long → Integer 변환
                    userService.invalidateUserTokens(currentUserNo.intValue(), "USER_WITHDRAWAL");

                    // 쿠키 삭제
                    cookieUtil.deleteAllAuthCookies(response);

                    logger.info("회원 탈퇴 완료 및 로그아웃 처리: " + currentLoginId);

                } catch (Exception logoutError) {
                    logger.error("탈퇴 후 로그아웃 처리 중 오류: ", logoutError);
                }

                resultMap.put("result", "Y");
                resultMap.put("message", "회원 탈퇴가 완료되었습니다.");
                return ResponseEntity.ok(resultMap);

            } else {
                resultMap.put("result", "N");
                resultMap.put("message", "회원 탈퇴 처리 중 오류가 발생했습니다.");
                return ResponseEntity.ok(resultMap);
            }

        } catch (Exception e) {
            logger.error("Error in userInfoCheck: ", e);
            resultMap.put("result", "N");
            resultMap.put("message", "회원 탈퇴 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(resultMap);
        }
    }

}