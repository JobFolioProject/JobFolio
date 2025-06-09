package com.happyjob.jobfolio.controller.usermgr;

import java.io.File;
import java.io.FileInputStream;
import java.io.StringReader;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.Charset;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.happyjob.jobfolio.service.Usermgr.UsermgrService;
import com.happyjob.jobfolio.vo.usermgr.UserModel;


@Controller
@RequestMapping("/usermgr/")
public class UsermgrController {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private UsermgrService usermgrService;
	
	// 사용자관리 리스트 출력
	@RequestMapping("userListvue.do")
	@ResponseBody
	public Map<String, Object> userListvue(Model model, @RequestParam Map<String, Object> paramMap,
			HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		int currentPage = Integer.parseInt((String) paramMap.get("currentpage")); // 현재페이지
		int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
		int pageIndex = (currentPage - 1) * pageSize;
		
		paramMap.put("pageIndex", pageIndex);
		paramMap.put("pageSize", pageSize);

		// 목록 조회
		List<UserModel> userList = usermgrService.userList(paramMap);
		// 목록 수 추출해서 보내기
		int userCnt = usermgrService.userCnt(paramMap);

		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("listdate", userList); // success 용어 담기
		resultMap.put("totalcnt", userCnt); // 리턴 값 해쉬에 담기
		resultMap.put("pageSize", pageSize);
		resultMap.put("currentPage", currentPage);

		return resultMap;
	}
	
	// 사용자관리 리스트 출력
	@RequestMapping("selectuserinfo.do")
	@ResponseBody
	public Map<String, Object> selectuserinfo(Model model, @RequestParam Map<String, Object> paramMap,
			HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		// 상세 조회
		try {
			 UserModel userinfo = usermgrService.selectuserinfo(paramMap);
			 resultMap.put("userinfo", userinfo); // success 용어 담기
			 result = "Y";
			 resultmsg = "조회 되었습니다.";	
		} catch(Exception e) {
			 resultMap.put("userinfo", null); // success 용어 담기
			 result = "N";
			 resultmsg = e.getMessage();	
		}
				
		resultMap.put("result", result); // success 용어 담기
		resultMap.put("resultmsg", resultmsg); // success 용어 담기
		
		return resultMap;
	}

	// 사용자관리 저장
	@RequestMapping("saveuserinfo.do")
	@ResponseBody
	public Map<String, Object> saveuserinfo(Model model, @RequestParam Map<String, Object> paramMap,
			HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		String action = (String) paramMap.get("action");
		

		
		// 상세 조회
		try {
			 usermgrService.saveuserinfo(paramMap);
			 result = "Y";
			 
			 if("D".equals(action) || action == "D") {  // 등록
				 resultmsg = "삭제 되었습니다.";
			 } else {  // 삳제
				 resultmsg = "저장 되었습니다.";
			 }
		} catch(Exception e) {
			 resultMap.put("userinfo", null); // success 용어 담기
			 result = "N";
			 resultmsg = e.getMessage();	
		}
				
		resultMap.put("result", result); // success 용어 담기
		resultMap.put("resultmsg", resultmsg); // success 용어 담기
		
		return resultMap;
	}
			
	// 사용자관리 리스트 출력
	@RequestMapping("loginidcheck.do")
	@ResponseBody
	public Map<String, Object> loginidcheck(Model model, @RequestParam Map<String, Object> paramMap,
				HttpServletRequest request, HttpServletResponse response, HttpSession session) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		String result = "";
		String resultmsg = "";
		Map<String, Object> resultMap = new HashMap<String, Object>();
				
		int idcount = 0;
		// 상세 조회
		try {
			 idcount = usermgrService.loginidcheck(paramMap);
		} catch(Exception e) {
			 idcount = 0;	
		}
					
		resultMap.put("count", idcount);  
			
		return resultMap;
	}
	

}