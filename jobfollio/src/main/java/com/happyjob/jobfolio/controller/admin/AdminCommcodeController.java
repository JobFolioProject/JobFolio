package com.happyjob.jobfolio.controller.admin;

import com.happyjob.jobfolio.security.UserPrincipal;
import com.happyjob.jobfolio.service.admin.CommcodeService;
import com.happyjob.jobfolio.vo.admin.CommcodeModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin")
public class AdminCommcodeController {
	
	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();
	   
	
	@Autowired
	private CommcodeService commcodeservice;

		
	@RequestMapping("/listgroupcode")
	public Map<String, Object> listgroupcode(@RequestBody Map<String, Object> paramMap
											 ) throws Exception {

	      logger.info("+ Start Commcodecontroller.listgroupcode");
		  logger.info("   - ParamMap : " + paramMap);

		  Map<String, Object> searchdata = (Map<String, Object>) paramMap.get("searchdata");
		    
		  // 페이지 번호

		int cpage = Integer.parseInt( searchdata.get("cpage").toString() );
		int pagesize = Integer.parseInt( searchdata.get("pagesize").toString() );
		System.out.println("cpage: " + cpage);
		  int startpoint = (cpage - 1) * pagesize;
		  
		  paramMap.put("startpoint",startpoint);
		  paramMap.put("pagesize",pagesize);		  
		  
		  String result;
		  String resultMsg;
		  Map<String, Object> resultMap = new HashMap<String, Object>();
		  
		  
		  try {
			  List<CommcodeModel> commcodeModel = commcodeservice.listgroupcode(paramMap);
	          int totalcnt = commcodeservice.totalcntgroupcode(paramMap);

		      resultMap.put("commcodeModel", commcodeModel);
		      resultMap.put("totalcnt", totalcnt);
		      resultMap.put("result", "Y");
	  
		  } catch (Exception e) {
			  resultMap.put("result", "N");
		  }	  
	  
	  
	    logger.info("+ End Commcodecontroller.listgroupcode");

	    return resultMap;
    }
	   	
	@RequestMapping("/savegroupcode")
	public Map<String, Object> savegroupcode(@RequestBody Map<String, Object> paramMap,
											 @AuthenticationPrincipal UserPrincipal userPrincipal) throws Exception {

	      logger.info("+ Start Commcodecontroller.savegroupcode");
		  logger.info("   - ParamMap : " + paramMap);
		    
		  String result;
		  String resultMsg;
		  Map<String, Object> resultMap = new HashMap<String, Object>();
		  
		  String action = paramMap.get("action").toString();
		  paramMap.put("liginid",userPrincipal.getUser_no().toString());
		  
		  try {
			  
			  if("I".equals(action)) {
				  commcodeservice.insertgroupcode(paramMap);
			  } else if("U".equals(action)) {
				  commcodeservice.updategroupcode(paramMap);				  
			  } else if("D".equals(action)) {
				  commcodeservice.deletegroupcode(paramMap);
			  }

		      resultMap.put("result", "SUCCESS");
	  
		  } catch (Exception e) {
			  resultMap.put("result", "FAIL");
			  resultMap.put("resultmsg", e.getMessage());
		  }	  
	  
	  
	    logger.info("+ End Commcodecontroller.savegroupcode");

	    return resultMap;
    }
	
	@RequestMapping("/selectgroupcode")
	public Map<String, Object> selectgroupcode(@RequestBody Map<String, Object> paramMap) throws Exception {

	      logger.info("+ Start Commcodecontroller.selectgroupcode");
		  logger.info("   - ParamMap : " + paramMap);
		    
		  String result;
		  String resultMsg;
		  Map<String, Object> resultMap = new HashMap<String, Object>();
		   
		  try {
			  CommcodeModel commcodeModel = commcodeservice.selectgroupcode(paramMap);

			  resultMap.put("commcodeModel", commcodeModel);			  
		      resultMap.put("result", "SUCCESS");
	  
		  } catch (Exception e) {
			  resultMap.put("result", "FAIL");
			  resultMap.put("resultmsg", e.getMessage());
		  }	  
	  
	  
	    logger.info("+ End Commcodecontroller.selectgroupcode");

	    return resultMap;
    }
	
