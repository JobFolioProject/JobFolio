package com.happyjob.jobfolio.vo.join;

import java.util.Date;

public class UserVO {
    private String loginId;        // 사용자ID(이메일)
    private String userType;       // 사용자구분 (예: 'C' - 일반사용자, 'B' - 하위 관리자 'A' - 최상 관리자)
    private String userName;       // 이름
    private String password;       // 비밀번호
    private String birthday;       // 생년월일
    private String sex;           // 성별
    private String hp;            // 연락처
    private String regDate;       // 가입일자
    private String withdrawalDate; // 탈퇴일자
    private String statusYn;      // 활퇴여부 ('Y' - 탈퇴, 'N' - 탈퇴아님)
    private Date expireDays;      // 구독만료일까지
    private String address;       // 주소
    private String hobby;         // 취미/특기
    private String notes;         // 특이사항
    private Long userNo;          // 회원일련번호 (PK)

    // 기본 생성자
    public UserVO() {}

    // 간소화된 생성자
    public UserVO(String loginId, String userType, String userName, String password,
                  String birthday, String sex, String hp, String regDate,
                  String withdrawalDate, String statusYn, Date expireDays,
                  String address, String hobby, String notes, Long userNo) {
        this.loginId = loginId;
        this.userType = userType;
        this.userName = userName;
        this.password = password;
        this.birthday = birthday;
        this.sex = sex;
        this.hp = hp;
        this.regDate = regDate;
        this.withdrawalDate = withdrawalDate;
        this.statusYn = statusYn;
        this.expireDays = expireDays;
        this.address = address;
        this.hobby = hobby;
        this.notes = notes;
        this.userNo = userNo;
    }

    // Getter 메서드들
    public String getLoginId() { return loginId; }
    public String getUserType() { return userType; }
    public String getUserName() { return userName; }
    public String getPassword() { return password; }
    public String getBirthday() { return birthday; }
    public String getSex() { return sex; }
    public String getHp() { return hp; }
    public String getRegDate() { return regDate; }
    public String getWithdrawalDate() { return withdrawalDate; }
    public String getStatusYn() { return statusYn; }
    public Date getExpireDays() { return expireDays; }
    public String getAddress() { return address; }
    public String getHobby() { return hobby; }
    public String getNotes() { return notes; }
    public Long getUserNo() { return userNo; }

    // Setter 메서드들
    public void setLoginId(String loginId) { this.loginId = loginId; }
    public void setUserType(String userType) { this.userType = userType; }
    public void setUserName(String userName) { this.userName = userName; }
    public void setPassword(String password) { this.password = password; }
    public void setBirthday(String birthday) { this.birthday = birthday; }
    public void setSex(String sex) { this.sex = sex; }
    public void setHp(String hp) { this.hp = hp; }
    public void setRegDate(String regDate) { this.regDate = regDate; }
    public void setWithdrawalDate(String withdrawalDate) { this.withdrawalDate = withdrawalDate; }
    public void setStatusYn(String statusYn) { this.statusYn = statusYn; }
    public void setExpireDays(Date expireDays) { this.expireDays = expireDays; }
    public void setAddress(String address) { this.address = address; }
    public void setHobby(String hobby) { this.hobby = hobby; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setUserNo(Long userNo) { this.userNo = userNo; }

    // toString 메서드 (깔끔하게 정리)
    @Override
    public String toString() {
        return "UserVO{" +
                "loginId='" + loginId + '\'' +
                ", userType='" + userType + '\'' +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", birthday='" + birthday + '\'' +
                ", sex='" + sex + '\'' +
                ", hp='" + hp + '\'' +
                ", regDate='" + regDate + '\'' +
                ", withdrawalDate='" + withdrawalDate + '\'' +
                ", statusYn='" + statusYn + '\'' +
                ", expireDays=" + expireDays +
                ", address='" + address + '\'' +
                ", hobby='" + hobby + '\'' +
                ", notes='" + notes + '\'' +
                ", userNo=" + userNo +
                '}';
    }
}