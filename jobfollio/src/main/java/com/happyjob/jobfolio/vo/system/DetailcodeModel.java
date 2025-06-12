package com.happyjob.jobfolio.vo.system;

public class DetailcodeModel {

	private String detail_code;
	private String group_code;
	private String detail_name;
	private String note;
	private String use_yn;
	private String regId;
	private String reg_date;
	private String updateId;
	private String update_date;
	private int sequence;
	private String d_temp_field1;
	private String d_temp_field2;
	private String d_temp_field3;
	private String d_temp_field4;

	@Override
	public String toString() {
		return "DetailcodeModel{" +
				"detail_code='" + detail_code + '\'' +
				", group_code='" + group_code + '\'' +
				", detail_name='" + detail_name + '\'' +
				", note='" + note + '\'' +
				", use_yn='" + use_yn + '\'' +
				", regId='" + regId + '\'' +
				", reg_date='" + reg_date + '\'' +
				", updateId='" + updateId + '\'' +
				", update_date='" + update_date + '\'' +
				", sequence=" + sequence +
				", d_temp_field1='" + d_temp_field1 + '\'' +
				", d_temp_field2='" + d_temp_field2 + '\'' +
				", d_temp_field3='" + d_temp_field3 + '\'' +
				", d_temp_field4='" + d_temp_field4 + '\'' +
				'}';
	}

	public String getDetail_code() {
		return detail_code;
	}

	public void setDetail_code(String detail_code) {
		this.detail_code = detail_code;
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

	public int getSequence() {
		return sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public String getD_temp_field1() {
		return d_temp_field1;
	}

	public void setD_temp_field1(String d_temp_field1) {
		this.d_temp_field1 = d_temp_field1;
	}

	public String getD_temp_field2() {
		return d_temp_field2;
	}

	public void setD_temp_field2(String d_temp_field2) {
		this.d_temp_field2 = d_temp_field2;
	}

	public String getD_temp_field3() {
		return d_temp_field3;
	}

	public void setD_temp_field3(String d_temp_field3) {
		this.d_temp_field3 = d_temp_field3;
	}

	public String getD_temp_field4() {
		return d_temp_field4;
	}

	public void setD_temp_field4(String d_temp_field4) {
		this.d_temp_field4 = d_temp_field4;
	}
}
