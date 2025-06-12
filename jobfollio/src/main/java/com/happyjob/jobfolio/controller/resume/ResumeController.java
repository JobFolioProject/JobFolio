package com.happyjob.jobfolio.controller.resume;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.happyjob.jobfolio.repository.mypage.MypageMapper;
import com.happyjob.jobfolio.service.join.UserService;
import com.happyjob.jobfolio.service.resume.ResumeService;
import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.CertificateVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

        try {
            userVO = userService.getUserByUserNo(paramMap);


        // 2) JSON 생성 로직
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode root = mapper.createObjectNode();

        // 사용자 정보 매핑
        root.put("name",  userVO.getUserName());      // name ← userName
        root.put("email", userVO.getLoginId());       // email ← loginId
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
        Long userNo = Long.valueOf(paramMap.get("user_no").toString());
        List<CertificateVO> certs = mypageMapper.getCertificateListByUserNo(userNo);
        ArrayNode certArray = mapper.createArrayNode();
        for (CertificateVO cert : certs) {
            ObjectNode node = mapper.createObjectNode();
            node.put("name", cert.getCertificateName());
            node.put("issuing_org", cert.getIssuingOrg());
            node.put("date", cert.getAcquiredDate());
            certArray.add(node);
        }
        root.set("certifications", certArray);


        // introduction
        root.put("introduction", paramMap.getOrDefault("introduction","").toString());

        String html= resumeService.getChatResponse(root);

        resultMap.put("html", html);




        resumeInfoVO.setTitle(paramMap.get("title").toString());
        resumeInfoVO.setDesired_position(paramMap.get("desired_position").toString());

        //int result = resumeService.insertResumeInfo(resumeInfoVO);



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





}
