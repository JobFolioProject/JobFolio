package com.happyjob.jobfolio.vo.mypage;

public class CertificateVO {

    private Long user_no; // 유저 아이디
    private Integer certification_no; // 회원일련번호
    private String certificate_no; // 자격증 번호
    private String certificate_name; // 자격증 이름
    private String issuing_org; // 발행기관
    private String acquired_date; // 취득일
    private String notes; // 특이사항

    @Override
    public String toString() {
        return "CertificateModel{" +
                "userNo=" + user_no +
                ", certificationNo=" + certification_no +
                ", certificateNo='" + certificate_no + '\'' +
                ", certificateName='" + certificate_name + '\'' +
                ", issuingOrg='" + issuing_org + '\'' +
                ", acquiredDate='" + acquired_date + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public Integer getCertification_no() {
        return certification_no;
    }

    public void setCertification_no(Integer certification_no) {
        this.certification_no = certification_no;
    }

    public String getCertificate_no() {
        return certificate_no;
    }

    public void setCertificate_no(String certificate_no) {
        this.certificate_no = certificate_no;
    }

    public String getCertificate_name() {
        return certificate_name;
    }

    public void setCertificate_name(String certificate_name) {
        this.certificate_name = certificate_name;
    }

    public String getIssuing_org() {
        return issuing_org;
    }

    public void setIssuing_org(String issuing_org) {
        this.issuing_org = issuing_org;
    }

    public String getAcquired_date() {
        return acquired_date;
    }

    public void setAcquired_date(String acquired_date) {
        this.acquired_date = acquired_date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


}
