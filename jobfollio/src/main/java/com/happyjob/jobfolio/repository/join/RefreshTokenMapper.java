package com.happyjob.jobfolio.repository.join;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.happyjob.jobfolio.vo.join.RefreshTokenVO;

@Mapper
public interface RefreshTokenMapper {

    /**
     * Refresh Token 저장
     */
    int insertRefreshToken(RefreshTokenVO refreshTokenVO) throws Exception;

    /**
     * 토큰 해시로 조회
     */
    RefreshTokenVO selectByTokenHash(String tokenHash) throws Exception;

    /**
     * 토큰 ID로 조회
     */
    RefreshTokenVO selectByTokenId(Long tokenId) throws Exception;

    /**
     * 사용자별 활성 토큰 목록 조회
     */
    List<RefreshTokenVO> selectActiveTokensByUserNo(Integer userNo) throws Exception;

    /**
     * 마지막 사용 시간 업데이트
     */
    int updateLastUsedAt(Long tokenId) throws Exception;

    /**
     * 특정 토큰 무효화
     */
    int invalidateToken(Map<String, Object> paramMap) throws Exception;

    /**
     * 사용자의 모든 토큰 무효화
     */
    int invalidateUserTokens(Map<String, Object> paramMap) throws Exception;

    /**
     * 만료된 토큰 삭제 (배치 작업용)
     */
    int deleteExpiredTokens() throws Exception;

    /**
     * 무효화된 토큰 삭제 (배치 작업용)
     */
    int deleteRevokedTokens() throws Exception;

    /**
     * 사용자별 토큰 개수 조회
     */
    int countActiveTokensByUserNo(Integer userNo) throws Exception;

    /**
     * 오래된 토큰 삭제 (최대 보관 개수 제한)
     */
    int deleteOldTokensByUserNo(Map<String, Object> paramMap) throws Exception;

    /**
     * 관리자용 - 모든 활성 토큰과 사용자 정보 조회
     */
    List<Map<String, Object>> selectAllActiveTokensWithUser() throws Exception;

    /**
     * 최근 토큰 조회 (사용자별)
     */
    RefreshTokenVO selectMostRecentByUserNo(Integer userNo) throws Exception;

    /**
     * 가장 오래된 토큰들 조회 (동시 접속 제한용)
     */
    List<RefreshTokenVO> selectOldestTokensByUserNo(Map<String, Object> paramMap) throws Exception;

    /**
     * 현재 활성 사용자 번호 목록 조회 (배치 작업용)
     */
    List<Integer> selectActiveUserNumbers() throws Exception;
}