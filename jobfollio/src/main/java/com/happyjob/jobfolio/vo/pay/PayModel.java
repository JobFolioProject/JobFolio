package com.happyjob.jobfolio.vo.pay;

public class PayModel {

	public String getOrder_id() {
		return order_id;
	}

	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}

	public String getPayment_key() {
		return payment_key;
	}

	public void setPayment_key(String payment_key) {
		this.payment_key = payment_key;
	}

	public int getUser_no() {
		return user_no;
	}

	public void setUser_no(int user_no) {
		this.user_no = user_no;
	}

	public int getProduct_no() {
		return product_no;
	}

	public void setProduct_no(int product_no) {
		this.product_no = product_no;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getPaid_date() {
		return paid_date;
	}

	public void setPaid_date(String paid_date) {
		this.paid_date = paid_date;
	}

	public String getDay_sale_date() {
		return day_sale_date;
	}

	public void getDay_sale_date(String day_sale_date) {
		this.day_sale_date = day_sale_date;
	}

	public String getMonth_sale_date() {
		return month_sale_date;
	}

	public void setMonth_sale_date(String month_sale_date) {
		this.month_sale_date = month_sale_date;
	}

	public int getTotal_count() {
		return total_count;
	}

	public void setTotal_count(int total_count) {
		this.total_count = total_count;
	}

	public int getTotal_sales() {
		return total_sales;
	}

	public void setTotal_sales(int total_sales) {
		this.total_sales = total_sales;
	}

	public void setDay_sale_date(String day_sale_date) {
		this.day_sale_date = day_sale_date;
	}

	public String getLogin_id() {
		return login_id;
	}

	public void setLogin_id(String login_id) {
		this.login_id = login_id;
	}

	public String getUser_name() {
		return user_name;
	}

	public void setUser_name(String user_name) {
		this.user_name = user_name;
	}

	public String getOrder_name() {
		return order_name;
	}

	public void setOrder_name(String order_name) {
		this.order_name = order_name;
	}

	public String getPay_status() {
		return pay_status;
	}

	public void setPay_status(String pay_status) {
		this.pay_status = pay_status;
	}

	private String order_id;
	private String payment_key;
	private int user_no;
	private int product_no;
	private int amount;
	private String paid_date;
	private String day_sale_date;
	private String month_sale_date;
	private int total_count;
	private int total_sales;
	private String login_id;
	private String user_name;
	private String order_name;
	private String pay_status;
}