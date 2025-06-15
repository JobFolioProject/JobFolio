package com.happyjob.jobfolio.vo.join;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;

public class UserVO {
    private String login_id;        // 사용자ID(이메일)
    private String user_type;       // 사용자구분 (예: 'C' - 일반사용자, 'B' - 하위 관리자 'A' - 최상 관리자)
    private String user_name;       // 이름

    @JsonIgnore
    private String password;       // 비밀번호

    private String birthday;       // 생년월일
    private String sex;           // 성별
    private String hp;            // 연락처
    private String reg_date;       // 가입일자
    private String withdrawal_date; // 탈퇴일자
    private String status_yn;      // 활퇴여부 ('Y' - 탈퇴, 'N' - 탈퇴아님)
    private Date expire_days;      // 구독만료일까지
    private String address;       // 주소
    private String hobby;         // 취미/특기
    private String notes;         // 특이사항
    private Long user_no;          // 회원일련번호 (PK)

    // 기본 생성자
    public UserVO() {}

    // 간소화된 생성자
    public UserVO(String login_id, String user_type, String user_name, String password,
                  String birthday, String sex, String hp, String reg_date,
                  String withdrawal_date, String status_yn, Date expire_days,
                  String address, String hobby, String notes, Long user_no) {
        this.login_id = login_id;
        this.user_type = user_type;
        this.user_name = user_name;
        this.password = password;
        this.birthday = birthday;
        this.sex = sex;
        this.hp = hp;
        this.reg_date = reg_date;
        this.withdrawal_date = withdrawal_date;
        this.status_yn = status_yn;
        this.expire_days = expire_days;
        this.address = address;
        this.hobby = hobby;
        this.notes = notes;
        this.user_no = user_no;
    }

    // Getter 메서드들
    public String getLogin_id() { return login_id; }
    public String getUser_type() { return user_type; }
    public String getUser_name() { return user_name; }
    public String getPassword() { return password; }
    public String getBirthday() { return birthday; }
    public String getSex() { return sex; }
    public String getHp() { return hp; }
    public String getReg_date() { return reg_date; }
    public String getWithdrawal_date() { return withdrawal_date; }
    public String getStatus_yn() { return status_yn; }
    public Date getExpire_days() { return expire_days; }
    public String getAddress() { return address; }
    public String getHobby() { return hobby; }
    public String getNotes() { return notes; }
    public Long getUser_no() { return user_no; }

    // Setter 메서드들
    public void setLogin_id(String login_id) { this.login_id = login_id; }
    public void setUser_type(String user_type) { this.user_type = user_type; }
    public void setUser_name(String user_name) { this.user_name = user_name; }
    public void setPassword(String password) { this.password = password; }
    public void setBirthday(String birthday) { this.birthday = birthday; }
    public void setSex(String sex) { this.sex = sex; }
    public void setHp(String hp) { this.hp = hp; }
    public void setReg_date(String reg_date) { this.reg_date = reg_date; }
    public void setWithdrawal_date(String withdrawal_date) { this.withdrawal_date = withdrawal_date; }
    public void setStatus_yn(String status_yn) { this.status_yn = status_yn; }
    public void setExpire_days(Date expire_days) { this.expire_days = expire_days; }
    public void setAddress(String address) { this.address = address; }
    public void setHobby(String hobby) { this.hobby = hobby; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setUser_no(Long user_no) { this.user_no = user_no; }

    // toString 메서드 (깔끔하게 정리)
    @Override
    public String toString() {
        return "UserVO{" +
                "login_id='" + login_id + '\'' +
                ", user_type='" + user_type + '\'' +
                ", user_name='" + user_name + '\'' +
                ", password='" + password + '\'' +
                ", birthday='" + birthday + '\'' +
                ", sex='" + sex + '\'' +
                ", hp='" + hp + '\'' +
                ", reg_date='" + reg_date + '\'' +
                ", withdrawal_date='" + withdrawal_date + '\'' +
                ", status_yn='" + status_yn + '\'' +
                ", expire_days=" + expire_days +
                ", address='" + address + '\'' +
                ", hobby='" + hobby + '\'' +
                ", notes='" + notes + '\'' +
                ", user_no=" + user_no +
                '}';
    }
}