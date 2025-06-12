package com.happyjob.jobfolio.vo.join;

import java.util.Date;

public class EmailVerificationVO {
    private Long id;
    private String email;
    private String verificationCode;
    private Date expireTime;
    private Date createdAt;
    private String isUsed;
    private Date usedAt;

    // 기본 생성자
    public EmailVerificationVO() {}

    // 필수 필드 생성자
    public EmailVerificationVO(String email, String verificationCode, Date expireTime) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.expireTime = expireTime;
        this.isUsed = "N";
    }

    // Getter & Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getVerificationCode() { return verificationCode; }
    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public Date getExpireTime() { return expireTime; }
    public void setExpireTime(Date expireTime) { this.expireTime = expireTime; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public String getIsUsed() { return isUsed; }
    public void setIsUsed(String isUsed) { this.isUsed = isUsed; }

    public Date getUsedAt() { return usedAt; }
    public void setUsedAt(Date usedAt) { this.usedAt = usedAt; }

    @Override
    public String toString() {
        return "EmailVerificationVO{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", verificationCode='" + verificationCode + '\'' +
                ", expireTime=" + expireTime +
                ", createdAt=" + createdAt +
                ", isUsed='" + isUsed + '\'' +
                ", usedAt=" + usedAt +
                '}';
    }
}