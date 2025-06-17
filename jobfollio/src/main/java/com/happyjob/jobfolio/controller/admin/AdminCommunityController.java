package com.happyjob.jobfolio.controller.admin;

import com.happyjob.jobfolio.security.UserPrincipal;
import com.happyjob.jobfolio.service.admin.AdminCommunityService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/community")
public class AdminCommunityController {

    private final AdminCommunityService adminCommunityService;

    @Value("${fileUpload.rootPath}")
    private String rootPath;

    @Value("${fileUpload.noticePath}")
    private String noticePath;

    @Autowired
    public AdminCommunityController(AdminCommunityService adminCommunityService) {
        this.adminCommunityService = adminCommunityService;
    }

    //     공지사항 등록
    @PostMapping("/create")
    public ResponseEntity<CommunityBoardVo> createNotice(
            @RequestBody CommunityBoardVo vo,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        vo.setAuthor(userPrincipal.getUser_no().intValue());
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

    //     공지사항 일괄 삭제
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteNoticeBatch(@RequestBody List<Integer> boardNos) {
        if (boardNos == null || boardNos.isEmpty()) {
            return ResponseEntity.badRequest().build(); // 400 Bad Request
        }

        adminCommunityService.deleteNoticeBatch(boardNos);
        return ResponseEntity.ok().build();
    }

    //     이미지 업로드
    @PostMapping("/upload/image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("image") MultipartFile file
    ) throws IOException {
        // 1) 업로드 루트 + 공지용 서브폴더 결합
        Path uploadDir = Paths.get(rootPath, noticePath);
        System.out.println("=== Upload dir: " + uploadDir.toAbsolutePath());
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            System.out.println("→ Created directory: " + uploadDir.toAbsolutePath());
        } else {
            System.out.println("→ Directory already exists.");
        }

        // 2) 파일명 생성 및 저장
        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String ext = "";
        int idx = original.lastIndexOf('.');
        if (idx > 0) {
            ext = original.substring(idx);
        }
        String filename = UUID.randomUUID().toString() + ext;
        Path target = uploadDir.resolve(filename);
        try (InputStream is = file.getInputStream()) {
            Files.copy(is, target, StandardCopyOption.REPLACE_EXISTING);
        }

        // 3) 클라이언트에 공개할 URL 조합
        String url = "/api/admin/community/image/" + filename;

        Map<String, String> body = new HashMap<>();
        body.put("url", url);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/updatePriority")
    public ResponseEntity<Void> updatePriority(@RequestBody CommunityBoardVo vo) {
        adminCommunityService.updatePriority(vo.getBoardNo(), vo.getPriority());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/updatePriorityBatch")
    public ResponseEntity<Void> updatePriorityBatch(@RequestBody List<CommunityBoardVo> updates) {
        adminCommunityService.updatePriorityBatch(updates);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/unpin")
    public ResponseEntity<Void> unpinBoardList(@RequestBody List<Integer> boardNos) {
        if (boardNos == null || boardNos.isEmpty()) {
            return ResponseEntity.badRequest().build(); // 400
        }

        adminCommunityService.unpinBoardList(boardNos);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/swapPriority")
    public ResponseEntity<Void> swapPriority(@RequestBody Map<String, Integer> payload) {
        int boardNo1 = payload.get("boardNo1");
        int boardNo2 = payload.get("boardNo2");

        adminCommunityService.swapPriority(boardNo1, boardNo2);
        return ResponseEntity.ok().build();
    }
}
