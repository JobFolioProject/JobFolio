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

import javax.transaction.Transactional;

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
    public Map<String,Integer> getConsumerDistribution() {
        // 1) 매퍼 호출
        Map<String,Object> raw = adminMapper.getConsumerDistribution();
        if (raw == null) {
            raw = new HashMap<>();
        }

        // 2) Object → int 안전 변환 헬퍼
        //    (BigDecimal, Long, Integer 모두 처리)
        Map<String,Integer> result = new HashMap<>();
        result.put("normal",                 toInt(raw.get("normal")));
        result.put("subscribe1",             toInt(raw.get("subscribe1")));
        result.put("subscribe2",             toInt(raw.get("subscribe2")));
        result.put("subscribe3",             toInt(raw.get("subscribe3")));
        result.put("expire_days_null_count", toInt(raw.get("expire_days_null_count")));
        return result;
    }

    /** null-safe Object → int */
    private int toInt(Object obj) {
        if (obj == null) return 0;
        if (obj instanceof Number) {
            return ((Number) obj).intValue();
        }
        try {
            return Integer.parseInt(obj.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
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

    // 회원 목록 필터 및 페이지
    public List<UserModel> getFillterAndPageCustomers(Map<String, Object> paramMap) {
        return adminMapper.selectFillterAndPageCustomers(paramMap);
    }
    // 회원 전체 인원 수
    public int getTotalCustomerCount(Map<String, Object> paramMap) {
        return adminMapper.selectTotalCustomerCount(paramMap);
    }

    public UserModel getMemberById(String memberId) {
        if (memberId == null || memberId.trim().isEmpty()) {
            return null;
        }
        return adminMapper.getMemberById(memberId);
    }

    @Transactional
    public int changeUserAuthority(String memberId, String newAuthority, String currentUserType) {
        if (memberId == null || memberId.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        if (!"A".equals(currentUserType)) {
            throw new IllegalArgumentException("권한 변경은 슈퍼관리자(A)만 가능합니다.");
        }

        if (!"B".equals(newAuthority) && !"C".equals(newAuthority)) {
            throw new IllegalArgumentException("B(하위관리자) 또는 C(일반) 권한만 설정 가능합니다.");
        }

        // 기존 회원 확인
        UserModel existingMember = getMemberById(memberId);
        if (existingMember == null) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }

        // A 계정의 권한은 변경할 수 없음
        if ("A".equals(existingMember.getUser_type())) {
            throw new IllegalArgumentException("슈퍼관리자(A) 계정의 권한은 변경할 수 없습니다.");
        }

        return adminMapper.updateUserAuthority(memberId, newAuthority);
    }

    // 사용자 탈퇴 처리 (N → Y, withdrawal_date 현재시간 설정)
    @Transactional
    public int withdrawUser(String memberId, String currentUserType, String targetUserType) {
        if (memberId == null || memberId.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        // 기존 회원 확인
        UserModel existingMember = getMemberById(memberId);
        if (existingMember == null) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }

        // 권한별 탈퇴 가능 대상 체크 (서비스 레벨에서 이중 체크)
        if ("A".equals(currentUserType)) {
            if ("A".equals(targetUserType)) {
                throw new IllegalArgumentException("슈퍼관리자(A) 계정은 탈퇴시킬 수 없습니다.");
            }
        } else if ("B".equals(currentUserType)) {
            if ("A".equals(targetUserType) || "B".equals(targetUserType)) {
                throw new IllegalArgumentException("권한이 부족합니다.");
            }
        } else {
            throw new IllegalArgumentException("일반 사용자는 다른 사용자를 탈퇴시킬 수 없습니다.");
        }

        return adminMapper.withdrawUser(memberId);
    }

    @Transactional
    public int restoreUser(String memberId, String currentUserType, String targetUserType) {
        if (memberId == null || memberId.trim().isEmpty()) {
            throw new IllegalArgumentException("사용자 ID가 필요합니다.");
        }

        UserModel existingMember = getMemberById(memberId);
        if (existingMember == null) {
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }

        if ("A".equals(currentUserType)) {
            if ("A".equals(targetUserType)) {
                throw new IllegalArgumentException("슈퍼관리자(A) 계정은 복구할 수 없습니다.");
            }
        } else if ("B".equals(currentUserType)) {
            if ("A".equals(targetUserType) || "B".equals(targetUserType)) {
                throw new IllegalArgumentException("권한이 부족합니다.");
            }
        } else {
            throw new IllegalArgumentException("일반 사용자는 다른 사용자를 복구할 수 없습니다.");
        }

        return adminMapper.restoreUser(memberId);
    }
}
