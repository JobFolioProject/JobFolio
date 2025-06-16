package com.happyjob.jobfolio.controller.admin;

import com.happyjob.jobfolio.service.admin.AdminCommunityService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<CommunityBoardVo> createNotice(@RequestBody CommunityBoardVo vo) {
        // 일단 하드코딩, security 설정 되면 변경 필요
        vo.setAuthor(1);
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

    //      업로드된 공지 이미지 반환
    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
        Path file = Paths.get(rootPath, noticePath).resolve(filename).normalize();
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        // MIME 타입을 유추해서 설정할 수도 있습니다.
        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }
}
