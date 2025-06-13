package com.happyjob.jobfolio.controller.community;

import com.happyjob.jobfolio.service.community.CommunityService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
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

    @RequestMapping("/list")
    @ResponseBody
    public Map<String, Object> communityBoardList(Model model, @RequestParam Map<String, Object> paramMap,
                                                     HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

        logger.info("+ Start " + className);
        logger.info("   - paramMap : " + paramMap);

        String boardType = (String) paramMap.get("boardType");
        String search = (String) paramMap.get("search");
        paramMap.put("search", search);

        int page = Integer.parseInt((String) paramMap.getOrDefault("page", "1"));
        int pageSize = Integer.parseInt((String) paramMap.getOrDefault("pageSize", "10"));
        int offset = (page - 1) * pageSize;

        paramMap.put("offset", offset);
        paramMap.put("limit", pageSize);

        List<CommunityBoardVo> boardList = communityService.getCommunityBoardPaged(paramMap);
        int totalCount = communityService.getBoardTotalCount(paramMap);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("boardList", boardList);
        resultMap.put("totalCount", totalCount);
        logger.info("+ End " + className);

        return resultMap;
    }
}
