package com.happyjob.jobfolio.controller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.happyjob.jobfolio.security.UserPrincipal;
import com.happyjob.jobfolio.service.admin.AdminService;
import com.happyjob.jobfolio.vo.admin.CustomerListDto;
import com.happyjob.jobfolio.vo.usermgr.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> updateCustomer(@PathVariable String memberId,
                                                 @RequestBody UserModel updatedMember,
                                                 @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String currentUserType = userPrincipal.getUser_type();

            UserModel targetUser = adminService.getMemberById(memberId);
            if (targetUser == null) {
                return ResponseEntity.badRequest().body("존재하지 않는 사용자입니다.");
            }

            String targetUserType = targetUser.getUser_type();

            if ("A".equals(currentUserType)) {
            } else if ("B".equals(currentUserType)) {
                if ("A".equals(targetUserType) || "B".equals(targetUserType)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("관리자 계정은 수정할 수 없습니다.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("일반 사용자는 다른 사용자를 수정할 수 없습니다.");
            }

            if (updatedMember.getUser_type() != null &&
                    !targetUser.getUser_type().equals(updatedMember.getUser_type())) {
                return ResponseEntity.badRequest().body("권한 변경은 별도 API를 사용해주세요.");
            }

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

    // 모든 사용자 수, 모든 사용자 목록 조회 ( 필터 )
    @GetMapping("/customers/list")
    public ResponseEntity<CustomerListDto> getAllCustomers(@RequestParam(required = false) String search,
                                                           @RequestParam(required = false) String type,
                                                           @RequestParam(defaultValue = "1") int page,
                                                           @RequestParam(defaultValue  = "10") int limit,
                                                           @RequestParam(required = false) String status) {
        try {
            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put("search", search);
            paramMap.put("type", type);
            paramMap.put("status", status);
            int offset = (page - 1) * limit;
            paramMap.put("offset", offset);
            paramMap.put("limit", limit);
            paramMap.put("page", page);

            // 서비스 계층
            List<UserModel> customers = adminService.getFillterAndPageCustomers(paramMap);
            int totalCount = adminService.getTotalCustomerCount(paramMap);

            return ResponseEntity.ok(new CustomerListDto(customers,totalCount));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 특정 사용자 상세 정보 조회
    @GetMapping("/customers/{memberId}")
    public ResponseEntity<?> getCustomerDetail(@PathVariable String memberId) {
        try {
            UserModel customer = adminService.getMemberById(memberId);
            if (customer == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    // 사용자 권한 변경 (C ↔ B)
    @PatchMapping("/customers/{memberId}/change-authority")
    public ResponseEntity<String> changeUserAuthority(@PathVariable String memberId,
                                                      @RequestBody Map<String, String> request,
                                                      @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            // A권한만 권한 변경 가능
            if (!"A".equals(userPrincipal.getUser_type())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 변경은 슈퍼관리자(A)만 가능합니다.");
            }

            String newAuthority = request.get("user_type");

            // B(하위관리자), C(일반) 권한만 허용
            if (!"B".equals(newAuthority) && !"C".equals(newAuthority)) {
                return ResponseEntity.badRequest().body("B(하위관리자) 또는 C(일반) 권한만 설정 가능합니다.");
            }

            int result = adminService.changeUserAuthority(memberId, newAuthority, userPrincipal.getUser_type());
            if (result > 0) {
                return ResponseEntity.ok("사용자 권한이 변경되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("권한 변경에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("오류 발생: " + e.getMessage());
        }
    }

    // 사용자 탈퇴 처리 (N → Y)
    @PatchMapping("/customers/{memberId}/withdraw")
    public ResponseEntity<String> withdrawUser(@PathVariable String memberId,
                                               @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String currentUserType = userPrincipal.getUser_type();

            UserModel targetUser = adminService.getMemberById(memberId);
            if (targetUser == null) {
                return ResponseEntity.badRequest().body("존재하지 않는 사용자입니다.");
            }

            String targetUserType = targetUser.getUser_type();

            if ("A".equals(currentUserType)) {
                if ("A".equals(targetUserType)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("슈퍼관리자(A) 계정은 탈퇴시킬 수 없습니다.");
                }
            } else if ("B".equals(currentUserType)) {
                if ("A".equals(targetUserType) || "B".equals(targetUserType)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("권한이 부족합니다.");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("일반 사용자는 다른 사용자를 탈퇴시킬 수 없습니다.");
            }

            int result = adminService.withdrawUser(memberId, currentUserType, targetUserType);
            if (result > 0) {
                return ResponseEntity.ok("사용자가 탈퇴 처리되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("탈퇴 처리에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("오류 발생: " + e.getMessage());
        }
    }

    // 탈퇴 사용자 복구 (Y → N)
    @PatchMapping("/customers/{memberId}/restore")
    public ResponseEntity<String> restoreUser(@PathVariable String memberId,
                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            String currentUserType = userPrincipal.getUser_type();

            UserModel targetUser = adminService.getMemberById(memberId);
            if (targetUser == null) {
                return ResponseEntity.badRequest().body("존재하지 않는 사용자입니다.");
            }

            String targetUserType = targetUser.getUser_type();

            if ("A".equals(currentUserType)) {
                if ("A".equals(targetUserType)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("슈퍼관리자(A) 계정은 복구할 수 없습니다.");
                }
            } else if ("B".equals(currentUserType)) {
                if ("A".equals(targetUserType) || "B".equals(targetUserType)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("권한이 부족합니다");
                }
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("일반 사용자는 다른 사용자를 복구할 수 없습니다.");
            }

            int result = adminService.restoreUser(memberId, currentUserType, targetUserType);
            if (result > 0) {
                return ResponseEntity.ok("사용자가 복구되었습니다.");
            } else {
                return ResponseEntity.badRequest().body("복구에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("오류 발생: " + e.getMessage());
        }
    }

}
