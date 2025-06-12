package com.happyjob.jobfolio.vo.mypage;


// 외국어 역량 엔터티
public class LanguageSkillVO {

    private Integer userNo; // 유저 번호
    private String language; // 언어
    private String level; // 등급

    @Override
    public String toString() {
        return "LanguageSkillVO{" +
                "userNo=" + userNo +
                ", language='" + language + '\'' +
                ", level='" + level + '\'' +
                '}';
    }

    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
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
