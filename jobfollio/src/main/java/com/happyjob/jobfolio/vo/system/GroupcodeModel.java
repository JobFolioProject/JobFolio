package com.happyjob.jobfolio.vo.system;

public class GroupcodeModel {

    private String group_code;
    private String group_name;
    private String note;
    private String use_yn;
    private String regId;
    private String reg_date;
    private String updateId;
    private String update_date;
    private String g_temp_field2;
    private String g_temp_field3;

    @Override
    public String toString() {
        return "GroupcodeModel{" +
                "group_code='" + group_code + '\'' +
                ", group_name='" + group_name + '\'' +
                ", note='" + note + '\'' +
                ", use_yn='" + use_yn + '\'' +
                ", regId='" + regId + '\'' +
                ", reg_date='" + reg_date + '\'' +
                ", updateId='" + updateId + '\'' +
                ", update_date='" + update_date + '\'' +
                ", g_temp_field2='" + g_temp_field2 + '\'' +
                ", g_temp_field3='" + g_temp_field3 + '\'' +
                '}';
    }

    public String getGroup_code() {
        return group_code;
    }

    public void setGroup_code(String group_code) {
        this.group_code = group_code;
    }

    public String getGroup_name() {
        return group_name;
    }

    public void setGroup_name(String group_name) {
        this.group_name = group_name;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getUse_yn() {
        return use_yn;
    }

    public void setUse_yn(String use_yn) {
        this.use_yn = use_yn;
    }

    public String getRegId() {
        return regId;
    }

    public void setRegId(String regId) {
        this.regId = regId;
    }

    public String getReg_date() {
        return reg_date;
    }

    public void setReg_date(String reg_date) {
        this.reg_date = reg_date;
    }

    public String getUpdateId() {
        return updateId;
    }

    public void setUpdateId(String updateId) {
        this.updateId = updateId;
    }

    public String getUpdate_date() {
        return update_date;
    }

    public void setUpdate_date(String update_date) {
        this.update_date = update_date;
    }

    public String getG_temp_field2() {
        return g_temp_field2;
    }

    public void setG_temp_field2(String g_temp_field2) {
        this.g_temp_field2 = g_temp_field2;
    }

    public String getG_temp_field3() {
        return g_temp_field3;
    }

    public void setG_temp_field3(String g_temp_field3) {
        this.g_temp_field3 = g_temp_field3;
    }
}
