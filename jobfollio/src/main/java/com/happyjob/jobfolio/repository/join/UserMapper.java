package com.happyjob.jobfolio.repository.join;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.happyjob.jobfolio.vo.join.UserVO;

@Mapper
public interface UserMapper {

    // ================= 기본 CRUD =================

    /**
     * 사용자 등록
     */
    int insertUser(Map<String, Object> paramMap) throws Exception;

    /**
     * 로그인 ID 중복 체크
     */
    int checkLoginIdDuplicate(Map<String, Object> paramMap) throws Exception;

    /**
     * 로그인ID로 사용자 조회
     */
    UserVO selectUserByLoginId(Map<String, Object> paramMap) throws Exception;

    /**
     * 사용자번호로 사용자 조회
     */
    UserVO selectUserByUserNo(Map<String, Object> paramMap) throws Exception;

    /**
     * 사용자 정보 수정
     */
    int updateUser(Map<String, Object> paramMap) throws Exception;

    /**
     * 비밀번호 변경
     */
    int updatePassword(Map<String, Object> paramMap) throws Exception;

    /**
     * 회원 탈퇴 (상태 변경)
     */
    int withdrawUser(Map<String, Object> paramMap) throws Exception;

    /**
     * 이름과 연락처로 사용자 조회 (아이디 찾기)
     */
    UserVO selectUserByNameAndHp(Map<String, Object> paramMap) throws Exception;

    /**
     * 비밀번호 찾기용 사용자 검증
     */
    UserVO selectUserForPasswordReset(Map<String, Object> paramMap) throws Exception;

    // ================= 토큰 관련 =================

    /**
     * 이메일 인증 토큰 저장
     */
    int saveEmailVerificationToken(Map<String, Object> paramMap) throws Exception;

    /**
     * 비밀번호 재설정 토큰 저장
     */
    int savePasswordResetToken(Map<String, Object> paramMap) throws Exception;

    /**
     * 이메일 인증 토큰으로 사용자 조회 (만료시간 체크 포함)
     */
    UserVO selectByEmailVerifyToken(Map<String, Object> paramMap) throws Exception;

    /**
     * 비밀번호 재설정 토큰으로 사용자 조회 (만료시간 체크 포함)
     */
    UserVO selectByPasswordResetToken(Map<String, Object> paramMap) throws Exception;

    /**
     * 이메일 인증 완료 처리 (email_verified = 'Y', 토큰 삭제)
     */
    int completeEmailVerification(Map<String, Object> paramMap) throws Exception;


    /**
     * 비밀번호 업데이트 + 재설정 토큰 삭제
     */
    int updatePasswordAndClearToken(Map<String, Object> paramMap) throws Exception;

}
