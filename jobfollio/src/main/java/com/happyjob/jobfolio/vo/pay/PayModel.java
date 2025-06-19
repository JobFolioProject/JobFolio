package com.happyjob.jobfolio.vo.pay;

public class PayModel {

	private String order_id;

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

	private String payment_key;
	private int user_no;
	private int product_no;
	private int amount;
	private String paid_date;
	private String day_sale_date;
	private String month_sale_date;
	private int total_count;
	private int total_sales;
}