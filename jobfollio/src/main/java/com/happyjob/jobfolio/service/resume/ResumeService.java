package com.happyjob.jobfolio.service.resume;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.happyjob.jobfolio.repository.resume.ResumeMapper;
import com.happyjob.jobfolio.vo.resume.LinkInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeLikeVO;
import com.happyjob.jobfolio.vo.resume.TemplateVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ResumeService {

    @Value("chatgpt.api.key")
    private String chatGptApiUrl;

    @Autowired
    private ResumeMapper resumeMapper;

    private RestTemplate restTemplate = new RestTemplate();

    public String getChatResponse(String userInput, String apiKey) {
        String userDataJson = "{\n"
                + "  \"name\": \"김민수\",\n"
                + "  \"email\": \"minsu.kim@canva.com\",\n"
                + "  \"phone\": \"010-1234-4567\",\n"
                + "  \"website\": \"minsu-portfolio.com\",\n"
                + "  \"education\": [\n"
                + "    {\"school\": \"Canva University\", \"major\": \"MFA 작업 전공\", \"period\": \"2003.05 ~ 2006.05\"},\n"
                + "    {\"school\": \"Canva University\", \"major\": \"프리 건축\", \"period\": \"2003.03 ~ 2006.03\"},\n"
                + "    {\"school\": \"서울예술고등학교\", \"major\": \"미술과\", \"period\": \"2000.03 ~ 2003.02\"}\n"
                + "  ],\n"
                + "  \"experience\": [\n"
                + "    {\"company\": \"(주)디자인비즈\", \"dept\": \"디자인팀\", \"position\": \"팀 리더\", \"period\": \"2006.06 ~ 현재\"},\n"
                + "    {\"company\": \"(주)아이코드 디자인\", \"dept\": \"디자인팀\", \"position\": \"UI 디자이너\", \"period\": \"2003.05 ~ 2006.05\"}\n"
                + "  ],\n"
                + "  \"certifications\": [\n"
                + "    {\"name\": \"웹디자인 기능사\", \"date\": \"2007.08\"},\n"
                + "    {\"name\": \"컴퓨터그래픽스운용기능사\", \"date\": \"2008.12\"}\n"
                + "  ],\n"
                + "  \"projects\": [\n"
                + "    {\"title\": \"스마트러닝 플랫폼 UI 리뉴얼\", \"description\": \"UX 리서치, XD 프로토타입, 반응형 구현\"},\n"
                + "    {\"title\": \"공공기관 민원포털 고도화\", \"description\": \"접근성 개선, WCAG 2.1 UI 설계\"}\n"
                + "  ],\n"
                + "  \"introduction\": \"저는 15년 이상 UX/UI 디자인 현장에서 일하며 실용성과 심미성을 아우르는 작업을 해왔습니다. 사용자 중심의 문제 해결과 빠른 프로토타이핑 능력을 바탕으로 다양한 프로젝트에 참여했습니다. 지속적인 학습과 협업을 통해 더 나은 사용자 경험을 설계해 나가고자 합니다.\"\n"
                + "}";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        try {
            // 1) JSON Body 생성
            ObjectMapper om = new ObjectMapper();
            ObjectNode body = om.createObjectNode();
            body.put("model", "gpt-3.5-turbo");
            ArrayNode messages = body.putArray("messages");

            // system 메시지: 지시 + template
            ObjectNode sysMsg = messages.addObject();
            sysMsg.put("role", "system");
            String template="";
            sysMsg.put("content",
                    "You are to respond **only** with a fully filled HTML resume template.  \n"
                            + "The template uses CSS class names that exactly match the keys in the user data JSON.  \n"
                            + "- Replace each element’s inner HTML for classes:  \n"
                            + "  • name, email, phone, website  \n"
                            + "  • education (an array you should render as table rows)  \n"
                            + "  • experience (array → table rows)  \n"
                            + "  • certifications (array → table rows)  \n"
                            + "  • projects (array → table rows)  \n"
                            + "Output only the complete HTML document, without any additional explanation.  \n\n"
                            + "User Data JSON:\n" + userDataJson + "\n\n"
                            + "Polish and refine the introduction text for professionalism, make introduction fully enough at least 10 sentences.  \n"
                            + "If data in introduction is not enough, make any data to appeal your self and please fill 10 sentences.  \n"
                            + "Here is the HTML template:\n" + template
            );


            // user 메시지: 실제 이력 정보
            ObjectNode userMsg = messages.addObject();
            userMsg.put("role", "user");
            userMsg.put("content", userInput);

            String jsonPayload = om.writeValueAsString(body);
            HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

            // 2) API 호출
            ResponseEntity<String> response = restTemplate.postForEntity(
                    chatGptApiUrl, request, String.class);

            return response.getBody();

        } catch (HttpClientErrorException e) {

            return "{\"error\":\"ChatGPT API 오류 발생: " + e.getStatusCode() + "\"}";
        } catch (JsonProcessingException e) {
            return "{\"error\":\"서버 JSON 처리 오류\"}";
        } catch (Exception e) {
            return "{\"error\":\"서버 내부 오류\"}";
        }
    }

    public List<ResumeInfoVO> selectResumeInfo(int user_no){
        return resumeMapper.selectResumeInfo(user_no);
    }

    public int insertResumeInfo(ResumeInfoVO resumeInfoVO){
        return resumeMapper.insertResumeInfo(resumeInfoVO);
    }

    public List<LinkInfoVO> selectLinkInfoByResume(int resume_no){
        return resumeMapper.selectLinkInfoByResume(resume_no);
    }

    public int insertLinkInfo(LinkInfoVO linkInfoVO){
        return resumeMapper.insertLinkInfo(linkInfoVO);
    }

    public int selectResumeLikeByResume(int resume_no){
        return resumeMapper.selectResumeLikeByResume(resume_no);
    }

    public int insertResumeLike(ResumeLikeVO resumeLikeVO){
        return resumeMapper.insertResumeLike(resumeLikeVO);
    }

    public List<TemplateVO> selectAllTemplates(){
        return resumeMapper.selectAllTemplates();
    }

    public int insertTemplate(TemplateVO templateVO){
        return resumeMapper.insertTemplate(templateVO);
    }

//    // 스킬 목록 조회
//    public List<SkillInfoVO> selectSkillInfoList(long user_no) {
//
//        return resumeMapper.selectSkillInfoList(user_no);}
}
