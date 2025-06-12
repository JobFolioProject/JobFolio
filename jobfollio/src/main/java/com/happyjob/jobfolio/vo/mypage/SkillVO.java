package com.happyjob.jobfolio.vo.mypage;

import com.happyjob.jobfolio.vo.system.DetailcodeModel;

// 기술 스택 엔터티
public class SkillVO {

    private Integer userNo; // 유저번호
    private DetailcodeModel skill; // 스킬코드, 그룹코드 복합키
    private String expLevel; // 숙련도
    private String skillTool; // 툴

    @Override
    public String toString() {
        return "SkillModel{" +
                "userNo=" + userNo +
                ", skill=" + skill +
                ", expLevel='" + expLevel + '\'' +
                ", skillTool='" + skillTool + '\'' +
                '}';
    }

    public Integer getUserNo() {
        return userNo;
    }

    public void setUserNo(Integer userNo) {
        this.userNo = userNo;
    }

    public DetailcodeModel getSkill() {
        return skill;
    }

    public void setSkill(DetailcodeModel skill) {
        this.skill = skill;
    }

    public String getExpLevel() {
        return expLevel;
    }

    public void setExpLevel(String expLevel) {
        this.expLevel = expLevel;
    }

    public String getSkillTool() {
        return skillTool;
    }

    public void setSkillTool(String skillTool) {
        this.skillTool = skillTool;
    }
}
