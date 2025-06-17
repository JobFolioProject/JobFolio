package com.happyjob.jobfolio.vo.mypage;

public class CommSkillDto {

    private String group_code;
    private String detail_name;
    private String detail_code;
    private String group_name;

    public CommSkillDto() {
    }

    public CommSkillDto(String group_code, String detail_name, String detail_code, String group_name) {
        this.group_code = group_code;
        this.detail_name = detail_name;
        this.detail_code = detail_code;
        this.group_name = group_name;
    }

    @Override
    public String toString() {
        return "CommSkillDto{" +
                "group_code='" + group_code + '\'' +
                ", detail_name='" + detail_name + '\'' +
                ", detail_code='" + detail_code + '\'' +
                ", group_name='" + group_name + '\'' +
                '}';
    }

    public String getGroup_code() {
        return group_code;
    }

    public void setGroup_code(String group_code) {
        this.group_code = group_code;
    }

    public String getDetail_name() {
        return detail_name;
    }

    public void setDetail_name(String detail_name) {
        this.detail_name = detail_name;
    }

    public String getDetail_code() {
        return detail_code;
    }

    public void setDetail_code(String detail_code) {
        this.detail_code = detail_code;
    }

    public String getGroup_name() {
        return group_name;
    }

    public void setGroup_name(String group_name) {
        this.group_name = group_name;
    }
}
