package com.happyjob.jobfolio.controller.resume;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.happyjob.jobfolio.repository.mypage.MypageMapper;
import com.happyjob.jobfolio.service.join.UserService;
import com.happyjob.jobfolio.service.resume.ResumeService;
import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.CertificateVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import com.happyjob.jobfolio.vo.resume.TemplateVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private MypageMapper mypageMapper;

    @Autowired
    private UserService userService;

    @RequestMapping("/selectResumeInfo")
    public Map<String,Object> selectResumeInfo(@RequestParam int user_no){
        Map<String,Object> resultMap = new HashMap<>();

        return resultMap;

    }

//    // 이력서 작성 페이지에 해당 유저의 스킬목록을 조회
//    @RequestMapping("/write")
//    public Map<String,Object> skillInfoResume(@RequestParam int user_no){
//        Map<String,Object> resultMap = new HashMap<>();
//        return resultMap;
//    }


    @RequestMapping("/insertResumeInfo")
    public Map<String,Object> insertResumeInfo(@RequestBody Map<String,Object> paramMap){
        Map<String,Object> resultMap = new HashMap<>();

        ResumeInfoVO resumeInfoVO = new ResumeInfoVO();
        UserVO userVO = new UserVO();
        Long user_no = Long.valueOf(paramMap.get("user_no").toString());

        try {

            userVO = resumeService.getUserByUserNo(user_no);

            // 2) JSON 생성 로직
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode root = mapper.createObjectNode();

            // 사용자 정보 매핑
            root.put("name",  userVO.getUser_name());      // name ← userName
            root.put("email", userVO.getLogin_id());       // email ← loginId
            root.put("phone", userVO.getHp());            // phone ← hp
            root.put("website", paramMap.get("link_url").toString());

            // education 배열
            @SuppressWarnings("unchecked")
            List<Map<String,String>> educations = (List<Map<String,String>>) paramMap.get("education");
            ArrayNode eduArray = mapper.createArrayNode();
            for (Map<String,String> edu : educations) {
                ObjectNode node = mapper.createObjectNode();
                node.put("school_name", edu.get("school_name"));
                node.put("enroll_date", edu.get("enroll_date"));
                node.put("grad_date", edu.get("grad_date"));
                node.put("major",  edu.get("major"));
                node.put("sub_major", edu.get("sub_major"));
                node.put("gpa", edu.get("gpa"));
                String period = edu.get("enroll_date") + " ~ " + edu.get("grad_date");
                node.put("period", period);
                eduArray.add(node);
            }
            root.set("education", eduArray);

            // experience 배열
            @SuppressWarnings("unchecked")
            List<Map<String,String>> experiences = (List<Map<String,String>>) paramMap.get("experience");
            ArrayNode expArray = mapper.createArrayNode();
            for (Map<String,String> exp : experiences) {
                ObjectNode node = mapper.createObjectNode();
                node.put("company",  exp.get("company_name"));
                node.put("dept",     exp.getOrDefault("department",""));     // 부서명이 paramMap에 있다면
                node.put("position", exp.getOrDefault("position",""));       // 직위가 paramMap에 있다면
                node.put("start_date", exp.getOrDefault("start_date",""));       // 직위가 paramMap에 있다면
                node.put("end_date", exp.getOrDefault("end_date",""));       // 직위가 paramMap에 있다면
                String period = exp.get("start_date") + " ~ " + exp.get("end_date");
                node.put("period", period);
                expArray.add(node);
            }
            root.set("experience", expArray);

            // certifications 배열
            @SuppressWarnings("unchecked")
            List<CertificateVO> certs = mypageMapper.getCertificateListByUserNo(user_no);
            ArrayNode certArray = mapper.createArrayNode();
            for (CertificateVO cert : certs) {
                ObjectNode node = mapper.createObjectNode();
                node.put("name", cert.getCertificate_name());
                node.put("issuing_org", cert.getIssuing_org());
                node.put("date", cert.getAcquired_date());
                certArray.add(node);
            }
            root.set("certifications", certArray);


            // coverLetter(또는 introduction) 기본값 처리
            String intro = paramMap.getOrDefault("coverLetter", "")
                    .toString();
            root.put("introduction", intro);

            TemplateVO templateVO = resumeService.selectTemplateByNum(Integer.parseInt(paramMap.get("template_no").toString()));
            String file = templateVO.getFile_pypath();

            String apiJson= resumeService.getChatResponse(root,file);

            JsonNode rootNode = mapper.readTree(apiJson);
            String htmlContent = rootNode
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            // ❶ 저장할 경로 생성
            String outputDir = "X:/resume_output";
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

            resultMap.put("html", apiJson);

            resumeInfoVO.setUser_no(Integer.parseInt(user_no.toString()));
            resumeInfoVO.setTitle(paramMap.get("title").toString());
            resumeInfoVO.setDesired_position(paramMap.get("desired_position").toString());
            // 파일명
            resumeInfoVO.setResume_file_name(fileName);
            // 물리경로 (Physical Path)
            resumeInfoVO.setResume_file_pypath(filePath.toString());
            // 논리경로 (Logical Path) – 웹에서 접근 가능한 URL 패턴에 맞춰 설정
            String logicalBase = "/resume_output/";
            resumeInfoVO.setResume_file_lopath(logicalBase + fileName);

            int result = resumeService.insertResumeInfo(resumeInfoVO);

            //resultMap.put("result", result);


        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return resultMap;

    }

    @RequestMapping("/generateCoverLetter")
    public Map<String,Object> generateCoverLetter(@RequestParam Map<String,Object> paramMap){
        Map<String,Object> resultMap = new HashMap<>();

        ResumeInfoVO resumeInfoVO = new ResumeInfoVO();

        resumeInfoVO.setTitle(paramMap.get("title").toString());
        resumeInfoVO.setDesired_position(paramMap.get("desired_position").toString());

        int result = resumeService.insertResumeInfo(resumeInfoVO);

        resultMap.put("result", result);

        return resultMap;

    }

    @RequestMapping("/saveModifiedResume")
    public Map<String,Object> saveModifiedResume(@RequestBody Map<String,Object> paramMap){
        Map<String,Object> resultMap = new HashMap<>();

        String htmlContent = paramMap.get("html").toString();


        return resultMap;

    }





}
