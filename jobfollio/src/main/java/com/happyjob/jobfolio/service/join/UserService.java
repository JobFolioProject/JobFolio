package com.happyjob.jobfolio.service.join;

import java.util.Date;
import java.util.HashMap;
import java.util.UUID;
import java.util.Map;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.happyjob.jobfolio.repository.join.EmailVerificationMapper;
import com.happyjob.jobfolio.repository.join.UserMapper;
import com.happyjob.jobfolio.vo.join.EmailVerificationVO;
import com.happyjob.jobfolio.vo.join.UserVO;

@Service
public class UserService {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private EmailVerificationMapper emailVerificationMapper;

    @Autowired
    private EmailService emailService;

    /**
     * 회원가입
     */
    public int registerUser(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.registerUser");
        logger.info("   - ParamMap : " + paramMap);

        // 이제 임시 데이터 처리 없이 바로 회원가입
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


    /**
     * 회원가입용 이메일 인증번호 발송
     */
    public boolean sendSignupEmailVerification(String email) throws Exception {
        logger.info("+ Start UserService.sendSignupEmailVerification");
        logger.info("   - Email : " + email);

        try {
            // 이메일 중복 확인
            Map<String, Object> checkMap = new HashMap<>();
            checkMap.put("loginId", email);
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
                // 6. 이메일 발송 (기존 EmailService 활용)
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
                //  인증 완료 처리
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
     * 아이디 찾기용 이메일 발송 (기존 유지)
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

            // EmailService의 새로운 메서드 활용
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
                String email = (String) paramMap.get("loginId");

                //  기존 미사용 인증 정보 삭제
                emailVerificationMapper.deleteUnusedByEmail(email);

                //  새 리셋 토큰 생성
                String resetToken = generateVerificationToken();

                //  만료 시간 설정 (5분)
                Date expireTime = new Date(System.currentTimeMillis() + (5 * 60 * 1000));

                //  임시 테이블에 리셋 토큰 저장
                EmailVerificationVO resetVerification = new EmailVerificationVO(email, resetToken, expireTime);
                int insertResult = emailVerificationMapper.insertEmailVerification(resetVerification);

                if (insertResult > 0) {
                    //  비밀번호 재설정 이메일 발송
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

    /**
     * 비밀번호 재설정 (토큰 확인 완료 후)
     */
    public boolean resetPassword(Map<String, Object> paramMap) throws Exception {
        logger.info("+ Start UserService.resetPassword");
        logger.info("   - ParamMap : " + paramMap);

        try {
            String email = (String) paramMap.get("loginId");
            String newPassword = (String) paramMap.get("newPassword");
            String resetToken = (String) paramMap.get("resetToken");

            //  토큰 재확인
            if (verifyPasswordResetToken(email, resetToken)) {
                //  임시 테이블에서 해당 토큰을 사용 완료로 처리
                EmailVerificationVO verification = emailVerificationMapper.selectByVerificationCode(resetToken);
                if (verification != null) {
                    emailVerificationMapper.updateVerificationUsed(verification.getId());
                }

                //  새 비밀번호로 업데이트
                Map<String, Object> updateMap = new HashMap<>();
                updateMap.put("loginId", email);
                updateMap.put("newPassword", newPassword);

                int updateResult = userMapper.updatePassword(updateMap);  // 기존 메서드 활용

                if (updateResult > 0) {
                    //  비밀번호 변경 완료 알림 이메일 발송
                    emailService.sendPasswordChangeNotification(email);
                    return true;
                }
            }

        } catch (Exception e) {
            logger.error("Error in resetPassword", e);
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
     * 6자리 인증번호 생성
     */
    private String generateVerificationCode() {
        return String.format("%06d", (int)(Math.random() * 1000000));
    }
}