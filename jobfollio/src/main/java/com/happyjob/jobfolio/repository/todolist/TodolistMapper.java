package com.happyjob.jobfolio.repository.todolist;

import com.happyjob.jobfolio.vo.todolist.TodolistModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface TodolistMapper {

	// 리스트 조회
	public List<TodolistModel> todolistList(Map<String, Object> paramMap);

	// 카운트 조회
	public int todoCnt(Map<String, Object> paramMap);
	
	public TodolistModel selectTodolistInfo(Map<String, Object> paramMap);
	
	public void insertTodolistInfo(Map<String, Object> paramMap);
	
	public void updateTodolistInfo(Map<String, Object> paramMap);
	
	public void deleteTodolistInfo(Map<String, Object> paramMap);
	
	public String todolistComplete(Map<String, Object> paramMap);
}