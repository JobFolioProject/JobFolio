package com.happyjob.jobfolio.vo.mypage;


// 외국어 역량 엔터티
public class LanguageSkillVO {

    private Long user_no; // 유저 번호
    private String language; // 언어
    private String level; // 등급

    @Override
    public String toString() {
        return "LanguageSkillVO{" +
                "userNo=" + user_no +
                ", language='" + language + '\'' +
                ", level='" + level + '\'' +
                '}';
    }

    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}
