package com.happyjob.jobfolio.controller.admin;

import com.happyjob.jobfolio.service.admin.AdminCommunityService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/community")
public class AdminCommunityController {

    private final AdminCommunityService adminCommunityService;

    @Autowired
    public AdminCommunityController(AdminCommunityService adminCommunityService) {
        this.adminCommunityService = adminCommunityService;
    }

    //     공지사항 등록
    @PostMapping("/create")
    public ResponseEntity<CommunityBoardVo> createNotice(@RequestBody CommunityBoardVo vo) {
        CommunityBoardVo created = adminCommunityService.createNotice(vo);
        return ResponseEntity.ok(created);
    }

    //     공지사항 수정
    @PutMapping("/update")
    public ResponseEntity<CommunityBoardVo> updateNotice(@RequestBody CommunityBoardVo vo) {
        CommunityBoardVo updated = adminCommunityService.updateNotice(vo);
        return ResponseEntity.ok(updated);
    }

    //     공지사항 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteNotice(@RequestParam("boardNo") int boardNo) {
        adminCommunityService.deleteNotice(boardNo);
        return ResponseEntity.ok().build();
    }
}
