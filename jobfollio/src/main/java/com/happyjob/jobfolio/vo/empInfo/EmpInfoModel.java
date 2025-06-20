package com.happyjob.jobfolio.vo.empInfo;

import java.util.ArrayList;
import java.util.List;

public class EmpInfoModel {
    private String emp_no;
    private String emp_name;
    private String dept_cd;
    private String dept_name;
    private String lv;
    private String up_dept_cd;
    private String up_dept_name;
    private String reg_date;
    private String fraction_yn;
    
    private List<EmpInfoModel> boardVoList;
    
    public List<EmpInfoModel> getBoardVoList() {
		return boardVoList;
	}
	public void setBoardVoList(List<EmpInfoModel> boardVoList) {
		this.boardVoList = boardVoList;
	}
	public String getEmp_no() {
		return emp_no;
	}
	public void setEmp_no(String emp_no) {
		this.emp_no = emp_no;
	}
	public String getEmp_name() {
		return emp_name;
	}
	public void setEmp_name(String emp_name) {
		this.emp_name = emp_name;
	}
	public String getDept_cd() {
		return dept_cd;
	}
	public void setDept_cd(String dept_cd) {
		this.dept_cd = dept_cd;
	}
	public String getDept_name() {
		return dept_name;
	}
	public void setDept_name(String dept_name) {
		this.dept_name = dept_name;
	}
	public String getLv() {
		return lv;
	}
	public void setLv(String lv) {
		this.lv = lv;
	}
	public String getUp_dept_cd() {
		return up_dept_cd;
	}
	public void setUp_dept_cd(String up_dept_cd) {
		this.up_dept_cd = up_dept_cd;
	}
	public String getUp_dept_name() {
		return up_dept_name;
	}
	public void setUp_dept_name(String up_dept_name) {
		this.up_dept_name = up_dept_name;
	}
	public String getReg_date() {
		return reg_date;
	}
	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}
	public String getFraction_yn() {
		return fraction_yn;
	}
	public void setFraction_yn(String fraction_yn) {
		this.fraction_yn = fraction_yn;
	}
    
}
