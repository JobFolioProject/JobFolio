package com.happyjob.jobfolio.vo.mypage;


// 학력 사항 엔터티
public class EduInfoVO {

    private Integer eduNo;  // 일련번호(PK)
    private Integer userNo; // 유저번호
    private String schoolName; //학교명
    private String enrollDate; //입학날짜
    private String gradDate; //졸업날짜
    private String eduStatus; //학력상태
    private String major; //전공
    private String subMajor; //부전공
    private String gpa; //학점
    private String notes; //특이사항

    @Override
    public String toString() {
        return "EduInfoModel{" +
                "eduNo=" + eduNo +
                ", userNo=" + userNo +
                ", schoolName='" + schoolName + '\'' +
                ", enrollDate='" + enrollDate + '\'' +
                ", gradDate='" + gradDate + '\'' +
                ", eduStatus='" + eduStatus + '\'' +
                ", major='" + major + '\'' +
                ", subMajor='" + subMajor + '\'' +
                ", gpa='" + gpa + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

    public Integer getEduNo() {
        return eduNo;
    }

    public void setEduNo(Integer eduNo) {
        this.eduNo = eduNo;
    }

    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }

    public String getSchoolName() {
        return schoolName;
    }

    public void setSchoolName(String schoolName) {
        this.schoolName = schoolName;
    }

    public String getEnrollDate() {
        return enrollDate;
    }

    public void setEnrollDate(String enrollDate) {
        this.enrollDate = enrollDate;
    }

    public String getGradDate() {
        return gradDate;
    }

    public void setGradDate(String gradDate) {
        this.gradDate = gradDate;
    }

    public String getEduStatus() {
        return eduStatus;
    }

    public void setEduStatus(String eduStatus) {
        this.eduStatus = eduStatus;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getSubMajor() {
        return subMajor;
    }

    public void setSubMajor(String subMajor) {
        this.subMajor = subMajor;
    }

    public String getGpa() {
        return gpa;
    }

    public void setGpa(String gpa) {
        this.gpa = gpa;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
