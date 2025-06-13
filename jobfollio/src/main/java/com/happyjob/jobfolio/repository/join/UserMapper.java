package com.happyjob.jobfolio.repository.join;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.happyjob.jobfolio.vo.join.UserVO;

@Mapper
public interface UserMapper {

    // ================= 기본 CRUD =================

    /**
     * 사용자 등록
     * @param paramMap - login_id, user_name, password, sex, hp, birthday, address, user_type, status_yn
     * @return 삽입된 행 수
     */
    int insertUser(Map<String, Object> paramMap) throws Exception;

    /**
     * 로그인 ID 중복 체크
     * @param paramMap - login_id
     * @return 중복된 계정 수 (0이면 사용 가능)
     */
    int checkLoginIdDuplicate(Map<String, Object> paramMap) throws Exception;

    /**
     * 로그인ID로 사용자 조회
     * @param paramMap - login_id
     * @return UserVO 사용자 정보 (없으면 null)
     */
    UserVO selectUserByLoginId(Map<String, Object> paramMap) throws Exception;

    /**
     * 사용자번호로 사용자 조회
     * @param paramMap - user_no
     * @return UserVO 사용자 정보 (없으면 null)
     */
    UserVO selectUserByUserNo(Map<String, Object> paramMap) throws Exception;

    /**
     * 사용자 정보 수정
     * @param paramMap - user_no, user_name, hp, birthday, address 등
     * @return 수정된 행 수
     */
    int updateUser(Map<String, Object> paramMap) throws Exception;

    /**
     * 비밀번호 변경
     * @param paramMap - login_id, newPassword (암호화된 비밀번호)
     * @return 수정된 행 수
     */
    int updatePassword(Map<String, Object> paramMap) throws Exception;

    /**
     * 회원 탈퇴 (상태 변경)
     * @param paramMap - user_no 또는 login_id
     * @return 수정된 행 수
     */
    int withdrawUser(Map<String, Object> paramMap) throws Exception;

    // ================= 찾기 기능 =================

    /**
     * 이름과 연락처로 사용자 조회 (아이디 찾기)
     * @param paramMap - user_name, hp
     * @return UserVO 사용자 정보 (없으면 null)
     */
    UserVO selectUserByNameAndHp(Map<String, Object> paramMap) throws Exception;

    /**
     * 비밀번호 찾기용 사용자 검증
     * @param paramMap - login_id, user_name, hp
     * @return UserVO 사용자 정보 (없으면 null)
     */
    UserVO selectUserForPasswordReset(Map<String, Object> paramMap) throws Exception;

    // ================= 추가 메서드 (선택사항) =================

    /**
     * 활성 사용자 수 조회
     * @return 활성 사용자 수
     */
    int countActiveUsers() throws Exception;

    /**
     * 사용자 타입별 조회
     * @param paramMap - user_type (A, B, C)
     * @return 해당 타입 사용자 목록
     */
    java.util.List<UserVO> selectUsersByType(Map<String, Object> paramMap) throws Exception;
}