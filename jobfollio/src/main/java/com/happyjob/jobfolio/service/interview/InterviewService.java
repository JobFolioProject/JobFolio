package com.happyjob.jobfolio.service.interview;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class InterviewService {

    private static final Logger logger = LogManager.getLogger(InterviewService.class);
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${chatgpt.api.key}")
    private String CHATGPT_API_KEY;

    // OpenAI API 엔드포인트
    private final String chatGptApiUrl = "https://api.openai.com/v1/chat/completions";
    private final RestTemplate restTemplate = new RestTemplate();

    // OpenAI ChatGPT API 직접 호출
    private String callOpenAI(String prompt, String apiKey) throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // API에 전달할 JSON 본문 구성
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4"); // 필요에 따라 "gpt-4o", "gpt-4o-mini" 등으로 변경 가능

        // 메시지 배열 생성 (user role)
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        messages.add(userMsg);

        body.put("messages", messages);

        String json = mapper.writeValueAsString(body);
        HttpEntity<String> req = new HttpEntity<>(json, headers);

        ResponseEntity<String> res = restTemplate.exchange(chatGptApiUrl, HttpMethod.POST, req, String.class);
        return res.getBody();
    }

    // 1. 첫 질문 생성
    public Map<String, Object> generateInterview(String introduce, String company, String position) throws Exception {
        String prompt = String.format(
                "%s , 이건 저의 1분 자기소개입니다 %s 회사의 %s 직무 면접관이라면 어떤 질문을 5개나 묻겠습니까? 번호를 붙여서 알려주세요.",
                introduce, company, position
        );

        String answer = callOpenAI(prompt, CHATGPT_API_KEY);

        Map<String,Object> map = new HashMap<>();
        map.put("result", "Y");
        map.put("answer", answer);
        return map;
    }

    // 2. 추가 질문 생성 (offset 기반)
    public Map<String, Object> generateMore(String introduce, String company, String position, int offset) throws Exception {
        String prompt = String.format(
                "%s , 이건 저의 1분 자기소개입니다. %s 회사의 %s 직무 면접관이라면 이전 %d문항을 제외한 다음 5개의 질문을 번호를 붙여서 알려주세요.",
                introduce, company, position, offset
        );

        String answer = callOpenAI(prompt, CHATGPT_API_KEY);

        Map<String,Object> map = new HashMap<>();
        map.put("result", "Y");
        map.put("answer", answer);
        return map;
    }

    // 3. 답변 평가/피드백
    public String evaluateAnswer(String question, String answer) throws Exception {
        String prompt = String.format(
                "다음 면접 질문에 대한 지원자의 답변을 평가하고, " +
                        "간단한 총평을 feedback 으로, 그리고 구체적인 개선할 점을 improvements 로 설정해서 " +
                        "JSON 형태로 feedback과 improvements만 나오게 응답하는데, 내용은 한글로 나오게 해주세요. " +
                        "질문: %s " +
                        "답변: %s",
                question, answer
        );

        String fullResponse = callOpenAI(prompt, CHATGPT_API_KEY);
        logger.info("fullResponse: " + fullResponse);

        // OpenAI 응답에서 content 추출
        JsonNode root = mapper.readTree(fullResponse);
        JsonNode contentNode = root.path("choices").get(0).path("message").path("content");
        String contentJson = contentNode.asText();
        logger.info("contentNode.asText(): " + contentJson);

        // content 안의 JSON 파싱
        JsonNode resultNode = mapper.readTree(contentJson);
        String feedback     = resultNode.path("feedback").asText("피드백을 받아오는 데 실패했습니다.");
        String improvements = resultNode.path("improvements").asText("개선할 점을 받아오는 데 실패했습니다.");

        // 결과 JSON 리턴
        ObjectNode result = mapper.createObjectNode();
        result.put("feedback", feedback);
        result.put("improvements", improvements);
        String ret = result.toString();
        logger.info("evaluateAnswer() 리턴 JSON: " + ret);
        return ret;
    }
}
