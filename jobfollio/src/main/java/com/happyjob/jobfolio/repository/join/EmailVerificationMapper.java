package com.happyjob.jobfolio.repository.join;

import com.happyjob.jobfolio.vo.join.EmailVerificationVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface EmailVerificationMapper {

    /**
     * 이메일 인증 정보 저장
     * @return 삽입된 행 수
     */
    int insertEmailVerification(EmailVerificationVO emailVerificationVO);

    /**
     * 인증 코드로 유효한 인증 정보 조회 (만료되지 않고 사용되지 않은 것만)
     * @return 인증 정보
     */
    EmailVerificationVO selectByVerificationCode(String verificationCode);

    /**
     * 이메일로 최근 인증 정보 조회
     * @return 최근 인증 정보
     */
    EmailVerificationVO selectRecentByEmail(String email);

    /**
     * 인증 완료 처리 (사용 상태 업데이트)
     * @return 업데이트된 행 수
     */
    int updateVerificationUsed(Long id);

    /**
     * 이메일별 미사용 인증 정보 삭제 (새 인증 요청 시 기존 것 정리)
     * @return 삭제된 행 수
     */
    int deleteUnusedByEmail(String email);

    int countExpiredVerifications();
}