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


}
