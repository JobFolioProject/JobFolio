package com.happyjob.jobfolio.vo.notice;

import java.sql.Date;

public class BoardInfoVo {
	
	private int id;
	private String question;
	private String answer;
	private Date createdAt;
	private String writer;
	private int priority ;
	private String board_type;
	private String author;

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getBoard_type() {
		return board_type;
	}
	public void setBoard_type(String board_type) {
		this.board_type = board_type;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public String getAnswer() {
		return answer;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}
	public Date getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	public int getPriority() {
		return priority;
	}
	public void setPriority(int priority) {
		this.priority = priority;
	}
	@Override
	public String toString() {
		return "BoardInfoVo [id=" + id + ", question=" + question + ", answer=" + answer + ", createdAt=" + createdAt
				+ ", writer=" + writer + ", priority=" + priority + ", board_type=" + board_type + "]";
	}
	
	
	
	
	
}
