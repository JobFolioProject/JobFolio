package com.happyjob.jobfolio.controller.resume;

import com.happyjob.jobfolio.service.resume.ResumeService;
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

//    // 이력서 작성 페이지에 해당 유저의 스킬목록을 조회
//    @RequestMapping("/write")
//    public Map<String,Object> skillInfoResume(@RequestParam int user_no){
//        Map<String,Object> resultMap = new HashMap<>();
//        return resultMap;
//    }

}
