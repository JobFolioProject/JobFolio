package com.happyjob.jobfolio.repository.join;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.happyjob.jobfolio.vo.join.UserVO;

@Mapper
public interface UserMapper {

    // ================= 기본 CRUD =================

    /**
     * 사용자 등록 (한 번만 INSERT)
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

    /**
     * 소셜 타입과 소셜 ID로 사용자 조회
     */
    UserVO selectBySocialTypeAndSocialId(Map<String, Object> paramMap) throws Exception;

    /**
     * 소셜 사용자 신규 등록
     */
    int insertSocialUser(Map<String, Object> paramMap) throws Exception;

    /**
     * 이메일로 기존 일반 사용자 확인
     */
    UserVO selectByLoginId(Map<String, Object> paramMap) throws Exception;

}