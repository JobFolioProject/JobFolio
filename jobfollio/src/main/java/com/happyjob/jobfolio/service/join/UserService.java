package com.happyjob.jobfolio.service.join;

import java.util.HashMap;
import java.util.UUID;
import java.util.Map;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.happyjob.jobfolio.repository.join.UserMapper;
import com.happyjob.jobfolio.vo.join.UserVO;

@Service
public class UserService {

    private final Logger logger = LogManager.getLogger(this.getClass());

    private final String className = this.getClass().toString();

    @Autowired
    private UserMapper userMapper;

    /**
     * 회원가입
     */
    public int registerUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.registerUser");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.insertUser(paramMap);
    }

    /**
     * 로그인 ID 중복 체크
     */
    public int checkLoginIdDuplicate(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.checkLoginIdDuplicate");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.checkLoginIdDuplicate(paramMap);
    }

    /**
     * 로그인
     */
    public UserVO loginUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.loginUser");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserByLoginId(paramMap);
    }

    /**
     * 사용자 정보 조회 (로그인ID로)
     */
    public UserVO getUserByLoginId(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.getUserByLoginId");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserByLoginId(paramMap);
    }

    /**
     * 사용자 정보 조회 (사용자번호로)
     */
    public UserVO getUserByUserNo(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.getUserByUserNo");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.selectUserByUserNo(paramMap);
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
     * 비밀번호 변경
     */
    public int updatePassword(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.updatePassword");
        logger.info("   - ParamMap : " + paramMap);
        return userMapper.updatePassword(paramMap);
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

    // ================= SMTP 이메일 인증 관련 =================

    /**
     * 회원가입용 이메일 인증번호 발송
     */
    public boolean sendSignupEmailVerification(String email) throws Exception {
        logger.info("+ Start UserService.sendSignupEmailVerification");
        logger.info("   - Email : " + email);

        // 고유한 토큰 생성 (UUID 사용)
        String verificationToken = generateVerificationToken();

        // DB에 토큰 저장 (임시 사용자 정보)
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("loginId", email);
        paramMap.put("emailVerifyToken", verificationToken);
        paramMap.put("tokenExpireTime", "DATE_ADD(NOW(), INTERVAL 5 MINUTE)"); // 5분 후 만료

        // 임시 사용자 정보 저장 또는 기존 토큰 업데이트
        int result = userMapper.saveEmailVerificationToken(paramMap);

        if (result > 0) {
            // 이메일 발송
            boolean emailSent = sendEmail(email, "JobFolio 이메일 인증",
                    "안녕하세요! JobFolio입니다.\n\n" +
                            "이메일 인증을 위해 아래 토큰을 입력해주세요.\n\n" +
                            "인증 토큰: " + verificationToken + "\n\n" +
                            "5분 내에 인증을 완료해주세요.");

            return emailSent;
        }

        return false;
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
            String foundId = user.getLoginId();

            // 아이디 찾기 결과 이메일 발송
            boolean emailSent = sendEmail(email, "JobFolio 아이디 찾기 결과",
                    "안녕하세요! JobFolio입니다.\n\n" +
                            "요청하신 아이디 찾기 결과입니다.\n\n" +
                            "찾으신 아이디: " + foundId + "\n\n" +
                            "감사합니다.");

            return emailSent;
        }

        return false;
    }

    /**
     * 비밀번호 재설정용 이메일 인증번호 발송
     */
    public boolean sendPasswordResetEmailVerification(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.sendPasswordResetEmailVerification");
        logger.info("   - ParamMap : " + paramMap);

        // 사용자 존재 여부 확인
        UserVO user = userMapper.selectUserForPasswordReset(paramMap);

        if (user != null) {
            String email = (String) paramMap.get("loginId");

            // 고유한 토큰 생성
            String resetToken = generateVerificationToken();

            // DB에 비밀번호 재설정 토큰 저장
            Map<String, Object> tokenMap = new HashMap<>();
            tokenMap.put("loginId", email);
            tokenMap.put("resetToken", resetToken);

            int result = userMapper.savePasswordResetToken(tokenMap);

            if (result > 0) {
                // 비밀번호 재설정 토큰 이메일 발송
                boolean emailSent = sendEmail(email, "JobFolio 비밀번호 재설정",
                        "안녕하세요! JobFolio입니다.\n\n" +
                                "비밀번호 재설정을 위한 인증 토큰입니다.\n\n" +
                                "인증 토큰: " + resetToken + "\n\n" +
                                "보안을 위해 5분 내에 인증을 완료해주세요.");

                return emailSent;
            }
        }

        return false;
    }

    /**
     * 이메일 인증 토큰 확인
     */
    public boolean verifyEmailToken(String email, String inputToken) throws Exception {
        logger.info("+ Start UserService.verifyEmailToken");
        logger.info("   - Email : " + email);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("loginId", email);
        paramMap.put("emailVerifyToken", inputToken);

        // 유효한 토큰인지 확인 (만료시간 포함)
        UserVO user = userMapper.selectByEmailVerifyToken(paramMap);

        if (user != null) {
            // 인증 완료 처리
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("loginId", email);
            userMapper.completeEmailVerification(updateMap);

            return true;
        }

        return false;
    }

    /**
     * 비밀번호 재설정 토큰 확인
     */
    public boolean verifyPasswordResetToken(String email, String inputToken) throws Exception {
        logger.info("+ Start UserService.verifyPasswordResetToken");
        logger.info("   - Email : " + email);

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("loginId", email);
        paramMap.put("resetToken", inputToken);

        // 유효한 재설정 토큰인지 확인
        UserVO user = userMapper.selectByPasswordResetToken(paramMap);

        return user != null;
    }

    /**
     * 비밀번호 재설정 (토큰 확인 완료 후)
     */
    public boolean resetPassword(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.resetPassword");
        logger.info("   - ParamMap : " + paramMap);

        String email = (String) paramMap.get("loginId");
        String newPassword = (String) paramMap.get("newPassword");
        String resetToken = (String) paramMap.get("resetToken");

        // 토큰 재확인
        if (verifyPasswordResetToken(email, resetToken)) {
            // 새 비밀번호로 업데이트 + 토큰 삭제
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put("loginId", email);
            updateMap.put("newPassword", newPassword);

            int updateResult = userMapper.updatePasswordAndClearToken(updateMap);

            if (updateResult > 0) {
                // 비밀번호 변경 완료 알림 이메일 발송
                sendEmail(email, "JobFolio 비밀번호 변경 완료",
                        "안녕하세요! JobFolio입니다.\n\n" +
                                "비밀번호가 성공적으로 변경되었습니다.\n\n" +
                                "만약 본인이 변경하지 않았다면 즉시 고객센터로 연락해주세요.\n\n" +
                                "감사합니다.");

                return true;
            }
        }

        return false;
    }

    // ================= 유틸리티 메서드 =================

    /**
     * 고유한 인증 토큰 생성 (UUID 기반)
     */
    private String generateVerificationToken() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    /**
     * 6자리 인증번호 생성 (예비용)
     */
    private String generateVerificationCode() {
        return String.format("%06d", (int)(Math.random() * 1000000));
    }

    /**
     * 이메일 발송 (SMTP)
     */
    private boolean sendEmail(String to, String subject, String content) throws Exception {
        // JavaMailSender를 사용한 실제 이메일 발송 로직 구현 필요
        logger.info("Sending email to: " + to);
        logger.info("Subject: " + subject);
        logger.info("Content: " + content);

        // 실제 구현 시 JavaMailSender 사용
        return true; // 임시로 true 반환
    }
}
