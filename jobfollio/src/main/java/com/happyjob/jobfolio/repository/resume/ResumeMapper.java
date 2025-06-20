package com.happyjob.jobfolio.repository.resume;

import com.happyjob.jobfolio.vo.join.UserVO;
import com.happyjob.jobfolio.vo.mypage.CommSkillDto;
import com.happyjob.jobfolio.vo.resume.LinkInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeInfoVO;
import com.happyjob.jobfolio.vo.resume.ResumeLikeVO;
import com.happyjob.jobfolio.vo.resume.TemplateVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ResumeMapper {

    List<ResumeInfoVO> selectResumeInfo(Map<String,Object> requestMap);

    int selectResumeCount(Map<String,Object> requestMap);

    List<ResumeInfoVO> resumeLikedList(int user_no);

    int unlikeResume(int user_no, int resume_no);

    int likeResume(int user_no, int resume_no);

    int deleteResume(int resume_no);

    // 관리자페이지에서 이력서 삭제
    int deleteSelectedResume(List<Integer> resume_nos);

    int insertResumeInfo(ResumeInfoVO resumeInfoVO);

    List<LinkInfoVO> selectLinkInfoByResume(int resume_no);

    int insertLinkInfo(LinkInfoVO linkInfoVO);

    int selectResumeLikeByResume(int resume_no);

    int insertResumeLike(ResumeLikeVO resumeLikeVO);

    TemplateVO selectTemplateByNum(int template_no);

    int insertTemplate(TemplateVO templateVO);

    UserVO getUserByUserNo(Long userNo);

    // 이력서 목록 조회
    List<ResumeInfoVO> communityResumeList(Map<String, Object> paramMap);


    List<TemplateVO> selectAllTemplates();

    List<String> getSkillGroupCode();

    List<String> getSkillDetailCode(Map<String, Object> paramMap);




}
