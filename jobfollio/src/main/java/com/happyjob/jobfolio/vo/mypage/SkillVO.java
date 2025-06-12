package com.happyjob.jobfolio.vo.mypage;

import com.happyjob.jobfolio.vo.system.DetailcodeModel;

// 기술 스택 엔터티
public class SkillVO {

    private Long user_no; // 유저번호
    private DetailcodeModel skill; // 스킬코드, 그룹코드 복합키
    private String exp_level; // 숙련도
    private String skill_tool; // 툴

    @Override
    public String toString() {
        return "SkillModel{" +
                "userNo=" + user_no +
                ", skill=" + skill +
                ", expLevel='" + exp_level + '\'' +
                ", skillTool='" + skill_tool + '\'' +
                '}';
    }

    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public DetailcodeModel getSkill() {
        return skill;
    }

    public void setSkill(DetailcodeModel skill) {
        this.skill = skill;
    }

    public String getExp_level() {
        return exp_level;
    }

    public void setExp_level(String exp_level) {
        this.exp_level = exp_level;
    }

    public String getSkill_tool() {
        return skill_tool;
    }

    public void setSkill_tool(String skill_tool) {
        this.skill_tool = skill_tool;
    }
}
