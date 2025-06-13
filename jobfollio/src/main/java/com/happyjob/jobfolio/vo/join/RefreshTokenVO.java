package com.happyjob.jobfolio.vo.join;

import java.util.Date;

public class RefreshTokenVO {

    private Long token_id;           // 토큰 ID (BIGINT AUTO_INCREMENT)
    private Integer user_no;         // 사용자 번호 (INT - tb_userinfo 참조)
    private String token_hash;       // 토큰 해시값
    private String user_agent;       // User-Agent 정보
    private Date expires_at;         // 만료 시간
    private Date created_at;         // 생성 시간
    private Date last_used_at;       // 마지막 사용 시간
    private String is_revoked;       // 무효화 여부 (Y/N)
    private Date revoked_at;         // 무효화 시간
    private String revoked_reason;   // 무효화 사유

    // 기본 생성자
    public RefreshTokenVO() {}

    // 생성자
    public RefreshTokenVO(Integer user_no, String token_hash, Date expires_at) {
        this.user_no = user_no;
        this.token_hash = token_hash;
        this.expires_at = expires_at;
        this.is_revoked = "N";
    }

    // Getter & Setter
    public Long getToken_id() {
        return token_id;
    }

    public void setToken_id(Long token_id) {
        this.token_id = token_id;
    }

    public Integer getUser_no() {
        return user_no;
    }

    public void setUser_no(Integer user_no) {
        this.user_no = user_no;
    }

    public String getToken_hash() {
        return token_hash;
    }

    public void setToken_hash(String token_hash) {
        this.token_hash = token_hash;
    }

    public String getUser_agent() {
        return user_agent;
    }

    public void setUser_agent(String user_agent) {
        this.user_agent = user_agent;
    }

    public Date getExpires_at() {
        return expires_at;
    }

    public void setExpires_at(Date expires_at) {
        this.expires_at = expires_at;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Date getLast_used_at() {
        return last_used_at;
    }

    public void setLast_used_at(Date last_used_at) {
        this.last_used_at = last_used_at;
    }

    public String getIs_revoked() {
        return is_revoked;
    }

    public void setIs_revoked(String is_revoked) {
        this.is_revoked = is_revoked;
    }

    public Date getRevoked_at() {
        return revoked_at;
    }

    public void setRevoked_at(Date revoked_at) {
        this.revoked_at = revoked_at;
    }

    public String getRevoked_reason() {
        return revoked_reason;
    }

    public void setRevoked_reason(String revoked_reason) {
        this.revoked_reason = revoked_reason;
    }

    @Override
    public String toString() {
        return "RefreshTokenVO{" +
                "token_id=" + token_id +
                ", user_no=" + user_no +
                ", token_hash='" + token_hash + '\'' +
                ", user_agent='" + user_agent + '\'' +
                ", expires_at=" + expires_at +
                ", created_at=" + created_at +
                ", last_used_at=" + last_used_at +
                ", is_revoked='" + is_revoked + '\'' +
                ", revoked_at=" + revoked_at +
                ", revoked_reason='" + revoked_reason + '\'' +
                '}';
    }
}