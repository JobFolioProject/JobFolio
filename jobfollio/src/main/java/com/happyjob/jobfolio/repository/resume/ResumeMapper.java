package com.happyjob.jobfolio.repository.resume;

import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.resume.LinkInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeLikeVO;
import com.happyjob.jobfolio.vo.resume.TemplateVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ResumeMapper {

    List<ResumeInfoVO> selectResumeInfo(int user_no);

    List<ResumeInfoVO> resumeLikedList(int user_no);

    int unlikeResume(int user_no, int resume_no);

    int likeResume(int user_no, int resume_no);

    int deleteResume(int resume_no);

    int insertResumeInfo(ResumeInfoVO resumeInfoVO);

    List<LinkInfoVO> selectLinkInfoByResume(int resume_no);

    int insertLinkInfo(LinkInfoVO linkInfoVO);

    int selectResumeLikeByResume(int resume_no);

    int insertResumeLike(ResumeLikeVO resumeLikeVO);

    List<TemplateVO> selectAllTemplates();

    TemplateVO selectTemplateByNum(int template_no);

    int insertTemplate(TemplateVO templateVO);

    UserVO getUserByUserNo(Long userNo);

    // 이력서 목록 조회
    List<ResumeInfoVO> communityResumeList(Map<String, Object> paramMap);

//    ResumeInfoVO selectResumeInfoByResumeNo(int resumeNo);


//    // 스킬 목록 조회
//    List<SkillInfoVO> selectSkillInfoList(int user_no);


}
