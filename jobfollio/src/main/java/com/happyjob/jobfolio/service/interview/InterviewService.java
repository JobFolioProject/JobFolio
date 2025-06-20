package com.happyjob.jobfolio.service.interview;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.happyjob.jobfolio.service.chatgpt.ChatgptService;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InterviewService {

    @Autowired
    private ChatgptService chatgptService;

    private final ObjectMapper mapper = new ObjectMapper();

    // Log4j 로거
    private static final Logger logger = LogManager.getLogger(InterviewService.class);

    @Value("${chatgpt.api.key}")
    private String CHATGPT_API_KEY;

    public Map<String, Object> generateInterview(String introduce,
                                                 String company,
                                                 String position) throws Exception {

        // 1) 프롬프트 조합
        String rawPrompt = String.format(
                "%s , 이건 저의 1분 자기소개입니다 %s 회사의 %s 직무 면접관이라면 어떤 질문을 5개나 묻겠습니까? 번호를 붙여서 알려주세요.",
                introduce, company, position
        );

        // 2) JSON 이스케이프
        // ObjectMapper 를 이용해 JSON 문자열로 만들어주고, 양 끝의 따옴표를 제거합니다.
        String quoted = mapper.writeValueAsString(rawPrompt);
        String escapedPrompt = quoted.substring(1, quoted.length() - 1);

        // 3) ChatGPT 4 API 호출 (escapedPrompt 를 넘깁니다)
        String answer = chatgptService.getChatResponse4(escapedPrompt, CHATGPT_API_KEY);

        // 4) 결과 맵에 담아서 반환
        Map<String,Object> map = new HashMap<>();
        map.put("result", "Y");
        map.put("answer", answer);
        return map;
    }

    public Map<String, Object> generateMore(String introduce,
                                            String company,
                                            String position,
                                            int offset) throws Exception {
        String userPrompt = String.format(
                "%s , 이건 저의 1분 자기소개입니다. %s 회사의 %s 직무 면접관이라면 이전 %d문항을 제외한 다음 5개의 질문을 번호를 붙여서 알려주세요.",
                introduce, company, position, offset
        );
        String answer = chatgptService.getChatResponse4(userPrompt, CHATGPT_API_KEY);

        Map<String,Object> map = new HashMap<>();
        map.put("result", "Y");
        map.put("answer", answer);
        return map;
    }

    public String evaluateAnswer(String question, String answer) throws Exception {
        // 1) 프롬프트를 간단하게 재구성 (큰따옴표나 중괄호 제거)
        String userPrompt = String.format(
                "다음 면접 질문에 대한 지원자의 답변을 평가하고, " +
                        "간단한 총평을 feedback 으로, 그리고 구체적인 개선할 점을 improvements 로 설정해서 " +
                        "JSON 형태로 feedback과 improvements만 나오게 응답하는데, 내용은 한글로 나오게 해주세요. " +
                        "질문: %s " +
                        "답변: %s",
                question, answer
        );

        // 2) ChatGPT-4 호출
        String fullResponse = chatgptService.getChatResponse4(userPrompt, CHATGPT_API_KEY);
        logger.info("■ fullResponse: " + fullResponse);

        // 3) ChatGPT가 내보낸 텍스트(choices[0].message.content)만 가져오기
        JsonNode root = mapper.readTree(fullResponse);
        JsonNode contentNode = root
                .path("choices").get(0)
                .path("message").path("content");
        String contentJson = contentNode.asText();
        logger.info("■ contentNode.asText(): " + contentJson);

        // 4) 그 JSON 텍스트를 파싱
        JsonNode resultNode = mapper.readTree(contentJson);
        String feedback     = resultNode.path("feedback")
                .asText("피드백을 받아오는 데 실패했습니다.");
        String improvements = resultNode.path("improvements")
                .asText("개선할 점을 받아오는 데 실패했습니다.");

        // 5) 컨트롤러에 보낼 JSON 문자열로 직렬화
        ObjectNode result = mapper.createObjectNode();
        result.put("feedback",    feedback);
        result.put("improvements", improvements);
        String ret = result.toString();
        logger.info("■ evaluateAnswer() 리턴 JSON: " + ret);
        return ret;
    }
}
