package com.happyjob.jobfolio.service.resume;

import com.happyjob.jobfolio.repository.resume.ResumeMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;
}
