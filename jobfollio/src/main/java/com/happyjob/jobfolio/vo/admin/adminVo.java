package com.happyjob.jobfolio.vo.admin;

public class adminVo {
    private String memberId; // 회원 ID
    private String status;   // 회원 상태 (Y, A 등)

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }
}
