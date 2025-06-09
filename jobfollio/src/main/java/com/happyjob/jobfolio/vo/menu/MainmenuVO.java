package com.happyjob.jobfolio.vo.menu;

public class MainmenuVO {
	
	public String getMnu_id() {
		return mnu_id;
	}
	public void setMnu_id(String mnu_id) {
		this.mnu_id = mnu_id;
	}
	public String getHir_mnu_id() {
		return hir_mnu_id;
	}
	public void setHir_mnu_id(String hir_mnu_id) {
		this.hir_mnu_id = hir_mnu_id;
	}
	public String getHir_mnu_nm() {
		return hir_mnu_nm;
	}
	public void setHir_mnu_nm(String hir_mnu_nm) {
		this.hir_mnu_nm = hir_mnu_nm;
	}
	public String getMnu_nm() {
		return mnu_nm;
	}
	public void setMnu_nm(String mnu_nm) {
		this.mnu_nm = mnu_nm;
	}
	public String getMnu_url() {
		return mnu_url;
	}
	public void setMnu_url(String mnu_url) {
		this.mnu_url = mnu_url;
	}
	public String getMnu_dvs_cod() {
		return mnu_dvs_cod;
	}
	public void setMnu_dvs_cod(String mnu_dvs_cod) {
		this.mnu_dvs_cod = mnu_dvs_cod;
	}
	public String getGrp_num() {
		return grp_num;
	}
	public void setGrp_num(String grp_num) {
		this.grp_num = grp_num;
	}
	public String getOdr() {
		return odr;
	}
	public void setOdr(String odr) {
		this.odr = odr;
	}
	public String getLvl() {
		return lvl;
	}
	public void setLvl(String lvl) {
		this.lvl = lvl;
	}
	public String getMnu_ico_cod() {
		return mnu_ico_cod;
	}
	public void setMnu_ico_cod(String mnu_ico_cod) {
		this.mnu_ico_cod = mnu_ico_cod;
	}
	public String getUse_poa() {
		return use_poa;
	}
	public void setUse_poa(String use_poa) {
		this.use_poa = use_poa;
	}
	public String getDlt_poa() {
		return dlt_poa;
	}
	public void setDlt_poa(String dlt_poa) {
		this.dlt_poa = dlt_poa;
	}
	public int getSubmenucnt() {
		return submenucnt;
	}
	public void setSubmenucnt(int submenucnt) {
		this.submenucnt = submenucnt;
	}
	private String mnu_id;    // 메뉴 ID
	private String hir_mnu_id;  // 상위 메뉴 ID
	private String hir_mnu_nm;  // 상위 메뉴 명
	private String mnu_nm;    // 메뉴 명
	private String mnu_url;   // Menu Url
	private String mnu_dvs_cod; //  메뉴 이미지
	private String grp_num;     // 메뉴 그룹 Number
	private String odr;         // 정렬 순서   메인 메뉴  0   서브 메뉴는 1 ~   
	private String lvl;         // 레벨       메인 메뉴  0   서브 메뉴 1
	private String mnu_ico_cod; //  메뉴 이미지
	private String use_poa;     // 사용 유무    Y
	private String dlt_poa;     // 삭제 유무    
	private int submenucnt;     // 서브메뉴 갯수
	
}

