package com.happyjob.jobfolio.controller.resume;

import com.happyjob.jobfolio.service.resume.ResumeService;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @RequestMapping("/selectResumeInfo")
    public Map<String,Object> selectResumeInfo(@RequestParam int user_no){
        Map<String,Object> resultMap = new HashMap<>();





        return resultMap;

    }

    @RequestMapping("/insertResumeInfo")
    public Map<String,Object> insertResumeInfo(@RequestParam Map<String,Object> paramMap){
        Map<String,Object> resultMap = new HashMap<>();

        ResumeInfoVO resumeInfoVO = new ResumeInfoVO();

        resumeInfoVO.setTitle(paramMap.get("title").toString());
        resumeInfoVO.setDesired_position(paramMap.get("desired_position").toString());

        int result = resumeService.insertResumeInfo(resumeInfoVO);



        resultMap.put("result", result);



        return resultMap;

    }




}
