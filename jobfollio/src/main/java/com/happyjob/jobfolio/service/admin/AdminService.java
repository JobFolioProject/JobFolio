package com.happyjob.jobfolio.service.admin;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.happyjob.jobfolio.vo.usermgr.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.happyjob.jobfolio.repository.admin.AdminMapper;
import com.happyjob.jobfolio.vo.usermgr.UserModel;

@Service
public class AdminService {

    private final AdminMapper adminMapper;

    @Autowired
    public AdminService(AdminMapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    // 총 유저 수 반환
    public int getTotalUsers() {
        return adminMapper.countMembersWithStatus();
    }

    // 총 수익 반환
    public int getTotalEarnings() {
        return adminMapper.calculateTotalEarnings();
    }

    // 총 구매자 수 반환
    public int getTotalConsumers() {
        return adminMapper.calculateTotalConsumers();
    }

    // 월별 수익 데이터 반환
    public List<Map<String, Object>> getMonthlyEarnings() {
        return adminMapper.getMonthlyEarnings();
    }

    // 등급별 고객 데이터 반환
    public Map<String, Integer> getConsumerDistribution() {
        Map<String, Object> rawData = adminMapper.calculateUserVIPDistribution();
        // BigDecimal 데이터를 Integer로 변환
        Map<String, Integer> processedData = new HashMap<>();
        processedData.put("VIP1", ((BigDecimal) rawData.get("VIP1")).intValue());
        processedData.put("VIP2", ((BigDecimal) rawData.get("VIP2")).intValue());
        processedData.put("VIP3", ((BigDecimal) rawData.get("VIP3")).intValue());
        processedData.put("NOMAL", ((BigDecimal) rawData.get("NOMAL")).intValue());
        return processedData;
    }

    // 월별 가입 고객 데이터 반환
    public List<Map<String, Object>> getMonthlyMembers() {
        return adminMapper.getMonthlyMembers();
    }

    // Subscribe 페이지 회원 고객 데이터 반환
    public Map<String, Integer> getSubscribeDistribution() {
        Map<String, Object> rawData = adminMapper.getSubscribeDistribution(); // Map<String, Object>로 받음
        Map<String, Integer> processedData = new HashMap<>();

        // BigDecimal 데이터를 Integer로 변환
        processedData.put("GENERAL_USERS", ((BigDecimal) rawData.get("GENERAL_USERS")).intValue());
        processedData.put("SUBSCRIBED_USERS", ((BigDecimal) rawData.get("SUBSCRIBED_USERS")).intValue());

        return processedData; // Map<String, Integer>로 변환 후 반환
    }

    // 모든 회원 정보 조회
    public List<UserModel> getAllMembers() {
        return adminMapper.getAllMembers();
    }

    // 회원 정보 수정
    public int updateMember(UserModel updatedMember) {
        return adminMapper.updateMemberInfo(updatedMember);
    }

    // 회원 비활성화 (STATUS = 'N')
    public int deactivateMember(String memberId) {
        return adminMapper.updateMemberStatus(memberId, "N");
    }

    public int getGeneralUsers() {
        return adminMapper.getGeneralUsers();
    }

    // 사용 기록의 총 카운트 반환
    public int getTotalTasks() {
        return adminMapper.countTotalTasks();
    }

}
