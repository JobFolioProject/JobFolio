package com.happyjob.jobfolio.service.resume;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.happyjob.jobfolio.repository.login.LoginMapper;
import com.happyjob.jobfolio.repository.resume.ResumeMapper;
import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.resume.*;
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
import java.util.Map;

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


    public String getAiComment(ObjectNode root) {
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
                    "Please provide only specific advice on the strengths, weaknesses, and areas for improvement in this resume in Korean\n"
                            + "You do not have to mention the introduction  \n\n"
                            + resumeDataJson
            );

            ObjectNode userMsg = messages.addObject();
            userMsg.put("role", "user");
            userMsg.put("content", userInput);
            String jsonPayload = objectMapper.writeValueAsString(body);
            HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(chatGptApiUrl, request, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "{\"error\":\"서버 내부 오류\"}";
        }

    }

    public List<ResumeInfoVO> selectResumeInfo(Map<String,Object> requestMap) {
        return resumeMapper.selectResumeInfo(requestMap);
    }

    public int selectResumeCount(Map<String,Object> requestMap) {
        return resumeMapper.selectResumeCount(requestMap);
    }

    public List<ResumeInfoVO> resumeLikedList(int user_no) {
        return resumeMapper.resumeLikedList(user_no);
    }

    public int unlikeResume(int user_no, int resume_no) {
        return resumeMapper.unlikeResume(user_no, resume_no);
    }

    public int likeResume(int user_no, int resume_no) {
        return resumeMapper.likeResume(user_no, resume_no);
    }

    public int deleteResume(int resume_no) {
        return resumeMapper.deleteResume(resume_no);
    }

    public int deleteSelectedResume(List<Integer> resume_nos) {
        return resumeMapper.deleteSelectedResume(resume_nos);
    }

    public int insertResumeInfo(ResumeInfoVO resumeInfoVO) {
        return resumeMapper.insertResumeInfo(resumeInfoVO);
    }

    public List<LinkInfoVO> selectLinkInfoByResume(int resume_no) {
        return resumeMapper.selectLinkInfoByResume(resume_no);
    }

    public int insertLinkInfo(LinkInfoVO linkInfoVO) {
        return resumeMapper.insertLinkInfo(linkInfoVO);
    }

    public int selectResumeLikeByResume(int resume_no) {
        return resumeMapper.selectResumeLikeByResume(resume_no);
    }

    public int insertResumeLike(ResumeLikeVO resumeLikeVO) {
        return resumeMapper.insertResumeLike(resumeLikeVO);
    }



    public TemplateVO selectTemplateByNum(int template_no) {
        return resumeMapper.selectTemplateByNum(template_no);
    }

    public int insertTemplate(TemplateVO templateVO) {
        return resumeMapper.insertTemplate(templateVO);
    }

    public UserVO getUserByUserNo(Long userNo) {
        return resumeMapper.getUserByUserNo(userNo);
    }

    // 이력서 목록 조회
    public List<ResumeInfoVO> communityResumeList(Map<String, Object> paramMap) {
        System.out.println(paramMap);
        return resumeMapper.communityResumeList(paramMap);
    }

    ;

//    public ResumeInfoVO selectResumeInfoByResumeNo(int resumeNo) {
//        return  resumeMapper.selectResumeInfoByResumeNo(resumeNo);
//    }

//    // 스킬 목록 조회
//    public List<SkillInfoVO> selectSkillInfoList(long user_no) {
//
//        return resumeMapper.selectSkillInfoList(user_no);}

    public String generateCoverLetter(ObjectNode root) {
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

            String userInput = "";


            //시스템 메시지 추가.
            ObjectNode sysMsg = messages.addObject();
            sysMsg.put("role", "system");
            sysMsg.put("content",
                    "HI, Alex. \n"
                            + "Alex, You are a Career Expert \"Alex\" with a deep understanding of what makes a job application stand out. \n\n"
                            + "I'm a client who has requested your assistance with my self-introduction. \n\n"
                            + "Q. Please use data to create the best possible self-introduction for me.  \n\n"
                            + "Please structure the self-introduction into three paragraphs: an opening, a body, and a conclusion.  \n\n"
                            + "Content for the opening: Create a good impression with the given 'title,' grab attention, and pique curiosity. \n\n"
                            + "Example opening content: \"I am "+ root.get("user_name") +", aspiring to be an expert in the 000 field,\" or \"I am [Your Name], who dreams of growth in the 000 position at your company,\" or \"I am [Your Name], who wishes to grow into a key talent at your company.\" \n\n"
                            + "In the body, appeal to job relevance and competence by leveraging technology. \n\n"
                            + "Utilize academic background and work experience to highlight my strengths, advantages, competencies, and past/future contributions to the company. \n\n"
                            + "Content for the body: Demonstrate an understanding of the company and the role. \n\n"
                            + "Example body content: \"I am applying with deep interest and passion for your company's 000 business (please specifically mention areas of interest).\" \n\n"
                            + "Example body content: \"I wish to participate in your company's 000 project (utilize job-related data) and demonstrate my 000 competencies.\" \n\n"
                            + "Example body content: \"Based on my meticulousness and problem-solving skills, I have achieved results through my 000 experience (connect experience and career).\" \n\n"
                            + "Example body content: \"I wish to contribute to your company's development by utilizing my 000 competencies gained through various project experiences (present various experiences and competencies).\" \n\n"
                            + "Example body content: \"As a talent who grows through continuous learning and challenges, I believe I am well-suited for your company (appeal to growth potential and suitability).\" \n\n"
                            + "Conclusion: Emphasize my strengths, advantages, competencies, and contributions to the company, utilizing my academic background and work experience. \n\n"
                            + "Enrich the content of my self-introduction and re-emphasize the points I want to highlight. \n\n"
                            + "Q. Alex, you are the best expert, so please go through all the above steps to create the best self-introduction in the world, around 1000 characters. \n\n"
                            + "Please create it in Korean. \n\n"
                            + "You can do really well. \n\n"
                            + "let's think step by step. \n\n"
                            + resumeDataJson
            );


            //사용자 메시지 추가.
            ObjectNode userMsg = messages.addObject();
            userMsg.put("role", "user");
            userMsg.put("content", userInput);

            String jsonPayload = objectMapper.writeValueAsString(body);
            HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

            //외부 API호출
            ResponseEntity<String> response = restTemplate.postForEntity(chatGptApiUrl, request, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "{\"error\":\"서버 내부 오류\"}";
        }

    }

    //템플렛 조회하기
    public List<TemplateVO> selectAllTemplates() {
        return resumeMapper.selectAllTemplates();
    }
    public List<String> getSkillGroupCode() {
        return resumeMapper.getSkillGroupCode();
    }

    public List<String> getSkillDetailCode(Map<String, Object> paramMap) {
        return resumeMapper.getSkillDetailCode(paramMap);
    }

}