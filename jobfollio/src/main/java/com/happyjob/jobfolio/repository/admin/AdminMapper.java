package com.happyjob.jobfolio.repository.admin;


import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.happyjob.jobfolio.vo.usermgr.UserModel;

@Mapper
public interface AdminMapper {
    // STATUS가 'Y' 또는 'A'인 회원 수 계산
    int countMembersWithStatus();

    // 총 수익 계산
    int calculateTotalEarnings();

    // 총 구매자 수 계산
    int calculateTotalConsumers();

    // 월별 수익 데이터 반환
    List<Map<String, Object>> getMonthlyEarnings();

    // 모든 회원 조회
    List<UserModel> getAllMembers();

    // 특정 회원 정보 수정
    int updateMemberInfo(UserModel updatedMember);

    // 특정 회원 상태 변경
    int updateMemberStatus(String memberId, String status);

    // 등급별 고객 데이터 반환
    Map<String, Object> getConsumerDistribution();

    // 월별 가입 고객 데이터 반환
    List<Map<String, Object>> getMonthlyMembers();

    // Subscribe 페이지 고객 데이터 반환
    Map<String, Object> getSubscribeDistribution();

    int getGeneralUsers();

    // 사용 기록 총 카운트 반환
    int countTotalTasks();


}