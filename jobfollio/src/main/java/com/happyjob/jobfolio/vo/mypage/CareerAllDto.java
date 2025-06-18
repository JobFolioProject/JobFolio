package com.happyjob.jobfolio.vo.mypage;


import java.util.ArrayList;
import java.util.List;

public class CareerAllDto {

    // 유저 기본 정보
    private Long user_no;
    private String hobby;
    private String notes;

    // 학력
    private List<EduInfoVO> educationList;
    // 언어
    private List<LanguageSkillVO> languageSkillList;
    // 스킬
    private List<SkillVO> skillList;
    // 자격증
    private List<CertificateVO> certificateList;
    // 경력
    private List<CareerHistoryVO> careerHistoryList;

    //ai 자소서 생성용 추가사항 입니다.
    private String myCoverLetter;
    private String title;           // 이력서 제목
    private String desired_position; // 희망 직무

    // 리스트 필드를 null 방지를 위해 초기화하는 생성자
    public CareerAllDto() {
        this.educationList = new ArrayList<>();
        this.languageSkillList = new ArrayList<>();
        this.skillList = new ArrayList<>();
        this.certificateList = new ArrayList<>();
        this.careerHistoryList = new ArrayList<>();
    }

    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public String getHobby() {
        return hobby;
    }

    public void setHobby(String hobby) {
        this.hobby = hobby;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<EduInfoVO> getEducationList() {
        return educationList;
    }

    public void setEducationList(List<EduInfoVO> educationList) {
        this.educationList = educationList;
    }

    public List<LanguageSkillVO> getLanguageSkillList() {
        return languageSkillList;
    }

    public void setLanguageSkillList(List<LanguageSkillVO> languageSkillList) {
        this.languageSkillList = languageSkillList;
    }

    public List<SkillVO> getSkillList() {
        return skillList;
    }

    public void setSkillList(List<SkillVO> skillList) {
        this.skillList = skillList;
    }

    public List<CertificateVO> getCertificateList() {
        return certificateList;
    }

    public void setCertificateList(List<CertificateVO> certificateList) {
        this.certificateList = certificateList;
    }

    public List<CareerHistoryVO> getCareerHistoryList() {
        return careerHistoryList;
    }

    public void setCareerHistoryList(List<CareerHistoryVO> careerHistoryList) {
        this.careerHistoryList = careerHistoryList;
    }
}
