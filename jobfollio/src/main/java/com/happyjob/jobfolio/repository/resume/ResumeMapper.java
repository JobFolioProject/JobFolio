package com.happyjob.jobfolio.repository.resume;

import com.happyjob.jobfolio.vo.resume.LinkInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeLikeVO;
import com.happyjob.jobfolio.vo.resume.TemplateVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ResumeMapper {

    List<ResumeInfoVO> selectResumeInfo(int user_no);

    int insertResumeInfo(ResumeInfoVO resumeInfoVO);

    List<LinkInfoVO> selectLinkInfoByResume(int resume_no);

    int insertLinkInfo(LinkInfoVO linkInfoVO);

    int selectResumeLikeByResume(int resume_no);

    int insertResumeLike(ResumeLikeVO resumeLikeVO);

    List<TemplateVO> selectAllTemplates();

    int insertTemplate(TemplateVO templateVO);


}
