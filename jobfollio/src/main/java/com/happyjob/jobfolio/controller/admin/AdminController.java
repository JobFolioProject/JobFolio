package com.happyjob.jobfolio.controller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.happyjob.jobfolio.service.admin.AdminService;
import com.happyjob.jobfolio.vo.usermgr.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*")
@RequestMapping("/api/admin")
@RestController
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/total-users")
    public ResponseEntity<Integer> getTotalUsers() {
        int totalUsers = adminService.getTotalUsers();
        return ResponseEntity.ok(totalUsers);
    }

    // 총 수익 반환
    @GetMapping("/total-earnings")
    public ResponseEntity<Integer> getTotalEarnings() {
        int totalEarnings = adminService.getTotalEarnings();
        return ResponseEntity.ok(totalEarnings);
    }

    // 총 구매자 수 반환
    @GetMapping("/total-consumers")
    public ResponseEntity<Integer> getTotalConsumers() {
        int totalConsumers = adminService.getTotalConsumers();
        return ResponseEntity.ok(totalConsumers);
    }

    // 모든 고객 정보 조회
    @GetMapping("/customers")
    public ResponseEntity<List<UserModel>> getAllCustomers() {
        try {
            List<UserModel> customers = adminService.getAllMembers();
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 차트1번 월별 수익 데이터 반환
    @GetMapping("/monthly-earnings")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyEarnings() {
        List<Map<String, Object>> monthlyEarnings = adminService.getMonthlyEarnings();
        return ResponseEntity.ok(monthlyEarnings);
    }

    // 차트2번 등급별 고객 정보 조회
    @GetMapping("/consumer-distribution")
    public ResponseEntity<Map<String, Integer>> getConsumerDistribution() {
        Map<String, Integer> distribution = adminService.getConsumerDistribution();
        return ResponseEntity.ok(distribution);
    }

    // 차트3번 월별 가입 고객 정보 조회
    @GetMapping("/monthly-members")
    public ResponseEntity<List<Map<String, Object>>> getMonthlyMembers() {
        List<Map<String, Object>> monthlyMembers = adminService.getMonthlyMembers();
        return ResponseEntity.ok(monthlyMembers);
    }

    // Subscribe 페이지 회원 정보 조회
    @GetMapping("/subscribe-distribution")
    public ResponseEntity<Map<String, Integer>> getSubscribeDistribution() {
        try {
            Map<String, Integer> distribution = adminService.getSubscribeDistribution();
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 고객 수정
    @PutMapping("/customers/{memberId}")
    public ResponseEntity<String> updateCustomer(@PathVariable String memberId, @RequestBody UserModel updatedMember) {
        try {
            updatedMember.setLogin_id(memberId);
            int result = adminService.updateMember(updatedMember);
            if (result > 0) {
                return ResponseEntity.ok("회원 정보가 수정되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("수정 실패.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("오류 발생.");
        }
    }

    // 고객 삭제 (STATUS = 'N')
    @PatchMapping("/customers/{memberId}/deactivate")
    public ResponseEntity<String> deactivateCustomer(@PathVariable String memberId) {
        try {
            int result = adminService.deactivateMember(memberId);
            if (result > 0) {
                return ResponseEntity.ok("회원이 비활성화되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("변경 실패.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("오류 발생.");
        }
    }

    // 서버상태 체크
    @GetMapping("/status-check")
    public ResponseEntity<Map<String, String>> checkServerHealth() {
        try {
            // Java 8 호환 코드
            Map<String, String> healthStatus = new HashMap<>();
            healthStatus.put("status", "UP");
            healthStatus.put("message", "Server is running!");

            return ResponseEntity.ok(healthStatus);
        } catch (Exception e) {
            Map<String, String> downStatus = new HashMap<>();
            downStatus.put("status", "DOWN");
            downStatus.put("message", "Server is not reachable!");

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(downStatus);
        }
    }

    @GetMapping("/general-users")
    public ResponseEntity<Integer> getGeneralUsers() {
        try {
            int generalUsers = adminService.getGeneralUsers();
            return ResponseEntity.ok(generalUsers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 모든 사용 기록의 총 카운트 반환
    @GetMapping("/total-tasks")
    public ResponseEntity<Integer> getTotalTasks() {
        try {
            int totalTasks = adminService.getTotalTasks();
            return ResponseEntity.ok(totalTasks);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/super/system-info")
    public ResponseEntity<Map<String, Object>> getSuperAdminSystemInfo() {
        try {
            Map<String, Object> systemInfo = new HashMap<>();

            systemInfo.put("serverName", "JobFolio Admin Server");
            systemInfo.put("version", "1.0.0");
            systemInfo.put("environment", "Development");
            systemInfo.put("serverTime", java.time.LocalDateTime.now().toString());

            systemInfo.put("totalUsers", adminService.getTotalUsers());
            systemInfo.put("totalEarnings", adminService.getTotalEarnings());
            systemInfo.put("serverStatus", "RUNNING");
            systemInfo.put("databaseConnection", "ACTIVE");

            Map<String, Object> securityInfo = new HashMap<>();
            securityInfo.put("activeTokens", "Protected Information");
            securityInfo.put("lastBackup", "2025-06-14 23:00:00");
            securityInfo.put("securityLevel", "HIGH");
            systemInfo.put("securityInfo", securityInfo);

            return ResponseEntity.ok(systemInfo);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "시스템 정보 조회 중 오류가 발생했습니다.");
            errorResponse.put("message", "최고관리자에게 문의하세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}