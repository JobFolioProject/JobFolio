package com.happyjob.jobfolio.controller.community;

import com.happyjob.jobfolio.service.community.CommunityService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/community")
public class CommunityController {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();

    @Autowired
    private CommunityService communityService;

    @Value("${fileUpload.rootPath}")
    private String rootPath;

    @Value("${fileUpload.noticePath}")
    private String noticePath;

    @RequestMapping("/list")
    @ResponseBody
    public Map<String, Object> communityBoardList(Model model, @RequestParam Map<String, Object> paramMap,
                                                  HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

        logger.info("+ Start " + className);
        logger.info("   - paramMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<>();

        String boardType = (String) paramMap.get("boardType");
        String search = (String) paramMap.get("search");
        paramMap.put("search", search);

        int page = 1;
        int pageSize = 10;

        try {
            String pageStr = (String) paramMap.get("page");
            String pageSizeStr = (String) paramMap.get("pageSize");
            if (pageStr != null && !pageStr.isEmpty()) page = Integer.parseInt(pageStr);
            if (pageSizeStr != null && !pageSizeStr.isEmpty()) pageSize = Integer.parseInt(pageSizeStr);
        } catch (NumberFormatException e) {
            logger.error("잘못된 페이지 파라미터", e);
            resultMap.put("error", "잘못된 요청입니다.");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            return resultMap;
        }

        int offset = (page - 1) * pageSize;
        paramMap.put("offset", offset);
        paramMap.put("limit", pageSize);

        List<CommunityBoardVo> priorityList = communityService.getPriorityBoardList(paramMap);
        List<CommunityBoardVo> boardList = communityService.getPagedNormalBoardList(paramMap);
        int totalCount = communityService.getNormalBoardTotalCount(paramMap);

        resultMap.put("priorityList", priorityList);
        resultMap.put("boardList", boardList);
        resultMap.put("totalCount", totalCount);

        logger.info("+ End " + className);

        return resultMap;
    }

    @RequestMapping("/detail/{boardNo}")
    @ResponseBody
    public CommunityBoardVo communityBoardDetail(@PathVariable("boardNo") int boardNo) throws Exception {
        return communityService.getBoardDetail(boardNo);
    }

    @RequestMapping("/nav/{boardNo}")
    @ResponseBody
    public Map<String, Object> getPrevNextPost(@PathVariable("boardNo") int boardNo) {
        CommunityBoardVo prev = communityService.getPreviousPost(boardNo);
        CommunityBoardVo next = communityService.getNextPost(boardNo);

        Map<String, Object> result = new HashMap<>();
        result.put("prev", prev);
        result.put("next", next);

        return result;
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
