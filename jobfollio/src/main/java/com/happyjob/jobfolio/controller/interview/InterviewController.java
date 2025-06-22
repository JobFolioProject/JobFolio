package com.happyjob.jobfolio.controller.interview;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyjob.jobfolio.service.interview.InterviewService;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    // Log4j 1.x 로거 선언
    private static final Logger logger = LogManager.getLogger(InterviewController.class);

    @Autowired
    private InterviewService interviewService;

    private final ObjectMapper mapper = new ObjectMapper();

    // 첫 질문 생성
    @PostMapping("/generate")
    public Map<String, Object> generateInterview(
            @RequestBody Map<String, String> payload
    ) {
        String introduce    = payload.get("introduce");
        String applyCompany = payload.get("applyCompany");
        String applyPosition= payload.get("applyPosition");

        logger.info("generateInterview 호출: introduce=" + introduce
                + ", applyCompany=" + applyCompany
                + ", applyPosition=" + applyPosition);

        Map<String, Object> result = new HashMap<>();
        try {
            result = interviewService.generateInterview(introduce, applyCompany, applyPosition);
            logger.info("generateInterview 성공: " + result);
        } catch (Exception e) {
            logger.error("generateInterview 실패", e);
            result.put("result", "N");
            result.put("answer", "면접 질문 생성 중 오류가 발생했습니다.");
        }
        return result;
    }

    // 추가 질문 생성 (offset 기반)
    @PostMapping("/generateMore")
    public Map<String, Object> generateMore(
            @RequestBody Map<String, Object> payload
    ) {
        String introduce     = (String) payload.get("introduce");
        String applyCompany  = (String) payload.get("applyCompany");
        String applyPosition = (String) payload.get("applyPosition");
        Integer offset       = (Integer) payload.get("offset");

        logger.info("generateMore 호출: offset=" + offset);

        Map<String, Object> result = new HashMap<>();
        try {
            result = interviewService.generateMore(introduce, applyCompany, applyPosition, offset);
            logger.info("generateMore 성공: " + result);
        } catch (Exception e) {
            logger.error("generateMore 실패", e);
            result.put("result", "N");
            result.put("answer", "추가 면접 질문 생성 중 오류가 발생했습니다.");
        }
        return result;
    }

    // 답변을 평가 및 피드백
    @PostMapping("/evaluate")
    public Map<String, Object> evaluateAnswer(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        String answer   = payload.get("answer");

        logger.info("evaluateAnswer 호출: question=" + question + ", answer=" + answer);

        Map<String,Object> out = new HashMap<>();
        try {
            String json = interviewService.evaluateAnswer(question, answer);
            @SuppressWarnings("unchecked")
            Map<String,Object> parsed = mapper.readValue(json, Map.class);
            out.putAll(parsed);
            logger.info("evaluateAnswer 성공: " + parsed);
        } catch (Exception e) {
            logger.error("evaluateAnswer 실패", e);
            out.put("feedback",     "피드백 생성 중 오류가 발생했습니다.");
            out.put("improvements","");
        }
        return out;
    }
}