	@RequestMapping("/listdetailcode")
	public Map<String, Object> listdetailcode(@RequestBody Map<String, Object> paramMap) throws Exception {

	      logger.info("+ Start Commcodecontroller.listdetailcode");
		  logger.info("   - ParamMap : " + paramMap);

		Map<String, Object> detaildata = (Map<String, Object>) paramMap.get("detaildata");

		// 1) group_code를 꺼내서 paramMap에 추가
		String groupCode = Objects.toString(detaildata.get("group_code"), "");
		paramMap.put("group_code", groupCode);

		int cpage = Integer.parseInt( detaildata.get("cpage").toString() );
		int pagesize = Integer.parseInt( detaildata.get("pagesize").toString() );
		  int startpoint = (cpage - 1) * pagesize;
		  
		  paramMap.put("startpoint",startpoint);
		  paramMap.put("pagesize",pagesize);
		  
		  String result;
		  String resultMsg;
		  Map<String, Object> resultMap = new HashMap<String, Object>();
		  
		  
		  try {
			  List<CommcodeModel> commcodeModel = commcodeservice.listdetailcode(paramMap);
	          int totalcnt = commcodeservice.totalcntdetailcode(paramMap);

		      resultMap.put("commcodeModel", commcodeModel);
		      resultMap.put("totalcnt", totalcnt);
		      resultMap.put("result", "Y");
	  
		  } catch (Exception e) {
			  resultMap.put("result", "N");
		  }	  
	  
	  
	    logger.info("+ End Commcodecontroller.listdetailcode");

	    return resultMap;
    }	
	

	@RequestMapping("/savedetailcode")
	public Map<String, Object> savedetailcode(@RequestBody Map<String, Object> paramMap,
											  @AuthenticationPrincipal UserPrincipal userPrincipal) throws Exception {

	      logger.info("+ Start Commcodecontroller.savedetailcode");
		  logger.info("   - ParamMap : " + paramMap);
		    
		  String result;
		  String resultMsg;
		  Map<String, Object> resultMap = new HashMap<String, Object>();
		  
		  String action = (String) paramMap.get("action");
		  paramMap.put("loginId",userPrincipal.getUser_no().toString());
		  
		  logger.info("   - loginId : " + paramMap.get("loginId"));
		  
		  
		  try {
			  
			  if("I".equals(action)) {
				  commcodeservice.insertdetailcode(paramMap);
			  } else if("U".equals(action)) {
				  commcodeservice.updatedetailcode(paramMap);				  
			  } else if("D".equals(action)) {
				  commcodeservice.deletedetailcode(paramMap);
			  }

		      resultMap.put("result", "SUCCESS");
	  
		  } catch (Exception e) {
			  resultMap.put("result", "FAIL");
			  resultMap.put("resultmsg", e.getMessage());
		  }	  
	  
	  
	    logger.info("+ End Commcodecontroller.savedetailcode");

	    return resultMap;
    }
	

	@RequestMapping("/selectdetailcode")
	public Map<String, Object> selectdetailcode(@RequestBody Map<String, Object> paramMap) throws Exception {

	      logger.info("+ Start Commcodecontroller.selectdetailcode");
		  logger.info("   - ParamMap : " + paramMap);
		    
		  String result;
		  String resultMsg;
		  Map<String, Object> resultMap = new HashMap<String, Object>();
		   
		  try {
			  CommcodeModel commcodeModel = commcodeservice.selectdetailcode(paramMap);

			  resultMap.put("commcodeModel", commcodeModel);			  
		      resultMap.put("result", "SUCCESS");
	  
		  } catch (Exception e) {
			  resultMap.put("result", "FAIL");
			  resultMap.put("resultmsg", e.getMessage());
		  }	  
	  
	  
	    logger.info("+ End Commcodecontroller.selectdetailcode");

	    return resultMap;
    }
}