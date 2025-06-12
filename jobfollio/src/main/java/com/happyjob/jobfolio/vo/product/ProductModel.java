package com.happyjob.jobfolio.vo.product;

public class ProductModel {

	private int product_no;
	private String product_name;
	private String product_detail;
	private int price;
	private int sub_period;
	private String created_date;
	private String use_yn;

	public int getProduct_no() {
		return product_no;
	}

	public void setProduct_no(int product_no) {
		this.product_no = product_no;
	}

	public String getProduct_name() {
		return product_name;
	}

	public void setProduct_name(String product_name) {
		this.product_name = product_name;
	}

	public String getproduct_detail() {
		return product_detail;
	}

	public void setproduct_detail(String product_detail) {
		this.product_detail = product_detail;
	}

	public int getPrice() {
		return price;
	}

	public void setPrice(int price) {
		this.price = price;
	}

	public int getSub_period() {
		return sub_period;
	}

	public void setSub_period(int sub_period) {
		this.sub_period = sub_period;
	}

	public String getCreated_date() {
		return created_date;
	}

	public void setCreated_date(String created_date) {
		this.created_date = created_date;
	}

	public String getUse_yn() {
		return use_yn;
	}

	public void setUse_yn(String use_yn) {
		this.use_yn = use_yn;
	}
}