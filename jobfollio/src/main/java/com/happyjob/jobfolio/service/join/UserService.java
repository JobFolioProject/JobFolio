package com.happyjob.jobfolio.service.join;

import java.util.Date;
import java.util.HashMap;
import java.util.UUID;
import java.util.Map;
import java.util.regex.Pattern;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.happyjob.jobfolio.repository.join.EmailVerificationMapper;
import com.happyjob.jobfolio.repository.join.UserMapper;
import com.happyjob.jobfolio.security.JwtTokenProvider;
import com.happyjob.jobfolio.util.CookieUtil;
import com.happyjob.jobfolio.vo.join.EmailVerificationVO;
import com.happyjob.jobfolio.vo.join.UserVO;

@Service
public class UserService {

    private final Logger logger = LogManager.getLogger(this.getClass());
    private final String className = this.getClass().toString();

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private EmailVerificationMapper emailVerificationMapper;

    @Autowired
    private EmailService emailService;

    // 보안 관련 의존성 추가
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CookieUtil cookieUtil;

    // 검증용 정규식 패턴
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z가-힣\\s]+$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^010-\\d{4}-\\d{4}$");
    private static final Pattern BIRTHDAY_PATTERN = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");

    /**
     * 회원가입 (백엔드 검증 + 비밀번호 암호화)
     */
    public int registerUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.registerUser");
        logger.info("   - ParamMap : " + paramMap);

        // 백엔드 검증 수행
        validateUserInput(paramMap);

        // 비밀번호 암호화
        String rawPassword = (String) paramMap.get("password");
        String encodedPassword = passwordEncoder.encode(rawPassword);
        paramMap.put("password", encodedPassword);

        // 기본값 설정
        paramMap.put("user_type", "C");  // C: 일반회원
        paramMap.put("status_yn", "Y");  // 활성 상태

        return userMapper.insertUser(paramMap);
    }

    /**
     * JWT 토큰 기반 로그인 인증 (쿠키 Only)
     */
    public Map<String, Object> authenticateUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.authenticateUser");
        logger.info("   - ParamMap : " + paramMap);

        String login_id = (String) paramMap.get("login_id");
        String rawPassword = (String) paramMap.get("password");

        Map<String, Object> result = new HashMap<String, Object>();

        // 입력값 검증
        if (login_id == null || login_id.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "이메일을 입력해주세요.");
            return result;
        }
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            result.put("success", false);
            result.put("message", "비밀번호를 입력해주세요.");
            return result;
        }

        // 사용자 정보 조회
        Map<String, Object> userMap = new HashMap<String, Object>();
        userMap.put("login_id", login_id);
        UserVO user = userMapper.selectUserByLoginId(userMap);

        if (user != null && passwordEncoder.matches(rawPassword, user.getPassword())) {
            // 계정 상태 확인
            if (!"Y".equals(user.getStatus_yn())) {
                result.put("success", false);
                result.put("message", "비활성화된 계정입니다. 관리자에게 문의하세요.");
                return result;
            }

            // 로그인 성공 - JWT 토큰 생성 (user_type 포함)
            String accessToken = jwtTokenProvider.generateAccessToken(
                    user.getLogin_id(),
                    user.getUser_no(),
                    user.getUser_name(),
                    user.getUser_type()  // A, B, C 권한 정보 포함
            );
            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getLogin_id());

            result.put("success", true);
            result.put("accessToken", accessToken);
            result.put("refreshToken", refreshToken);
            result.put("user", user);

            logger.info("   - Login successful for user: " + login_id + ", user_type: " + user.getUser_type());
        } else {
            // 로그인 실패
            result.put("success", false);
            result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");

            logger.warn("   - Login failed for user: " + login_id);
        }

        return result;
    }

    /**
     * 토큰 갱신
     */
    public Map<String, Object> refreshToken(String refreshToken) throws Exception {
        logger.info("+ Start UserService.refreshToken");

        Map<String, Object> result = new HashMap<String, Object>();

        if (jwtTokenProvider.validateRefreshToken(refreshToken)) {
            String login_id = jwtTokenProvider.getLoginIdFromToken(refreshToken);

            // 사용자 정보 조회
            Map<String, Object> paramMap = new HashMap<String, Object>();
            paramMap.put("login_id", login_id);
            UserVO user = userMapper.selectUserByLoginId(paramMap);

            if (user != null && "Y".equals(user.getStatus_yn())) {
                // 새로운 액세스 토큰 생성
                String newAccessToken = jwtTokenProvider.generateAccessToken(
                        user.getLogin_id(),
                        user.getUser_no(),
                        user.getUser_name(),
                        user.getUser_type()
                );

                result.put("success", true);
                result.put("accessToken", newAccessToken);

                logger.info("   - Token refresh successful for user: " + login_id);
            } else {
                result.put("success", false);
                result.put("message", "사용자를 찾을 수 없거나 비활성화된 계정입니다.");
            }
        } else {
            result.put("success", false);
            result.put("message", "유효하지 않은 리프레시 토큰입니다.");
        }

        return result;
    }

    /**
     * 비밀번호 변경 (암호화 적용)
     */
    public int updatePassword(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.updatePassword");
        logger.info("   - ParamMap : " + paramMap);

        // 현재 비밀번호 검증 (선택적)
        String currentPassword = (String) paramMap.get("currentPassword");
        String newPassword = (String) paramMap.get("newPassword");
        String login_id = (String) paramMap.get("login_id");

        // 새 비밀번호 검증
        validatePassword(newPassword);

        if (currentPassword != null) {
            // 현재 비밀번호 확인
            Map<String, Object> userMap = new HashMap<String, Object>();
            userMap.put("login_id", login_id);
            UserVO user = userMapper.selectUserByLoginId(userMap);

            if (user == null || !passwordEncoder.matches(currentPassword, user.getPassword())) {
                logger.warn("   - Current password verification failed for user: " + login_id);
                return 0; // 현재 비밀번호 불일치
            }
        }

        // 새 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(newPassword);
        paramMap.put("newPassword", encodedPassword);

        return userMapper.updatePassword(paramMap);
    }

    /**
     * 비밀번호 재설정 (암호화 적용)
     */
    public boolean resetPassword(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.resetPassword");
        logger.info("   - ParamMap : " + paramMap);

        try {
            String email = (String) paramMap.get("login_id");
            String newPassword = (String) paramMap.get("newPassword");
            String resetToken = (String) paramMap.get("resetToken");

            // 새 비밀번호 검증
            validatePassword(newPassword);

            if (verifyPasswordResetToken(email, resetToken)) {
                EmailVerificationVO verification = emailVerificationMapper.selectByVerificationCode(resetToken);
                if (verification != null) {
                    emailVerificationMapper.updateVerificationUsed(verification.getId());
                }

                // 새 비밀번호 암호화
                String encodedPassword = passwordEncoder.encode(newPassword);

                Map<String, Object> updateMap = new HashMap<String, Object>();
                updateMap.put("login_id", email);
                updateMap.put("newPassword", encodedPassword);

                int updateResult = userMapper.updatePassword(updateMap);

                if (updateResult > 0) {
                    emailService.sendPasswordChangeNotification(email);
                    return true;
                }
            }

        } catch (Exception e) {
            logger.error("Error in resetPassword", e);
        }

        return false;
    }

    /**
     * 로그인 ID 중복 체크 (DB 컬럼명 통일)
     */
    public int checkLoginIdDuplicate(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.checkLoginIdDuplicate");
        logger.info("   - ParamMap : " + paramMap);

        // login_id로 통일
        String login_id = (String) paramMap.get("login_id");
        if (login_id == null) {
            login_id = (String) paramMap.get("loginId"); // 호환성을 위해
            if (login_id != null) {
                paramMap.put("login_id", login_id);
            }
        }

        return userMapper.checkLoginIdDuplicate(paramMap);
    }

    /**
     * 사용자 정보 조회 (로그인ID로) - DB 컬럼명 통일
     */
    public UserVO getUserByLoginId(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.getUserByLoginId");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserByLoginId(paramMap);
    }

    /**
     * 사용자 정보 조회 (사용자번호로) - DB 컬럼명 통일
     */
    public UserVO getUserByUserNo(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.getUserByUserNo");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserByUserNo(paramMap);
    }

    /**
     * 백엔드 입력값 검증
     */
    private void validateUserInput(Map<String, Object> paramMap) throws Exception {
        String login_id = (String) paramMap.get("login_id");
        String user_name = (String) paramMap.get("user_name");
        String password = (String) paramMap.get("password");
        String hp = (String) paramMap.get("hp");
        String birthday = (String) paramMap.get("birthday");
        String address = (String) paramMap.get("address");
        String sex = (String) paramMap.get("sex");

        // 이메일 검증
        if (login_id == null || login_id.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일을 입력해주세요.");
        }
        if (login_id.length() > 50) {
            throw new IllegalArgumentException("이메일은 50자 이하로 입력해주세요.");
        }
        if (!EMAIL_PATTERN.matcher(login_id).matches()) {
            throw new IllegalArgumentException("올바른 이메일 형식이 아닙니다.");
        }

        // 이름 검증
        if (user_name == null || user_name.trim().isEmpty()) {
            throw new IllegalArgumentException("이름을 입력해주세요.");
        }
        if (user_name.length() > 20) {
            throw new IllegalArgumentException("이름은 20자 이하로 입력해주세요.");
        }
        if (!NAME_PATTERN.matcher(user_name).matches()) {
            throw new IllegalArgumentException("이름은 한글과 영문만 입력 가능합니다.");
        }

        // 비밀번호 검증
        validatePassword(password);

        // 휴대폰번호 검증
        if (hp == null || hp.trim().isEmpty()) {
            throw new IllegalArgumentException("휴대폰번호를 입력해주세요.");
        }
        if (!PHONE_PATTERN.matcher(hp).matches()) {
            throw new IllegalArgumentException("올바른 휴대폰번호 형식이 아닙니다. (010-XXXX-XXXX)");
        }

        // 생년월일 검증
        if (birthday == null || birthday.trim().isEmpty()) {
            throw new IllegalArgumentException("생년월일을 입력해주세요.");
        }
        if (!BIRTHDAY_PATTERN.matcher(birthday).matches()) {
            throw new IllegalArgumentException("올바른 생년월일 형식이 아닙니다. (YYYY-MM-DD)");
        }

        // 주소 검증
        if (address == null || address.trim().isEmpty()) {
            throw new IllegalArgumentException("주소를 입력해주세요.");
        }
        if (address.length() > 500) {
            throw new IllegalArgumentException("주소는 500자 이하로 입력해주세요.");
        }

        // 성별 검증
        if (sex == null || sex.trim().isEmpty()) {
            throw new IllegalArgumentException("성별을 선택해주세요.");
        }
        if (!"M".equals(sex) && !"W".equals(sex)) {
            throw new IllegalArgumentException("올바른 성별을 선택해주세요.");
        }
    }

    /**
     * 비밀번호 검증
     */
    private void validatePassword(String password) throws Exception {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }
        if (password.length() < 4) {
            throw new IllegalArgumentException("비밀번호는 4자 이상이어야 합니다.");
        }
        if (password.length() > 100) {
            throw new IllegalArgumentException("비밀번호는 100자 이하로 입력해주세요.");
        }
    }

    // ================= 기존 메서드들 (DB 컬럼명 통일) =================

    /**
     * 로그인 (기존 호환성 유지)
     */
    public UserVO loginUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.loginUser");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserByLoginId(paramMap);
    }

    /**
     * 사용자 정보 수정
     */
    public int updateUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.updateUser");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.updateUser(paramMap);
    }

    /**
     * 회원 탈퇴 (상태 변경)
     */
    public int withdrawUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.withdrawUser");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.withdrawUser(paramMap);
    }

    /**
     * 아이디 찾기 (이름, 연락처로)
     */
    public UserVO findUserIdByNameAndHp(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.findUserIdByNameAndHp");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserByNameAndHp(paramMap);
    }

    /**
     * 비밀번호 찾기 검증 (아이디, 이름, 연락처로)
     */
    public UserVO verifyUserForPasswordReset(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.verifyUserForPasswordReset");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserForPasswordReset(paramMap);
    }

    /**
     * 회원가입용 이메일 인증번호 발송 (DB 컬럼명 통일)
     */
    public boolean sendSignupEmailVerification(String email) throws Exception {
        logger.info("+ Start UserService.sendSignupEmailVerification");
        logger.info("   - Email : " + email);

        try {
            // 이메일 중복 확인 (DB 컬럼명 통일)
            Map<String, Object> checkMap = new HashMap<String, Object>();
            checkMap.put("login_id", email);  // loginId → login_id
            int duplicateCount = userMapper.checkLoginIdDuplicate(checkMap);

            if (duplicateCount > 0) {
                logger.warn("   - Email already exists: " + email);
                return false;
            }

            // 기존 미사용 인증 정보 삭제
            emailVerificationMapper.deleteUnusedByEmail(email);

            // 새 인증 코드 생성
            String verificationToken = generateVerificationToken();

            // 만료 시간 설정 (10분)
            Date expireTime = new Date(System.currentTimeMillis() + (10 * 60 * 1000));

            // 임시 테이블에 인증 정보 저장
            EmailVerificationVO emailVerification = new EmailVerificationVO(email, verificationToken, expireTime);
            int insertResult = emailVerificationMapper.insertEmailVerification(emailVerification);

            if (insertResult > 0) {
                // 이메일 발송
                boolean emailSent = emailService.sendSignupVerificationEmail(email, verificationToken);

                if (emailSent) {
                    logger.info("   - Email verification sent successfully to: " + email);
                } else {
                    logger.error("   - Failed to send email to: " + email);
                }

                return emailSent;
            }

        } catch (Exception e) {
            logger.error("Error in sendSignupEmailVerification", e);
        }

        return false;
    }

    /**
     * 이메일 인증 토큰 확인
     */
    public boolean verifyEmailToken(String email, String inputToken) throws Exception {
        logger.info("+ Start UserService.verifyEmailToken");
        logger.info("   - Email : " + email);

        try {
            // 임시 테이블에서 유효한 토큰 확인
            EmailVerificationVO verification = emailVerificationMapper.selectByVerificationCode(inputToken);

            if (verification != null && verification.getEmail().equals(email)) {
                // 인증 완료 처리
                int updateResult = emailVerificationMapper.updateVerificationUsed(verification.getId());

                if (updateResult > 0) {
                    logger.info("   - Email verification completed successfully for: " + email);
                    return true;
                }
            } else {
                logger.warn("   - Invalid or expired token for email: " + email);
            }

        } catch (Exception e) {
            logger.error("Error in verifyEmailToken", e);
        }

        return false;
    }

    /**
     * 이메일 인증 상태 확인
     */
    public boolean isEmailVerified(String email) throws Exception {
        logger.info("+ Start UserService.isEmailVerified");
        logger.info("   - Email : " + email);

        try {
            EmailVerificationVO verification = emailVerificationMapper.selectRecentByEmail(email);
            return verification != null && "Y".equals(verification.getIsUsed());
        } catch (Exception e) {
            logger.error("Error in isEmailVerified", e);
            return false;
        }
    }

    /**
     * 아이디 찾기용 이메일 발송
     */
    public boolean sendFoundIdByEmail(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.sendFoundIdByEmail");
        logger.info("   - ParamMap : " + paramMap);

        // 이름과 연락처로 사용자 찾기
        UserVO user = userMapper.selectUserByNameAndHp(paramMap);

        if (user != null) {
            String email = (String) paramMap.get("email");
            String foundId = user.getLogin_id();
            String regDate = user.getReg_date();

            return emailService.sendFoundIdEmail(email, foundId, regDate);
        }

        return false;
    }

    /**
     * 비밀번호 재설정용 이메일 인증번호 발송
     */
    public boolean sendPasswordResetEmailVerification(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.sendPasswordResetEmailVerification");
        logger.info("   - ParamMap : " + paramMap);

        try {
            // 사용자 존재 여부 확인
            UserVO user = userMapper.selectUserForPasswordReset(paramMap);

            if (user != null) {
                String email = (String) paramMap.get("login_id");  // loginId → login_id

                // 기존 미사용 인증 정보 삭제
                emailVerificationMapper.deleteUnusedByEmail(email);

                // 새 리셋 토큰 생성
                String resetToken = generateVerificationToken();

                // 만료 시간 설정 (5분)
                Date expireTime = new Date(System.currentTimeMillis() + (5 * 60 * 1000));

                // 임시 테이블에 리셋 토큰 저장
                EmailVerificationVO resetVerification = new EmailVerificationVO(email, resetToken, expireTime);
                int insertResult = emailVerificationMapper.insertEmailVerification(resetVerification);

                if (insertResult > 0) {
                    // 비밀번호 재설정 이메일 발송
                    return emailService.sendPasswordResetEmail(email, resetToken);
                }
            }

        } catch (Exception e) {
            logger.error("Error in sendPasswordResetEmailVerification", e);
        }

        return false;
    }

    /**
     * 비밀번호 재설정 토큰 확인
     */
    public boolean verifyPasswordResetToken(String email, String inputToken) throws Exception {
        logger.info("+ Start UserService.verifyPasswordResetToken");
        logger.info("   - Email : " + email);

        try {
            EmailVerificationVO verification = emailVerificationMapper.selectByVerificationCode(inputToken);
            return verification != null && verification.getEmail().equals(email);
        } catch (Exception e) {
            logger.error("Error in verifyPasswordResetToken", e);
            return false;
        }
    }

    // ================= 유틸리티 메서드 =================

    /**
     * 고유한 인증 토큰 생성 (UUID 기반)
     */
    private String generateVerificationToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    /**
     * 6자리 인증번호 생성
     */
    private String generateVerificationCode() {
        return String.format("%06d", (int)(Math.random() * 1000000));
    }
}