package com.happyjob.jobfolio.vo.mypage;

import com.happyjob.jobfolio.vo.system.DetailcodeModel;

// 기술 스택 엔터티
public class SkillVO {

    private Long user_no; // 유저번호
    private String exp_level; // 숙련도
    private String skill_tool; // 툴
    private String skill_name;
    private String group_name;
    private String skill_code;
    private String group_code;

    @Override
    public String toString() {
        return "SkillVO{" +
                "user_no=" + user_no +
                ", exp_level='" + exp_level + '\'' +
                ", skill_tool='" + skill_tool + '\'' +
                ", skill_name='" + skill_name + '\'' +
                ", group_name='" + group_name + '\'' +
                ", skill_code='" + skill_code + '\'' +
                ", group_code='" + group_code + '\'' +
                '}';
    }

    public Long getUser_no() {
        return user_no;
    }

    public void setUser_no(Long user_no) {
        this.user_no = user_no;
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

    public String getSkill_name() {
        return skill_name;
    }

    public void setSkill_name(String skill_name) {
        this.skill_name = skill_name;
    }

    public String getGroup_name() {
        return group_name;
    }

    public void setGroup_name(String group_name) {
        this.group_name = group_name;
    }

    public String getSkill_code() {
        return skill_code;
    }

    public void setSkill_code(String skill_code) {
        this.skill_code = skill_code;
    }

    public String getGroup_code() {
        return group_code;
    }

    public void setGroup_code(String group_code) {
        this.group_code = group_code;
    }
}
