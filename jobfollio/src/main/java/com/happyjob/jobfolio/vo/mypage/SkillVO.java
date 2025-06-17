package com.happyjob.jobfolio.vo.mypage;

import com.happyjob.jobfolio.vo.system.DetailcodeModel;

// 기술 스택 엔터티
public class SkillVO {

    private Long user_no; // 유저번호
    private String exp_level; // 숙련도
    private String skill_tool; // 툴
    private String skill_code;  // detail_code 테이블의 detail_code 와 연결
    private String group_code; // group_code 테이블의 group_code 와 연결

    public SkillVO() {
    }

    public SkillVO(Long user_no, String exp_level, String skill_tool, String skill_code, String group_code) {
        this.user_no = user_no;
        this.exp_level = exp_level;
        this.skill_tool = skill_tool;
        this.skill_code = skill_code;
        this.group_code = group_code;
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
