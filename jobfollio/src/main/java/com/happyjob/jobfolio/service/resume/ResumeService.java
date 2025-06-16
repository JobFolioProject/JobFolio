package com.happyjob.jobfolio.service.resume;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.happyjob.jobfolio.repository.resume.ResumeMapper;
import com.happyjob.jobfolio.vo.join.UserVO;
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

import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ResumeService {

    @Value("${chatgpt.api.key}")
    private String api_key;

    private String template =
            "<!DOCTYPE html>\n" +
                    "<html lang=\"ko\">\n" +
                    "<head>\n" +
                    "  <meta charset=\"UTF-8\" />\n" +
                    "  <title>이력서 - 템플릿</title>\n" +
                    "  <style>\n" +
                    "    body {\n" +
                    "      font-family: 'Noto Sans KR', sans-serif;\n" +
                    "      margin: 0;\n" +
                    "      padding: 60px;\n" +
                    "      background: #f6f6f6;\n" +
                    "      color: #000;\n" +
                    "    }\n" +
                    "    .container {\n" +
                    "      width: 800px;\n" +
                    "      margin: auto;\n" +
                    "      background: #fff;\n" +
                    "      padding: 40px;\n" +
                    "      box-shadow: 0 0 10px rgba(0,0,0,0.1);\n" +
                    "    }\n" +
                    "    h1 {\n" +
                    "      text-align: center;\n" +
                    "      font-size: 28px;\n" +
                    "      margin-bottom: 40px;\n" +
                    "    }\n" +
                    "    .photo-section {\n" +
                    "      display: flex;\n" +
                    "      align-items: center;\n" +
                    "      margin-bottom: 30px;\n" +
                    "    }\n" +
                    "    .photo-section img {\n" +
                    "      width: 120px;\n" +
                    "      height: 150px;\n" +
                    "      object-fit: cover;\n" +
                    "      border: 1px solid #ccc;\n" +
                    "      margin-right: 20px;\n" +
                    "    }\n" +
                    "    table {\n" +
                    "      width: 100%;\n" +
                    "      border-collapse: collapse;\n" +
                    "      margin-bottom: 30px;\n" +
                    "    }\n" +
                    "    th, td {\n" +
                    "      border: 1px solid #ccc;\n" +
                    "      padding: 10px;\n" +
                    "      text-align: left;\n" +
                    "      font-size: 14px;\n" +
                    "      height: 38px;\n" +
                    "    }\n" +
                    "    th {\n" +
                    "      background-color: #f0f0f0;\n" +
                    "    }\n" +
                    "    .section-title {\n" +
                    "      font-size: 18px;\n" +
                    "      font-weight: bold;\n" +
                    "      margin: 30px 0 10px;\n" +
                    "    }\n" +
                    "  </style>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "  <div class=\"container\">\n" +
                    "    <h1>이력서</h1>\n" +
                    "\n" +
                    "    <div class=\"photo-section\">\n" +
                    "      <img src=\"https://via.placeholder.com/120x150?text=사진\" alt=\"사진\">\n" +
                    "      <table>\n" +
                    "        <tr><th>이름</th><td class=\"name\"></td></tr>\n" +
                    "        <tr><th>이메일</th><td class=\"email\"></td></tr>\n" +
                    "        <tr><th>전화번호</th><td class=\"phone\"></td></tr>\n" +
                    "        <tr><th>홈페이지</th><td class=\"website\"></td></tr>\n" +
                    "      </table>\n" +
                    "    </div>\n" +
                    "\n" +
                    "    <div class=\"section-title\">교육사항</div>\n" +
                    "    <table>\n" +
                    "      <thead>\n" +
                    "        <tr><th>학교명</th><th>전공</th><th>기간</th></tr>\n" +
                    "      </thead>\n" +
                    "      <tbody class=\"education\">\n" +
                    "        <!-- education 배열을 순회하며 <tr><td>...</td></tr> 생성 -->\n" +
                    "      </tbody>\n" +
                    "    </table>\n" +
                    "\n" +
                    "    <div class=\"section-title\">경력사항</div>\n" +
                    "    <table>\n" +
                    "      <thead>\n" +
                    "        <tr><th>회사명</th><th>부서</th><th>직위</th><th>기간</th></tr>\n" +
                    "      </thead>\n" +
                    "      <tbody class=\"experience\">\n" +
                    "        <!-- experience 배열 → <tr> 렌더링 -->\n" +
                    "      </tbody>\n" +
                    "    </table>\n" +
                    "\n" +
                    "    <div class=\"section-title\">언어 및 자격증</div>\n" +
                    "    <table>\n" +
                    "      <thead>\n" +
                    "        <tr><th>항목</th><th>내용</th></tr>\n" +
                    "      </thead>\n" +
                    "      <tbody class=\"certifications\">\n" +
                    "        <!-- certifications 배열 → <tr> 렌더링 -->\n" +
                    "      </tbody>\n" +
                    "    </table>\n" +
                    "\n" +
                    "    <div class=\"section-title\">프로젝트</div>\n" +
                    "    <table>\n" +
                    "      <thead>\n" +
                    "        <tr><th>프로젝트명</th><th>내용</th></tr>\n" +
                    "      </thead>\n" +
                    "      <tbody class=\"projects\">\n" +
                    "        <!-- projects 배열 → <tr> 렌더링 -->\n" +
                    "      </tbody>\n" +
                    "    </table>\n" +
                    "\n" +
                    "    <div class=\"section-title\">자기소개</div>\n" +
                    "    <table>\n" +
                    "      <tr>\n" +
                    "        <td class=\"introduction\" style=\"height: 120px; vertical-align: top;\"></td>\n" +
                    "      </tr>\n" +
                    "    </table>\n" +
                    "  </div>\n" +
                    "</body>\n" +
                    "</html>\n";

    @Autowired
    private ResumeMapper resumeMapper;

    private RestTemplate restTemplate = new RestTemplate();
    private final String chatGptApiUrl = "https://api.openai.com/v1/chat/completions";

    public String getChatResponse(ObjectNode root, String file) {


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(api_key);

        try {

            String filePath = "X:/resume_output/template/test-template 2.html";
            Path path = Paths.get(file);
            try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
                StringBuilder sb = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    sb.append(line).append(System.lineSeparator());
                }
                System.out.println(sb.toString());
                template = sb.toString();
                }

                // 1) JSON Body 생성
                ObjectMapper om = new ObjectMapper();
                ObjectNode body = om.createObjectNode();
                body.put("model", "gpt-3.5-turbo");
                ArrayNode messages = body.putArray("messages");

                String userDataJson = om.writerWithDefaultPrettyPrinter()
                        .writeValueAsString(root);

                String userInput = "";

                // system 메시지: 지시 + template
                ObjectNode sysMsg = messages.addObject();
                sysMsg.put("role", "system");
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
                                + "Here is the HTML template:\n" + template + "\n\n"
                                + "Ensure that all text content inside HTML tags is written in Korean."
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


    public String getAiComment(ObjectNode root){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(api_key);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ObjectNode body = objectMapper.createObjectNode();
            body.put("model", "gpt-3.5-turbo");
            ArrayNode messages = body.putArray("messages");

            String resumeDataJson = objectMapper.writerWithDefaultPrettyPrinter()
                    .writeValueAsString(root);

            String userInput = "제대로하면 10불줄게";
            ObjectNode sysMsg = messages.addObject();
            sysMsg.put("role", "system");
            sysMsg.put("content",
                 "Please provide specific advice on the strengths, weaknesses, and areas for improvement in this resume \n\n"
                    + resumeDataJson
            );

            ObjectNode userMsg = messages.addObject();
            userMsg.put("role", "user");
            userMsg.put("content", userInput);
            String jsonPayload = objectMapper.writeValueAsString(body);
            HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(chatGptApiUrl, request, String.class);
            return response.getBody();
        } catch (Exception e){
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

    public TemplateVO selectTemplateByNum(int template_no){
        return resumeMapper.selectTemplateByNum(template_no);
    }

    public int insertTemplate(TemplateVO templateVO){
        return resumeMapper.insertTemplate(templateVO);
    }

    public UserVO getUserByUserNo(Long userNo) {
        return resumeMapper.getUserByUserNo(userNo);
    }

//    // 스킬 목록 조회
//    public List<SkillInfoVO> selectSkillInfoList(long user_no) {
//
//        return resumeMapper.selectSkillInfoList(user_no);}
}
