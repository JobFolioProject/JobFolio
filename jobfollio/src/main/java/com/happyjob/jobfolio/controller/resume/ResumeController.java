package com.happyjob.jobfolio.controller.resume;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.happyjob.jobfolio.repository.mypage.MypageMapper;
import com.happyjob.jobfolio.security.UserPrincipal;
import com.happyjob.jobfolio.service.join.UserService;
import com.happyjob.jobfolio.service.resume.ResumeService;
import com.happyjob.jobfolio.vo.community.CommunityBoardVo;
import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.CertificateVO;
import com.happyjob.jobfolio.vo.mypage.CommSkillDto;
import com.happyjob.jobfolio.vo.mypage.LanguageSkillVO;
import com.happyjob.jobfolio.vo.resume.AiResumeGenerateVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import com.happyjob.jobfolio.vo.resume.TemplateVO;
import com.mysql.fabric.Response;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import java.io.ByteArrayOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private MypageMapper mypageMapper;

    @Autowired
    private UserService userService;

    @RequestMapping("/selectResumeInfo")
    public Map<String, Object> selectResumeInfo(@RequestParam int user_no) {
        Map<String, Object> resultMap = new HashMap<>();

        return resultMap;
    }


//    // 이력서 작성 페이지에 해당 유저의 스킬목록을 조회
//    @RequestMapping("/write")
//    public Map<String,Object> skillInfoResume(@RequestParam int user_no){
//        Map<String,Object> resultMap = new HashMap<>();
//        return resultMap;
//    }


    @RequestMapping("/insertResumeInfo")
    public Map<String, Object> insertResumeInfo(@RequestBody Map<String, Object> paramMap) {
        Map<String, Object> resultMap = new HashMap<>();

        ResumeInfoVO resumeInfoVO = new ResumeInfoVO();
        Long user_no = Long.valueOf(paramMap.get("user_no").toString());

        try {


            // 2) JSON 생성 로직
            ObjectMapper mapper = new ObjectMapper();

            String htmlContent = paramMap.get("htmlString").toString();


            // ❶ 저장할 경로 생성
            String outputDir = "X:/resume_output/resume_made";
            // ❶ 타임스탬프 포맷터
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
            // ❷ 현재 날짜·시간 문자열
            String timestamp = LocalDateTime.now().format(formatter);
            // ❸ 파일명에 user_no와 timestamp 결합
            String fileName = "resume_" + user_no + "_" + timestamp + ".html";
            Path dirPath = Paths.get(outputDir);
            Path filePath = dirPath.resolve(fileName);

            if (Files.notExists(dirPath)) {
                Files.createDirectories(dirPath);
            }
            // ❸ JDK 8 호환 방식으로 쓰기
            byte[] bytes = htmlContent.getBytes(StandardCharsets.UTF_8);
            Files.write(filePath, bytes);

            resultMap.put("filePath", filePath.toString());

            resumeInfoVO.setUser_no(Integer.parseInt(user_no.toString()));
            resumeInfoVO.setTitle(paramMap.get("title").toString());
            resumeInfoVO.setDesired_position(paramMap.get("desired_position").toString());
            resumeInfoVO.setTemplate_no(Integer.parseInt(paramMap.get("template_no").toString()));
            String publicationYn = Optional.ofNullable(paramMap.get("publication_yn"))
                    .map(Object::toString)
                    .orElse("N");  // 기본값 N
            resumeInfoVO.setPublication_yn(publicationYn);
            // 파일명
            resumeInfoVO.setResume_file_name(fileName);
            // 물리경로 (Physical Path)
            resumeInfoVO.setResume_file_pypath(filePath.toString());
            // 논리경로 (Logical Path) – 웹에서 접근 가능한 URL 패턴에 맞춰 설정
            String logicalBase = "/resume_output/resume_made/";
            resumeInfoVO.setResume_file_lopath(logicalBase + fileName);

            int result = resumeService.insertResumeInfo(resumeInfoVO);

            resultMap.put("result", result);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return resultMap;

    }

    @RequestMapping("/resumePreview")
    public Map<String, Object> resumePreview(@RequestBody Map<String, Object> paramMap) {
        Map<String, Object> resultMap = new HashMap<>();

        ResumeInfoVO resumeInfoVO = new ResumeInfoVO();
        UserVO userVO = new UserVO();
        Long user_no = Long.valueOf(paramMap.get("user_no").toString());

        try {

            userVO = resumeService.getUserByUserNo(user_no);

            // 2) JSON 생성 로직
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = mapper.createObjectNode();

            // 사용자 정보 매핑
            root.put("userName", userVO.getUser_name());      // name ← userName
            root.put("email", userVO.getLogin_id());       // email ← loginId
            root.put("phone", userVO.getHp());            // phone ← hp
            root.put("birthday", userVO.getBirthday());            // phone ← hp
            root.put("link", paramMap.getOrDefault("link_url", "").toString());

            // skillList 배열
            @SuppressWarnings("unchecked")
            List<Map<String, String>> skillLists = Optional.ofNullable((List<Map<String, String>>) paramMap.get("skillList"))
                    .orElse(Collections.emptyList());
            ArrayNode skillArray = mapper.createArrayNode();
            for (Map<String, String> skill : skillLists) {
                ObjectNode node = mapper.createObjectNode();
                node.put("exp_level", skill.getOrDefault("exp_level", ""));
                node.put("skill_tool", skill.getOrDefault("skill_tool", ""));
                node.put("skill_name", skill.getOrDefault("skill_name", ""));
                node.put("skill_code", skill.getOrDefault("skill_code", ""));
                node.put("group_code", skill.getOrDefault("group_code", ""));
                node.put("group_name", skill.getOrDefault("group_name", ""));

                skillArray.add(node);
            }
            root.set("skillList", skillArray);

            // education 배열
            @SuppressWarnings("unchecked")
            List<Map<String, String>> educations = Optional.ofNullable((List<Map<String, String>>) paramMap.get("education"))
                    .orElse(Collections.emptyList());
            ArrayNode eduArray = mapper.createArrayNode();
            for (Map<String, String> edu : educations) {
                ObjectNode node = mapper.createObjectNode();
                node.put("school_name", edu.getOrDefault("school_name", ""));
                node.put("enroll_date", edu.getOrDefault("enroll_date", ""));
                node.put("grad_date", edu.getOrDefault("grad_date", ""));
                node.put("major", edu.getOrDefault("major", ""));
                node.put("sub_major", edu.getOrDefault("sub_major", ""));
                node.put("gpa", edu.getOrDefault("gpa", ""));
                node.put("notes", edu.getOrDefault("notes", ""));
                String period = edu.getOrDefault("enroll_date", "") + " ~ " + edu.getOrDefault("grad_date", "");
                node.put("period", period);
                eduArray.add(node);
            }
            root.set("education", eduArray);

            // experience 배열
            @SuppressWarnings("unchecked")
            List<Map<String, String>> experiences = Optional.ofNullable((List<Map<String, String>>) paramMap.get("experience"))
                    .orElse(Collections.emptyList());
            ArrayNode expArray = mapper.createArrayNode();
            for (Map<String, String> exp : experiences) {
                ObjectNode node = mapper.createObjectNode();
                node.put("company", exp.getOrDefault("company_name", ""));
                node.put("position", exp.getOrDefault("position", ""));       // 직위가 paramMap에 있다면
                node.put("start_date", exp.getOrDefault("start_date", ""));
                node.put("end_date", exp.getOrDefault("end_date", ""));
                node.put("career_notes", exp.getOrDefault("notes", ""));
                String period = exp.getOrDefault("start_date", "") + " ~ " + exp.getOrDefault("end_date", "");
                node.put("period", period);
                expArray.add(node);
            }
            root.set("experience", expArray);

            // certifications 배열
            @SuppressWarnings("unchecked")
            List<Map<String, String>> certs = Optional.ofNullable((List<Map<String, String>>) paramMap.get("certificateList"))
                    .orElse(Collections.emptyList());
            ArrayNode certArray = mapper.createArrayNode();
            for (Map<String, String> cert : certs) {
                ObjectNode node = mapper.createObjectNode();
                node.put("certificate_no", cert.getOrDefault("certificate_no", ""));
                node.put("certificate_name", cert.getOrDefault("certificate_name", ""));
                node.put("issuing_org", cert.getOrDefault("issuing_org", ""));
                node.put("acquired_date", cert.getOrDefault("acquired_date", ""));
                certArray.add(node);
            }
            root.set("certification", certArray);

            // languageList 배열
            @SuppressWarnings("unchecked")
            List<Map<String, String>> langs = Optional.ofNullable((List<Map<String, String>>) paramMap.get("languageList"))
                    .orElse(Collections.emptyList());
            ArrayNode langArray = mapper.createArrayNode();
            for (Map<String, String> lang : langs) {
                ObjectNode node = mapper.createObjectNode();
                node.put("language", lang.getOrDefault("language", ""));
                node.put("level", lang.getOrDefault("level", ""));
                langArray.add(node);
            }
            root.set("language_skill", langArray);


            // coverLetter(또는 introduction) 기본값 처리
            String intro = paramMap.getOrDefault("coverLetter", "")
                    .toString();
            root.put("introduction", intro);

            TemplateVO templateVO = resumeService.selectTemplateByNum(Integer.parseInt(paramMap.get("template_no").toString()));
            String file = templateVO.getFile_pypath();

            String apiJson = resumeService.getChatResponse(root, file);

            JsonNode rootNode = mapper.readTree(apiJson);
            String htmlContent = rootNode
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            resultMap.put("htmlContent", htmlContent);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return resultMap;
    }

    /**
     * HTML 파일 경로를 받아 PDF로 변환 후 다운로드 응답
     */
    @PostMapping("/exportPdf")
    public ResponseEntity<byte[]> exportPdf(@RequestBody Map<String, Object> requestMap) throws Exception {
        String physicalPath = requestMap.get("filePath").toString();
        Path path = Paths.get(physicalPath);
        byte[] bytes = Files.readAllBytes(path);
        String html = new String(bytes, StandardCharsets.UTF_8);

        String body = html
                // (1) 중복 · 구버전 DOCTYPE, XML 선언 전부 제거
                .replaceAll("(?is)<script[^>]*?>.*?</script>", "")
                .replaceAll("(?is)<!DOCTYPE[^>]*>", "")
                .replaceAll("(?is)<\\?xml[^>]*>", "")
                // (2) 빈태그 XHTML 형식으로 치환
                .replaceAll("(?i)<br(?=[^/>]*>)", "<br/>")
                .replaceAll("(?i)<hr(?=[^/>]*>)", "<hr/>")
                .replaceAll("(?i)<img([^>]*)(?<!/)>", "<img$1/>")   // img 도 자주 문제
                .replaceAll("(?i)<meta([^>]*)(?<!/)>", "<meta$1/>");

        String xhtml = ""
                + "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
                + "<!DOCTYPE html PUBLIC\n"
                + "  \"-//W3C//DTD XHTML 1.0 Strict//EN\"\n"
                + "  \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n"
                + body;

        /* -------------- PDF 렌더링 -------------- */
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        PdfRendererBuilder b = new PdfRendererBuilder();

        /* 1) 폰트 등록 : 이름을 CSS 와 동일하게 “Noto Serif KR” 로 */
        b.useFont(
                () -> this.getClass().getResourceAsStream("/fonts/NotoSansKR-Regular.ttf"),
                "Noto Sans KR"
        );
        b.withHtmlContent(xhtml, path.getParent().toUri().toString());
        b.toStream(os);
        b.run();
        byte[] pdfBytes = os.toByteArray();

        // 3) HTTP 응답 헤더 세팅
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(
                ContentDisposition
                        .attachment()
                        .filename("resume.pdf")
                        .build()
        );

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }


    @RequestMapping("/generateCoverLetter")
    public Map<String, Object> generateCoverLetter(@RequestBody Map<String, Object> paramMap) {
        Map<String, Object> resumeInfo = (Map<String, Object>) paramMap.get("dataToSendToBackend");
        Map<String, Object> resultMap = new HashMap<>();
        String response = "";
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = mapper.createObjectNode();
            root.put("title", resumeInfo.get("title").toString()); //추가
            root.put("myCoverLetter", resumeInfo.get("myCoverLetter").toString());
            root.put("desired_position", resumeInfo.get("desired_position").toString());
            root.put("user_name", resumeInfo.get("user_name").toString());


            //학력사항 정보
            List<Map<String, String>> educations = (List<Map<String, String>>) resumeInfo.get("educationList");
            ArrayNode educationArray = mapper.createArrayNode();
            for (Map<String, String> education : educations) {
                ObjectNode node = mapper.createObjectNode();
                node.put("school_name", education.get("school_name"));
                node.put("major", education.get("major"));
                node.put("sub_major", education.get("sub_major"));
                node.put("gpa", education.get("gpa"));
                //education 데이터에는 edu_status있지만 프론트에서 현재 사용하고 있진 않다.
                //node.put("edu_status", education.get("edu_status"));
                //null이 맞는지 확인ㄴ해보겠다.
                if (education.get("edu_status") != null)
                    node.put("edu_status", education.get("edu_status"));
                System.out.println("edu_status: " + education.get("edu_status"));
                //이 부분은 프론트에서 사용하지 않기 때문에 빼고 싶으면 아예 여기에서 빼버리면 됨.
                educationArray.add(node);
            }
            root.set("educations", educationArray);

            //경력사항 정보
            List<Map<String, String>> careers = (List<Map<String, String>>) resumeInfo.get("careerHistoryList");
            ArrayNode careerArray = mapper.createArrayNode();
            for (Map<String, String> career : careers) {
                ObjectNode node = mapper.createObjectNode();
                node.put("company_name", career.get("company_name"));
                System.out.println("회사명: " + career.get("company_name"));
                node.put("position", career.get("position"));
                node.put("start_date", career.get("start_date"));
                node.put("end_date", career.get("end_date"));
                node.put("notes", career.get("notes"));
                System.out.println("notes: " + career.get("notes"));
                careerArray.add(node);
            }
            root.set("career", careerArray);
            System.out.println("careerArray:" + root.get("career"));

//            // 자격증 정보
//            List<Map<String,String>> certificates = (List<Map<String,String>>) resumeInfo.get("certifications");
//            ArrayNode certificateArray = mapper.createArrayNode();
//            for (Map<String, String> certificate : certificates) {
//                ObjectNode node = mapper.createObjectNode();
//                node.put("certificate_name", certificate.get("certificate_name"));
//                certificateArray.add(node);
//            }
//            root.set("certifications", certificateArray);
//
//            // 언어 정보
//            List<Map<String,String>> languages = (List<Map<String,String>>) resumeInfo.get("languages");
//            ArrayNode languageArray = mapper.createArrayNode();
//            for (Map<String, String> language : languages) {
//                ObjectNode node = mapper.createObjectNode();
//                node.put("language", language.get("language"));
//                node.put("level", language.get("level"));
//                languageArray.add(node);
//            }
//            root.set("languages", languageArray);

            //주요 스킬 정보
            List<Map<String, String>> skills = (List<Map<String, String>>) resumeInfo.get("skillList");
            ArrayNode skillArray = mapper.createArrayNode();
            for (Map<String, String> skill : skills) {
                ObjectNode node = mapper.createObjectNode();
                node.put("skill_code", skill.get("skill_code"));
                node.put("exp_level", skill.get("exp_level"));
                node.put("skill_tool", skill.get("skill_tool"));
                skillArray.add(node);
            }
            root.set("skills", skillArray);
            System.out.println("skillArray: " + root.get("skills"));
//skills에 아무것도 안들어가네.? 프론트쪽 고치니까 들어와짐.

            response = resumeService.generateCoverLetter(root);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        resultMap.put("response", response);
        System.out.println("response:" + response);


        return resultMap;
    }


    @RequestMapping("/saveModifiedResume")
    public Map<String, Object> saveModifiedResume(@RequestBody Map<String, Object> paramMap) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        ResumeInfoVO resumeInfoVO = new ResumeInfoVO();
        Map<String, Object> resumeInfo = (Map<String, Object>) paramMap.get("resumeInfo");
        Long user_no = Long.valueOf(paramMap.get("userNo").toString());


        String htmlContent = paramMap.get("html").toString();

        String outputDir = "X:/resume_output/resume_made";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        String fileName = "modifiedResume_" + user_no + "_" + timestamp + ".html";
        Path dirPath = Paths.get(outputDir);
        Path filePath = dirPath.resolve(fileName);

        if (Files.notExists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        byte[] bytes = htmlContent.getBytes(StandardCharsets.UTF_8);
        Files.write(filePath, bytes);

        resumeInfoVO.setUser_no(Integer.parseInt(paramMap.get("userNo").toString()));
        resumeInfoVO.setTemplate_no(Integer.parseInt(paramMap.get("templateNo").toString()));
        resumeInfoVO.setTitle(resumeInfo.get("title").toString());
        resumeInfoVO.setResume_file_name(fileName);
        resumeInfoVO.setResume_file_pypath(filePath.toString());
        resumeInfoVO.setPublication_yn(resumeInfo.get("publication_yn").toString());


        String logicalBase = "/resume_output/resume_made/";
        resumeInfoVO.setResume_file_lopath(logicalBase + fileName);
        int result = resumeService.insertResumeInfo(resumeInfoVO);
        resultMap.put("result", result);
        resultMap.put("filePath", filePath.toString());

        return resultMap;

    }

    @RequestMapping("/getAiComment")
    public Map<String, Object> getAiComment(@RequestBody Map<String, Object> paramMap) {
        Map<String, Object> resumeInfo = (Map<String, Object>) paramMap.get("resumeInfo");
        Map<String, Object> resultMap = new HashMap<>();
        String response = "";
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = mapper.createObjectNode();
            root.put("coverLetter", resumeInfo.get("coverLetter").toString());
//            root.put("desired_position", resumeInfo.get("desired_position").toString());

            //학력사항 정보
            List<Map<String, String>> educations = (List<Map<String, String>>) resumeInfo.get("education");
            ArrayNode educationArray = mapper.createArrayNode();
            for (Map<String, String> education : educations) {
                ObjectNode node = mapper.createObjectNode();
                node.put("school_name", education.get("school_name"));
                node.put("major", education.get("major"));
                node.put("sub_major", education.get("sub_major"));
                node.put("gpa", education.get("gpa"));
                node.put("edu_status", education.get("edu_status"));
                educationArray.add(node);
            }
            root.set("educations", educationArray);

            //경력사항 정보
            List<Map<String, String>> careers = (List<Map<String, String>>) resumeInfo.get("career");
            ArrayNode careerArray = mapper.createArrayNode();
            for (Map<String, String> career : careers) {
                ObjectNode node = mapper.createObjectNode();
                node.put("company_name", career.get("company_name"));
                node.put("position", career.get("position"));
                node.put("start_date", career.get("start_date"));
                node.put("end_date", career.get("end_date"));
                careerArray.add(node);
            }
            root.set("career", careerArray);

            // 자격증 정보
            List<Map<String, String>> certificates = (List<Map<String, String>>) resumeInfo.get("certifications");
            ArrayNode certificateArray = mapper.createArrayNode();
            for (Map<String, String> certificate : certificates) {
                ObjectNode node = mapper.createObjectNode();
                node.put("certificate_name", certificate.get("certificate_name"));
                certificateArray.add(node);
            }
            root.set("certifications", certificateArray);

            // 언어 정보
            List<Map<String, String>> languages = (List<Map<String, String>>) resumeInfo.get("languages");
            ArrayNode languageArray = mapper.createArrayNode();
            for (Map<String, String> language : languages) {
                ObjectNode node = mapper.createObjectNode();
                node.put("language", language.get("language"));
                node.put("level", language.get("level"));
                languageArray.add(node);
            }
            root.set("languages", languageArray);

            //주요 스킬 정보
            List<Map<String, String>> skills = (List<Map<String, String>>) resumeInfo.get("skills");
            ArrayNode skillArray = mapper.createArrayNode();
            for (Map<String, String> skill : skills) {
                ObjectNode node = mapper.createObjectNode();
                node.put("skill_code", skill.get("skill_code"));
                node.put("exp_level", skill.get("exp_level"));
                node.put("skill_tool", skill.get("skill_tool"));
                skillArray.add(node);
            }
            root.set("skills", skillArray);

            response = resumeService.getAiComment(root);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        resultMap.put("response", response);


        return resultMap;
    }

    @RequestMapping("/selectOneResume")
    public ResponseEntity<String> selectOneResume(@RequestParam String resume_file_path) throws IOException {

        Path path = Paths.get(resume_file_path);
        String html = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);

        return ResponseEntity.ok().body(html);
    }

    // ======================================== 이력서 내역 =============================================
    // 마이페이지 - 이력서 내역 조회
    @PostMapping("/resumeDetail")
    public ResponseEntity<Map<String, Object>> resumeDetailList(@RequestBody Map<String, Object> requestMap,
                                                                @AuthenticationPrincipal UserPrincipal userPrincipal) {
        int userNo = Integer.parseInt(userPrincipal.getUser_no().toString());
        int page = Integer.parseInt(requestMap.getOrDefault("page", "1").toString());
        int pageSize = Integer.parseInt(requestMap.getOrDefault("pageSize", "6").toString());
        requestMap.put("offset", (page - 1) * pageSize);
        requestMap.put("limit", pageSize);
        requestMap.put("user_no", userNo);
        List<ResumeInfoVO> resumeList = resumeService.selectResumeInfo(requestMap);
        int totalCount = resumeService.selectResumeCount(requestMap);

        requestMap.put("totalCount", totalCount);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("resumeList", resumeList);
        resultMap.put("totalCount", totalCount);
        return ResponseEntity.ok(resultMap);
    }

    @PostMapping("/resume/liked")
    public ResponseEntity<Map<String, Object>> resumeLikedList(@RequestBody Map<String, Object> requestMap,
                                                               @AuthenticationPrincipal UserPrincipal userPrincipal) {

        int userNo = Integer.parseInt(userPrincipal.getUser_no().toString());
        int page = Integer.parseInt(requestMap.getOrDefault("page", "1").toString());
        int pageSize = Integer.parseInt(requestMap.getOrDefault("pageSize", "6").toString());
        requestMap.put("offset", (page - 1) * pageSize);
        requestMap.put("limit", pageSize);
        requestMap.put("user_no", userNo);
        List<ResumeInfoVO> resumeList = resumeService.resumeLikedList(requestMap);
        int totalCount = resumeService.selectLikeCount(requestMap);

        requestMap.put("totalCount", totalCount);
        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("resumeList", resumeList);
        resultMap.put("totalCount", totalCount);
        return ResponseEntity.ok(resultMap);
    }

    @PostMapping("/likeResume")
    public ResponseEntity<Map<String, Object>> likeResume(@RequestBody Map<String, Integer> requestMap) {
        int userNo = requestMap.get("userNo");
        int resumeNo = requestMap.get("resumeNo");
        System.out.println(userNo + "" + resumeNo + "----------------------------------------------------------------");
        int likeResume = resumeService.likeResume(userNo, resumeNo);

        if (likeResume == 1) {
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("message", "좋아요 완료되었습니다.");
            return ResponseEntity.ok(resultMap);
        } else {
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("message", "좋아요 요청에 실패했습니다.");
            return ResponseEntity.ok(resultMap);
        }


    }

    @PostMapping("/unlikeResume")
    public ResponseEntity<Map<String, Object>> unlikeResume(@RequestBody Map<String, Integer> requestMap) {
        int userNo = requestMap.get("userNo");
        int resumeNo = requestMap.get("resumeNo");
        int unlikeResume = resumeService.unlikeResume(userNo, resumeNo);

        if (unlikeResume == 1) {
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("message", "취소 완료되었습니다.");
            return ResponseEntity.ok(resultMap);
        } else {
            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("message", "취소 요청에 실패했습니다.");
            return ResponseEntity.ok(resultMap);
        }


    }

    @PostMapping("/deleteResume")
    public ResponseEntity<Map<String, Object>> deleteResume(@RequestBody Map<String, Integer> requestMap) {
        Map<String, Object> resultMap = new HashMap<>();
        int resume_no = requestMap.get("resume_no");
        int result = resumeService.deleteResume(resume_no);
        if (result == 1) {
            resultMap.put("message", "Y");
            return ResponseEntity.ok(resultMap);
        } else {
            resultMap.put("message", "N");
            return ResponseEntity.ok(resultMap);
        }

    }

    // 관리자 이력서 페이지 표시여부 Y/N
    @PostMapping("/updateResumeStatus")
    public ResponseEntity<Map<String, Object>> updateResumeStatus(@RequestBody Map<String, Object> requestMap) {
        int resumeNo = (Integer) requestMap.get("resume_no");
        String statusYn = (String) requestMap.get("status_yn");

        ResumeInfoVO vo = new ResumeInfoVO();
        vo.setResume_no(resumeNo);
        vo.setStatus_yn(statusYn);

        int result = resumeService.updateResumeStatus(vo);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("message", result > 0 ? "Y" : "N");
        return ResponseEntity.ok(resultMap);
    }

    // 관리자 이력서 페이지 이력서 data 삭제
    @PostMapping("/deleteSelectedResume")
    public ResponseEntity<Map<String, Object>> deleteSelectedResume(@RequestBody List<Integer> resumeNos) {
        Map<String, Object> resultMap = new HashMap<>();
        int result = resumeService.deleteSelectedResume(resumeNos);
        resultMap.put("message", result > 0 ? "Y" : "N");
        return ResponseEntity.ok(resultMap);
    }

    // 이력서 게시판 데이터 불러오기
    @GetMapping("/selectResume")
    public Map<String, Object> communityResumeList(Model model, @RequestParam Map<String, Object> paramMap,
                                                   HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        String search = (String) paramMap.get("search");
        paramMap.put("search", search);

        // 필드 추가
        String serachField = (String) paramMap.get("serachField");
        paramMap.put("serachField", serachField);

        int page = 1;
        int pageSize = 12;

        try {
            String pageStr = (String) paramMap.get("page");
            String pageSizeStr = (String) paramMap.get("pageSize");
            if (pageStr != null && !pageStr.isEmpty()) page = Integer.parseInt(pageStr);
            if (pageSizeStr != null && !pageSizeStr.isEmpty()) pageSize = Integer.parseInt(pageSizeStr);
        } catch (NumberFormatException e) {
            resultMap.put("error", "잘못된 요청입니다.");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400
            return resultMap;
        }

        int offset = (page - 1) * pageSize;
        paramMap.put("offset", offset);
        paramMap.put("limit", pageSize);

        List<ResumeInfoVO> boardList = resumeService.communityResumeList(paramMap);

        resultMap.put("boardList", boardList);


        System.out.println(resultMap);

        return resultMap;
    }

    // 관리자페이지에선 모든 정보 가져옴
    @GetMapping("/adminSelectResumeInfo")
    public Map<String, Object> adminResumeList(Model model,
                                               @RequestParam Map<String, Object> paramMap,
                                               HttpServletRequest request,
                                               HttpServletResponse response,
                                               HttpSession session) throws Exception {

        Map<String, Object> resultMap = new HashMap<>();

        String search = (String) paramMap.get("search");
        paramMap.put("search", search);

        String searchField = (String) paramMap.get("searchField");
        paramMap.put("searchField", searchField);

        int page = 1;
        int pageSize = 12;

        try {
            String pageStr = (String) paramMap.get("page");
            String pageSizeStr = (String) paramMap.get("pageSize");
            if (pageStr != null && !pageStr.isEmpty()) page = Integer.parseInt(pageStr);
            if (pageSizeStr != null && !pageSizeStr.isEmpty()) pageSize = Integer.parseInt(pageSizeStr);
        } catch (NumberFormatException e) {
            resultMap.put("error", "잘못된 요청입니다.");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return resultMap;
        }

        int offset = (page - 1) * pageSize;
        paramMap.put("offset", offset);
        paramMap.put("limit", pageSize);

        // ✅ 관리자 페이지 요청이면 includeHidden 설정
        String isAdmin = (String) paramMap.get("admin");
        if ("true".equals(isAdmin)) {
            paramMap.put("includeHidden", true); // Mapper에서 이 값으로 조건 분기
        }

        List<ResumeInfoVO> boardList = resumeService.adminSelectResumeInfo(paramMap);
        resultMap.put("boardList", boardList);

        return resultMap;
    }

    //스킬 그룹 코드 가져오기
    @GetMapping("/selectSkillGroupCode")
    public ResponseEntity<List<String>> selectSkillGroupCodeList() {
        List<String> skillGroupCodeList = new ArrayList<>();
        skillGroupCodeList = resumeService.getSkillGroupCode();
        return ResponseEntity.ok(skillGroupCodeList);
    }

    // 디테일 코드 가져오기
    @GetMapping("/selectSkillDetailCode")
    public ResponseEntity<List<String>> selectSkillDetailCode(@RequestParam String group_code) {
        List<String> skillDetailCodeList = new ArrayList<>();
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("group_code", group_code);
        skillDetailCodeList = resumeService.getSkillDetailCode(paramMap);
        return ResponseEntity.ok(skillDetailCodeList);
    }

    // 특정 템플릿 HTML 코드 반환
    @GetMapping("/getTemplateCode")
    public ResponseEntity<String> getTemplateCode(@RequestParam int template_no) throws IOException {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("template_no", template_no);
        TemplateVO template = resumeService.selectTemplateByNum(template_no);
        Path path = Paths.get(template.getFile_pypath());
        String html = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
        return ResponseEntity.ok(html);
    }


    //템플렛 조회하기.

    @GetMapping("/selectAllTemplates")
    @ResponseBody
    public List<TemplateVO> selectAllTemplates() {
        return resumeService.selectAllTemplates();
    }


    @PostMapping("/insertTemplateInfo")
    public Map<String, Object> insertTemplateInfo(@RequestBody Map<String, Object> paramMap) {
        Map<String, Object> resultMap = new HashMap<>();
        TemplateVO templateVO = new TemplateVO();


        try{
            // 2) JSON 생성 로직
            String htmlContent = paramMap.get("content").toString();
            String template_name = paramMap.get("title").toString();
            templateVO.setTemplate_name(template_name);

            //저장할 경로 생성//file_pypath
            String outputDir = "X:/resume_output/template";
            //타임스탬프 포맷터
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
            //현재 날짜, 시간 문자열
            String timestamp = LocalDateTime.now().format(formatter);
            //파일명에 timestamp 결합 //원격 저장소에 저장할 때 이름?
            String fileName = "template_" + timestamp + ".html";

            Path dirPath = Paths.get(outputDir);
            //resolve()는 Java의 Path 클래스에서 제공하는 메서드로, 경로(Path)를 결합하는 함수
            Path filePath = dirPath.resolve(fileName);
            //파일을 저장할 디렉토리(폴더) 가 없는 경우, 자동으로 생성
            if (Files.notExists(dirPath)){
                Files.createDirectories(dirPath);
            }
            //Java에서 문자열은 내부적으로 UTF-16으로 저장 <---이건  JDK 8에는 지원되지 않나보죠?
            //문자열(htmlContent)을 UTF-8로 인코딩한 후, 해당 내용을 파일에 저장
            byte[] bytes = htmlContent.getBytes(StandardCharsets.UTF_8);
            //filePath에 byte[] 데이터를 한 번에 저장합니다
            Files.write(filePath, bytes);

            resultMap.put("filePath", filePath.toString());

            //vo
            templateVO.setTemplate_name(template_name);
            templateVO.setFile_pypath(filePath.toString());
            // 논리경로 (Logical Path) – 웹에서 접근 가능한 URL 패턴에 맞춰 설정
            String logicalBase =  "/resume_output/template/";
            templateVO.setFile_lopath(logicalBase+fileName);

            //3 DB저장..........
            int result = resumeService.insertTemplateInfo(templateVO);

            resultMap.put("result", result);



        }catch(Exception e){
            throw new RuntimeException(e);

        }

        return resultMap;
    }

    @GetMapping("/selectOneTemplate")
    public Map<String, Object> selectOneTemplate(@RequestParam("template_no") int templateNo) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        TemplateVO templateVO = new TemplateVO();
        templateVO = resumeService.selectTemplateByNum(templateNo);
        System.out.println(templateNo);
        String temp_filepypath = templateVO.getFile_pypath();

        Path path = Paths.get(temp_filepypath);
        String html = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);

        resultMap.put("html", html);
        resultMap.put("template_name", templateVO.getTemplate_name());

        return resultMap;
    }

    @PostMapping("/updateTemplateInfo")
    public Map<String, Object> updateTemplateInfo(@RequestBody Map<String, Object> paramMap) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        TemplateVO templateVO = new TemplateVO();
        int template_no = Integer.parseInt(paramMap.get("template_no").toString());
        String htmlContent = paramMap.get("content").toString();
        templateVO = resumeService.selectTemplateByNum(template_no);
        Path path = Paths.get(templateVO.getFile_pypath());
        Files.write(path, htmlContent.getBytes(StandardCharsets.UTF_8));

        int result = resumeService.updateTemplateInfo(paramMap);

        resultMap.put("result", result);

        return resultMap;
    }

    @PostMapping("/deleteTemplateInfo")
    public Map<String, Object> deleteTemplateInfo(@RequestBody Map<String, Object> requestMap) throws IOException {
        Map<String, Object> resultMap = new HashMap<>();
        List<Integer> templateNoList = new ArrayList<>();
        templateNoList = (List<Integer>) requestMap.get("resumeNo");

        System.out.println("template_no:" + templateNoList);

        for (Integer template_no : templateNoList) {
            int result = resumeService.deleteTemplateInfo(template_no);
        }

//        resultMap.put("result", result);

        return resultMap;
    }



}
