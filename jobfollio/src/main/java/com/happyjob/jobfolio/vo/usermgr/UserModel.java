package com.happyjob.jobfolio.vo.usermgr;

public class UserModel {

	private int user_no;
	private String login_id;     // 로그인 ID
	private String user_type;   // 사용자 종류 A : 관리자  B : User   공통코드 관리
	private String user_name;        // 이름
	private String password;    // 비밀번호
	private String birthday;    // 생년월일
	private String sex;        // 성별 -- 남자 : M   여성 : W
	private String hp;          // 핸드폰 번호 -- XXX-XXXX-XXXX
	private String reg_date;     // 등록일자
	private String withdrawal_date;
	private String status_yn;         // 지역코드 -- 공통코드   02 : 서울
	private String expire_days;     // 지역명
	private String address;        // 주소
	private String hobby;       // 우편번호
	private String note;     // 상세주소


	public int getUser_no() {
		return user_no;
	}

	public void setUser_no(int user_no) {
		this.user_no = user_no;
	}

	public String getLogin_id() {
		return login_id;
	}

	public void setLogin_id(String login_id) {
		this.login_id = login_id;
	}

	public String getUser_type() {
		return user_type;
	}

	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getBirthday() {
		return birthday;
	}

	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getHp() {
		return hp;
	}

	public void setHp(String hp) {
		this.hp = hp;
	}

	public String getReg_date() {
		return reg_date;
	}

	public void setReg_date(String reg_date) {
		this.reg_date = reg_date;
	}

	public String getWithdrawal_date() {
		return withdrawal_date;
	}

	public void setWithdrawal_date(String withdrawal_date) {
		this.withdrawal_date = withdrawal_date;
	}

	public String getStatus_yn() {
		return status_yn;
	}

	public void setStatus_yn(String status_yn) {
		this.status_yn = status_yn;
	}

	public String getExpire_days() {
		return expire_days;
	}

	public void setExpire_days(String expire_days) {
		this.expire_days = expire_days;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getHobby() {
		return hobby;
	}

	public void setHobby(String hobby) {
		this.hobby = hobby;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}
}
