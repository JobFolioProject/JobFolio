package com.happyjob.jobfolio.vo.resume;

import com.happyjob.jobfolio.vo.mypage.*;

import java.util.List;

public class AiResumeGenerateVO {

    private Long user_no;
    private String link_url;
    private String title;
    private String desired_position;


    private List<LanguageSkillVO> language_skills;
    private List<CertificateVO> certificate;
    private List<EduInfoVO> education;      // 기존 EduInfoVO 사용
    private List<CareerHistoryVO> experience; // 기존 CareerHistoryVO 사용
    private List<Object> newExperience;     // 임시 데이터. 실제 사용하지 않을 경우 List<Object>로 충분
    private List<Object> newEducation;      // 임시 데이터. 실제 사용하지 않을 경우 List<Object>로 충분
    private String myCoverLetter;           // 클라이언트에서 별도로 보내는 자기소개서


    private Integer template_no;            // 클라이언트 formData의 template_no

    //skill 정보를 단순화된 DTO리스트로 받기.



    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public String getLink_url() {
        return link_url;
    }

    public void setLink_url(String link_url) {
        this.link_url = link_url;
    }



    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesired_position() {
        return desired_position;
    }

    public void setDesired_position(String desired_position) {
        this.desired_position = desired_position;
    }

    public List<LanguageSkillVO> getLanguage_skills() {
        return language_skills;
    }

    public void setLanguage_skills(List<LanguageSkillVO> language_skills) {
        this.language_skills = language_skills;
    }

    public List<CertificateVO> getCertificate() {
        return certificate;
    }

    public void setCertificate(List<CertificateVO> certificate) {
        this.certificate = certificate;
    }

    public List<EduInfoVO> getEducation() {
        return education;
    }

    public void setEducation(List<EduInfoVO> education) {
        this.education = education;
    }

    public List<CareerHistoryVO> getExperience() {
        return experience;
    }

    public void setExperience(List<CareerHistoryVO> experience) {
        this.experience = experience;
    }

    public List<Object> getNewExperience() {
        return newExperience;
    }

    public void setNewExperience(List<Object> newExperience) {
        this.newExperience = newExperience;
    }

    public List<Object> getNewEducation() {
        return newEducation;
    }

    public void setNewEducation(List<Object> newEducation) {
        this.newEducation = newEducation;
    }

    public String getMyCoverLetter() {
        return myCoverLetter;
    }

    public void setMyCoverLetter(String myCoverLetter) {
        this.myCoverLetter = myCoverLetter;
    }

    public Integer getTemplate_no() {
        return template_no;
    }

    public void setTemplate_no(Integer template_no) {
        this.template_no = template_no;
    }



}

