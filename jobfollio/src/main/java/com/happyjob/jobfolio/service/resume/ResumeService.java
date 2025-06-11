package com.happyjob.jobfolio.service.resume;

import com.happyjob.jobfolio.repository.resume.ResumeMapper;
import com.happyjob.jobfolio.vo.resume.LinkInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeLikeVO;
import com.happyjob.jobfolio.vo.resume.TemplateVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResumeService {

    @Autowired
    private ResumeMapper resumeMapper;

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

}
