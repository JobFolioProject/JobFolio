package com.happyjob.jobfolio.vo.mypage;


// 학력 사항 엔터티
public class EduInfoVO {

    private Long edu_no;  // 일련번호(PK)
    private Long user_no; // 유저번호
    private String school_name; //학교명
    private String enroll_date; //입학날짜
    private String grad_date; //졸업날짜
    private String edu_status; //학력상태
    private String major; //전공
    private String sub_major; //부전공
    private String gpa; //학점
    private String notes; //특이사항

    @Override
    public String toString() {
        return "EduInfoVO{" +
                "edu_no=" + edu_no +
                ", user_no=" + user_no +
                ", school_name='" + school_name + '\'' +
                ", enroll_date='" + enroll_date + '\'' +
                ", grad_date='" + grad_date + '\'' +
                ", edu_status='" + edu_status + '\'' +
                ", major='" + major + '\'' +
                ", sub_major='" + sub_major + '\'' +
                ", gpa='" + gpa + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

    public Long getEdu_no() {
        return edu_no;
    }

    public void setEdu_no(Long edu_no) {
        this.edu_no = edu_no;
    }

    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public String getSchool_name() {
        return school_name;
    }

    public void setSchool_name(String school_name) {
        this.school_name = school_name;
    }

    public String getEnroll_date() {
        return enroll_date;
    }

    public void setEnroll_date(String enroll_date) {
        this.enroll_date = enroll_date;
    }

    public String getGrad_date() {
        return grad_date;
    }

    public void setGrad_date(String grad_date) {
        this.grad_date = grad_date;
    }

    public String getEdu_status() {
        return edu_status;
    }

    public void setEdu_status(String edu_status) {
        this.edu_status = edu_status;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getSub_major() {
        return sub_major;
    }

    public void setSub_major(String sub_major) {
        this.sub_major = sub_major;
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
