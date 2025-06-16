package com.happyjob.jobfolio.vo.mypage;

public class CareerHistoryVO {

    private Long user_no;    // 유저번호
    private Integer career_no; // 경력번호
    private String company_name; // 회사이름
    private String start_date; // 시작일
    private String end_date; // 종료일
    private String position; // 직급
    private String notes; // 특이사항

    @Override
    public String toString() {
        return "CareerHistoryVO{" +
                "userNo=" + user_no +
                ", careerNo=" + career_no +
                ", companyName='" + company_name + '\'' +
                ", startDate='" + start_date + '\'' +
                ", endDate='" + end_date + '\'' +
                ", position='" + position + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public Integer getCareer_no() {
        return career_no;
    }

    public void setCareer_no(Integer career_no) {
        this.career_no = career_no;
    }

    public String getCompany_name() {
        return company_name;
    }

    public void setCompany_name(String company_name) {
        this.company_name = company_name;
    }

    public String getStart_date() {
        return start_date;
    }

    public void setStart_date(String start_date) {
        this.start_date = start_date;
    }

    public String getEnd_date() {
        return end_date;
    }

    public void setEnd_date(String end_date) {
        this.end_date = end_date;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
