package com.happyjob.jobfolio.controller.admin;

import com.happyjob.jobfolio.security.UserPrincipal;
import com.happyjob.jobfolio.service.admin.AdminCommunityService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import com.happyjob.jobfolio.vo.community.FileInfoVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
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

    // 공지사항 등록
    @PostMapping("/create")
    public ResponseEntity<CommunityBoardVo> createNotice(
            @RequestBody CommunityBoardVo vo,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        vo.setAuthor(userPrincipal.getUser_no().intValue());
        CommunityBoardVo created = adminCommunityService.createNotice(vo);
        return ResponseEntity.ok(created);
    }

    // 공지사항 수정
    @PutMapping("/update")
    public ResponseEntity<CommunityBoardVo> updateNotice(@RequestBody CommunityBoardVo vo) {
        CommunityBoardVo updated = adminCommunityService.updateNotice(vo);
        return ResponseEntity.ok(updated);
    }

    // 공지사항 삭제 (단건)
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteNotice(@RequestParam("boardNo") int boardNo) {
        adminCommunityService.deleteNotice(boardNo);
        return ResponseEntity.ok().build();
    }

    // 공지사항 삭제 (일괄)
    @DeleteMapping("/deleteBatch")
    public ResponseEntity<Void> deleteNoticeBatch(@RequestBody List<Integer> boardNos) {
        if (boardNos == null || boardNos.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        adminCommunityService.deleteNoticeBatch(boardNos);
        return ResponseEntity.ok().build();
    }

    // 이미지 업로드
    @PostMapping(
            value    = "/upload/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("image") MultipartFile file
    ) throws IOException {
        Path uploadDir = Paths.get(rootPath, noticePath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

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

        String url = "/api/community/image/" + filename;
        Map<String, String> body = new HashMap<>();
        body.put("url", url);
        return ResponseEntity.ok(body);
    }

    // 업로드한 이미지 삭제 */
    @DeleteMapping("/delete/image")
    public ResponseEntity<Void> deleteUploadedImage(
            @RequestParam("filename") String filename) throws IOException {

        // 1) 물리 파일 삭제
        Path phys = Paths.get(rootPath, noticePath, filename);
        Files.deleteIfExists(phys);

        // 2) DB에 기록된 메타 삭제 (이미 saveImageFileInfo에서만 저장되기 때문에
        //    create 직후라면 레코드가 없을 수도 있지만, 있으면 삭제)
        FileInfoVo vo = new FileInfoVo();
        vo.setBoardNo(0); // boardNo 모를 땐 0으로 넘기고,
        vo.setFileName(filename);
        adminCommunityService.deleteFileInfoByFilename(vo);

        return ResponseEntity.ok().build();
    }

    // 우선순위 단건 변경
    @PostMapping("/updatePriority")
    public ResponseEntity<Void> updatePriority(@RequestBody CommunityBoardVo vo) {
        adminCommunityService.updatePriority(vo.getBoardNo(), vo.getPriority());
        return ResponseEntity.ok().build();
    }

    // 우선순위 일괄 변경
    @PostMapping("/updatePriorityBatch")
    public ResponseEntity<Void> updatePriorityBatch(@RequestBody List<CommunityBoardVo> updates) {
        adminCommunityService.updatePriorityBatch(updates);
        return ResponseEntity.ok().build();
    }

    // 공지 고정 해제
    @PostMapping("/unpin")
    public ResponseEntity<Void> unpinBoardList(@RequestBody List<Integer> boardNos) {
        if (boardNos == null || boardNos.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        adminCommunityService.unpinBoardList(boardNos);
        return ResponseEntity.ok().build();
    }

    // 우선순위 스왑
    @PostMapping("/swapPriority")
    public ResponseEntity<Void> swapPriority(@RequestBody Map<String, Integer> payload) {
        int boardNo1 = payload.get("boardNo1");
        int boardNo2 = payload.get("boardNo2");
        adminCommunityService.swapPriority(boardNo1, boardNo2);
        return ResponseEntity.ok().build();
    }

    // 공개/비공개 토글
    @PostMapping("/toggleStatus")
    public ResponseEntity<Void> toggleStatus(@RequestBody CommunityBoardVo vo) {
        if (vo.getBoardNo() == 0 || vo.getStatusYn() == null) {
            return ResponseEntity.badRequest().build();
        }
        adminCommunityService.updateStatusYn(vo.getBoardNo(), vo.getStatusYn());
        return ResponseEntity.ok().build();
    }
}
