package com.happyjob.jobfolio.controller.todolist;

import com.happyjob.jobfolio.service.Usermgr.UsermgrService;
import com.happyjob.jobfolio.service.todolist.TodolistService;
import com.happyjob.jobfolio.vo.todolist.TodolistModel;
import com.happyjob.jobfolio.vo.usermgr.UserModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("/todolist/")
public class TodolistController {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private TodolistService todolistService;
	
	// todolist 리스트 출력
	@RequestMapping("todolistList")
	@ResponseBody
	public Map<String, Object> todolistList(Model model, @RequestParam Map<String, Object> paramMap,
			HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		int currentPage = Integer.parseInt((String) paramMap.get("currentPage")); // 현재페이지
		int pageSize = paramMap.get("pageSize") != null
				? Integer.parseInt((String) paramMap.get("pageSize"))
				: 5;
		int pageIndex = (currentPage - 1) * pageSize;
		
		paramMap.put("pageIndex", pageIndex);
		paramMap.put("pageSize", pageSize);

		// 목록 조회
		List<TodolistModel> todolistList = todolistService.todolistList(paramMap);
		// 목록 수 추출해서 보내기
		int todoCnt = todolistService.todoCnt(paramMap);

		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("listData", todolistList); // success 용어 담기
		resultMap.put("totalcnt", todoCnt); // 리턴 값 해쉬에 담기
		resultMap.put("pageSize", pageSize);
		resultMap.put("currentPage", currentPage);

		return resultMap;
	}
	
	// 할일 단건 출력
	@RequestMapping("selecttodolistinfo")
	@ResponseBody
	public Map<String, Object> selectTodolistInfo(Model model, @RequestParam Map<String, Object> paramMap,
			HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();

		// 상세 조회
		try {
			TodolistModel selectTodolistInfo = todolistService.selectTodolistInfo(paramMap);
			 resultMap.put("selectTodolistInfo", selectTodolistInfo); // success 용어 담기
			 result = "Y";
			 resultmsg = "조회 되었습니다.";
		} catch(Exception e) {
			 resultMap.put("selectTodolistInfo", null); // success 용어 담기
			 result = "N";
			 resultmsg = e.getMessage();
		}

		resultMap.put("result", result); // success 용어 담기
		resultMap.put("resultmsg", resultmsg); // success 용어 담기

		return resultMap;
	}

	// 사용자관리 저장
	@RequestMapping("insertTodolistInfo")
	@ResponseBody
	public Map<String, Object> insertTodolistInfo(Model model, @RequestParam Map<String, Object> paramMap,
			HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();

		try {
			 todolistService.insertTodolistInfo(paramMap);
			 result = "Y";
			 resultmsg = "저장 되었습니다.";

		} catch(Exception e) {
//			 resultMap.put("data", null); // success 용어 담기
			 result = "N";
			 resultmsg = e.getMessage();
		}

		resultMap.put("result", result); // success 용어 담기
		resultMap.put("resultmsg", resultmsg); // success 용어 담기

		return resultMap;
	}
	// 사용자관리 수정
	@RequestMapping("updateTodolistInfo")
	@ResponseBody
	public Map<String, Object> updateTodolistInfo(Model model, @RequestParam Map<String, Object> paramMap,
												  HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();

		try {
			todolistService.updateTodolistInfo(paramMap);
			result = "Y";
			resultmsg = "수정 되었습니다.";

		} catch(Exception e) {
			result = "N";
			resultmsg = e.getMessage();
		}

		resultMap.put("result", result); // success 용어 담기
		resultMap.put("resultmsg", resultmsg); // success 용어 담기

		return resultMap;
	}
	// 사용자관리 삭제
	@RequestMapping("deleteTodolistInfo")
	@ResponseBody
	public Map<String, Object> deleteTodolistInfo(Model model, @RequestParam Map<String, Object> paramMap,
												  HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();

		try {
			todolistService.deleteTodolistInfo(paramMap);
			result = "Y";
			resultmsg = "삭제 되었습니다.";

		} catch(Exception e) {
			result = "N";
			resultmsg = e.getMessage();
		}

		resultMap.put("result", result); // success 용어 담기
		resultMap.put("resultmsg", resultmsg); // success 용어 담기

		return resultMap;
	}

	// 사용자관리 삭제
	@RequestMapping("todolistComplete")
	@ResponseBody
	public Map<String, Object> todolistComplete(Model model, @RequestParam Map<String, Object> paramMap,
												  HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();

		try {
			todolistService.todolistComplete(paramMap);
			result = "Y";
			resultmsg = "상태가 변경 되었습니다.";

		} catch(Exception e) {
			result = "N";
			resultmsg = e.getMessage();
		}

		resultMap.put("result", result); // success 용어 담기
		resultMap.put("resultmsg", resultmsg); // success 용어 담기

		return resultMap;
	}
}