package com.happyjob.jobfolio.vo.mypage;

public class CareerHistoryVO {

    private Long userNo;    // 유저번호
    private Integer careerNo; // 경력번호
    private String companyName; // 회사이름
    private String startDate; // 시작일
    private String endDate; // 종료일
    private String position; // 직급
    private String notes; // 특이사항

    @Override
    public String toString() {
        return "CreerHistoryVO{" +
                "userNo=" + userNo +
                ", careerNo=" + careerNo +
                ", companyName='" + companyName + '\'' +
                ", startDate='" + startDate + '\'' +
                ", endDate='" + endDate + '\'' +
                ", position='" + position + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

    public Long getUserNo() {
        return userNo;
    }

    public void setUserNo(Long userNo) {
        this.userNo = userNo;
    }

    public Integer getCareerNo() {
        return careerNo;
    }

    public void setCareerNo(Integer careerNo) {
        this.careerNo = careerNo;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
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
