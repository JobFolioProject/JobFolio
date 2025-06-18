package com.happyjob.jobfolio.controller.community;

import com.happyjob.jobfolio.security.UserPrincipal;
import com.happyjob.jobfolio.service.community.CommunityService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Controller
@RequestMapping("/api/community")
public class CommunityController {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private CommunityService communityService;

    @Value("${fileUpload.rootPath}")
    private String rootPath;

    @Value("${fileUpload.noticePath}")
    private String noticePath;

    @RequestMapping("/list")
    @ResponseBody
    public Map<String, Object> communityBoardList(
            Model model,
            @RequestParam Map<String, Object> paramMap,
            @AuthenticationPrincipal UserPrincipal userPrincipal,      // ← 로그인 정보 주입
            HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session
    ) throws Exception {
        logger.info("+ Start " + this.getClass());

        // 1) 파라미터 처리
        String boardType = (String) paramMap.get("boardType");
        String search    = (String) paramMap.get("search");
        paramMap.put("search", search);
        int page     = Integer.parseInt((String) paramMap.getOrDefault("page", "1"));
        int pageSize = Integer.parseInt((String) paramMap.getOrDefault("pageSize", "10"));
        paramMap.put("offset", (page - 1) * pageSize);
        paramMap.put("limit",  pageSize);

        // 2) 로그인 사용자 타입 확인 (A/B 관리자는 모든 글, 그 외는 공개된 글만)
        boolean isAdmin = userPrincipal != null
                && (userPrincipal.getUser_type().equals("A")
                || userPrincipal.getUser_type().equals("B"));
        if (!isAdmin) {
            paramMap.put("statusYn", "Y");   // 비관리자는 공개글만(status_yn='Y')
        }

        // 3) 쿼리 실행
        List<CommunityBoardVo> priorityList = communityService.getPriorityBoardList(paramMap);
        List<CommunityBoardVo> boardList    = communityService.getPagedNormalBoardList(paramMap);
        int totalCount                      = communityService.getNormalBoardTotalCount(paramMap);

        // 4) 결과 반환
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("priorityList", priorityList);
        resultMap.put("boardList",    boardList);
        resultMap.put("totalCount",   totalCount);

        logger.info("+ End " + this.getClass());
        return resultMap;
    }

    @RequestMapping("/detail/{boardNo}")
    @ResponseBody
    public CommunityBoardVo communityBoardDetail(
            @PathVariable("boardNo") int boardNo,
            @AuthenticationPrincipal UserPrincipal userPrincipal   // ← 로그인 정보 주입
    ) throws Exception {
        CommunityBoardVo vo = communityService.getBoardDetail(boardNo);

        // 관리자가 아니면 공개된 글(statusYn='Y')만 허용
        boolean isAdmin = userPrincipal != null
                && (userPrincipal.getUser_type().equals("A")
                || userPrincipal.getUser_type().equals("B"));
        if (!isAdmin && !"Y".equals(vo.getStatusYn())) {
            // 404 처리
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "글을 찾을 수 없습니다.");
        }

        return vo;
    }

    @RequestMapping("/nav/{boardNo}")
    @ResponseBody
    public Map<String, Object> getPrevNextPost(
            @PathVariable("boardNo") int boardNo,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        // 관리자인지 확인 (A 또는 B 권한)
        boolean isAdmin = userPrincipal != null
                && ("A".equals(userPrincipal.getUser_type()) || "B".equals(userPrincipal.getUser_type()));

        // 이전/다음 조회 조건 설정
        Map<String, Object> criteria = new HashMap<>();
        criteria.put("boardNo", boardNo);
        if (!isAdmin) {
            // 일반 사용자는 공개된 글(statusYn='Y')만 보도록 필터
            criteria.put("statusYn", "Y");
        }

        CommunityBoardVo prev = communityService.getPreviousPost(criteria);
        CommunityBoardVo next = communityService.getNextPost(criteria);

        Map<String, Object> result = new HashMap<>();
        result.put("prev", prev);
        result.put("next", next);
        return result;
    }

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) throws IOException {
        Path file = Paths.get(rootPath, noticePath).resolve(filename).normalize();
        Resource resource = new UrlResource(file.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = Files.probeContentType(file);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS))
                .body(resource);
    }
}
