package com.happyjob.jobfolio.vo.mypage;

public class CertificateVO {

    private Integer userNo; // 유저 아이디
    private Integer certificationNo; // 회원일련번호
    private String certificateNo; // 자격증 번호
    private String certificateName; // 자격증 이름
    private String issuingOrg; // 발행기관
    private String acquiredDate; // 취득일
    private String notes; // 특이사항

    @Override
    public String toString() {
        return "CertificateModel{" +
                "userNo=" + userNo +
                ", certificationNo=" + certificationNo +
                ", certificateNo='" + certificateNo + '\'' +
                ", certificateName='" + certificateName + '\'' +
                ", issuingOrg='" + issuingOrg + '\'' +
                ", acquiredDate='" + acquiredDate + '\'' +
                ", notes='" + notes + '\'' +
                '}';
    }

    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }

    public Integer getCertificationNo() {
        return certificationNo;
    }

    public void setCertificationNo(Integer certificationNo) {
        this.certificationNo = certificationNo;
    }

    public String getCertificateNo() {
        return certificateNo;
    }

    public void setCertificateNo(String certificateNo) {
        this.certificateNo = certificateNo;
    }

    public String getCertificateName() {
        return certificateName;
    }

    public void setCertificateName(String certificateName) {
        this.certificateName = certificateName;
    }

    public String getIssuingOrg() {
        return issuingOrg;
    }

    public void setIssuingOrg(String issuingOrg) {
        this.issuingOrg = issuingOrg;
    }

    public String getAcquiredDate() {
        return acquiredDate;
    }

    public void setAcquiredDate(String acquiredDate) {
        this.acquiredDate = acquiredDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


}
