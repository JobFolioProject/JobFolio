package com.happyjob.jobfolio.controller.menu;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;

import com.happyjob.jobfolio.vo.menu.MainmenuVO;
import com.happyjob.jobfolio.vo.menu.MenupermitVO;
import com.happyjob.jobfolio.service.menu.MenuService;

@Controller
@RequestMapping("/menu/")
public class MenuController {
   
   // Set logger
   private final Logger logger = LogManager.getLogger(this.getClass());

   // Get class name for logger
   private final String className = this.getClass().toString();
      
   
   @Autowired
   private MenuService menuservice;

   
   @RequestMapping("/mainmenusearch")
   @ResponseBody
   public Map<String, Object> mainmenusearch(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.mainmenusearch");
        logger.info("   - ParamMap : " + paramMap);
        
        int currentPage = Integer.parseInt((String) paramMap.get("currentpage")); // 현재페이지
        int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
        int pageIndex = (currentPage - 1) * pageSize;          
         
        paramMap.put("pageIndex", pageIndex);
        paramMap.put("pageSize", pageSize);
          
        
        String result;
        String resultMsg;
        Map<String, Object> resultMap = new HashMap<String, Object>();
        
         List<MainmenuVO> mainmenulist = menuservice.mainmenusearch(paramMap); 
         int totalcnt = menuservice.mainmenusearchtotalcnt(paramMap); 
         
       
        resultMap.put("mainmenulist", mainmenulist);
        resultMap.put("totalcnt", totalcnt);
     
         logger.info("+ End MenuController.mainmenusearch");

         return resultMap;
    }
   
   @RequestMapping("/submenusearch")
   @ResponseBody
   public Map<String, Object> submenusearch(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.submenusearch");
        logger.info("   - ParamMap : " + paramMap);
        
        int currentPage = Integer.parseInt((String) paramMap.get("currentpage")); // 현재페이지
        int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
        int pageIndex = (currentPage - 1) * pageSize;          
         
        paramMap.put("pageIndex", pageIndex);
        paramMap.put("pageSize", pageSize);
          
        
        String result;
        String resultMsg;
        Map<String, Object> resultMap = new HashMap<String, Object>();
        
         List<MainmenuVO> mainmenulist = menuservice.submenusearch(paramMap); 
         int totalcnt = menuservice.submenusearchtotalcnt(paramMap); 
         
       
        resultMap.put("submenulist", mainmenulist);
        resultMap.put("totalcnt", totalcnt);
     
         logger.info("+ End MenuController.submenusearch");

         return resultMap;
   }
   
   @RequestMapping("/mainmenudupcheck")
   @ResponseBody
   public Map<String, Object> mainmenudupcheck(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.mainmenudupcheck");
        logger.info("   - ParamMap : " + paramMap);                
        
        String result;
        String resultMsg;
        Map<String, Object> resultMap = new HashMap<String, Object>();
        
         int idcnt = menuservice.mainmenudupcheck(paramMap);
         
         if(idcnt > 0) {
            result = "N";
            resultMsg = "중복 되었습니다";
         } else {
            result = "Y";
            resultMsg = "사용 가능 합니다.";
         }
       
        resultMap.put("result", result);
        resultMap.put("resultMsg", resultMsg);
     
         logger.info("+ End MenuController.mainmenudupcheck");

         return resultMap;
   }
   
   
   @RequestMapping("/mainmenusave")
   @ResponseBody
   public Map<String, Object> mainmenusave(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.mainmenusave");
        logger.info("   - ParamMap : " + paramMap);                
        
        String result = "";
        String resultMsg = "";
        Map<String, Object> resultMap = new HashMap<String, Object>();
        
        String action = (String) paramMap.get("action");
        int idcnt = 0;
        
        try {
           if("I".equals(action)) {
              idcnt = menuservice.mainmenuinsert(paramMap);   
              resultMsg = "등록 되었습니다";
           } else if("U".equals(action)) {
              idcnt = menuservice.mainmenuipdate(paramMap);   
              resultMsg = "수정 되었습니다";
           } else {
              idcnt = menuservice.mainmenudelete(paramMap);   
              resultMsg = "삭제 되었습니다";
           }
           
           result = "Y";            
           
        } catch(Exception e) {
           result = "N";
            resultMsg = "저장 중 Error 발생";           
        }
               
        resultMap.put("result", result);
        resultMap.put("resultMsg", resultMsg);
     
         logger.info("+ End MenuController.mainmenusave");

         return resultMap;
   }
   
   @RequestMapping("/mainmenudetail")
   @ResponseBody
   public Map<String, Object> mainmenudetail(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.mainmenudetail");
        logger.info("   - ParamMap : " + paramMap);                
                
        Map<String, Object> resultMap = new HashMap<String, Object>();
                
        MainmenuVO mainmenuinfo  = menuservice.mainmenudetail(paramMap);            
               
        resultMap.put("mainmenuinfo", mainmenuinfo);
     
         logger.info("+ End MenuController.mainmenudetail");

         return resultMap;
   }
   
   @RequestMapping("/submenuidcheck")
   @ResponseBody
   public Map<String, Object> submenuidcheck(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.submenuidcheck");
        logger.info("   - ParamMap : " + paramMap);                
                
        Map<String, Object> resultMap = new HashMap<String, Object>();
        String result = "";        
        String resultMsg = "";
        
        int cnt  = menuservice.mainmenudupcheck(paramMap);   
        
        if(cnt == 0) {
           result = "Y";
           resultMsg = "사용 가능 합니다.";
        } else {
           result = "N";
           resultMsg = "사용 불가능 합니다.";
        }
               
        resultMap.put("result", result);
        resultMap.put("resultMsg", resultMsg);
     
         logger.info("+ End MenuController.submenuidcheck");

         return resultMap;
   }   

   @RequestMapping("/submenuselect")
   @ResponseBody
   public Map<String, Object> submenuselect(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.submenuselect");
        logger.info("   - ParamMap : " + paramMap);                
                
        Map<String, Object> resultMap = new HashMap<String, Object>();
        
        MainmenuVO submenuinfo  =  menuservice.submenuselect(paramMap);   
                               
        resultMap.put("submenuinfo", submenuinfo);
     
         logger.info("+ End MenuController.submenuselect");

         return resultMap;
   }      
   
   @RequestMapping("/submenusave")
   @ResponseBody
   public Map<String, Object> submenusave(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.submenusave");
        logger.info("   - ParamMap : " + paramMap);                
        
        String result = "";
        String resultMsg = "";
        Map<String, Object> resultMap = new HashMap<String, Object>();
        
        String action = (String) paramMap.get("action");
        int idcnt = 0;
        
        try {
           if("I".equals(action)) {
              idcnt = menuservice.submenuinsert(paramMap);   
              resultMsg = "등록 되었습니다";
           } else if("U".equals(action)) {
              idcnt = menuservice.submenuipdate(paramMap);   
              resultMsg = "수정 되었습니다";
           } else {
              idcnt = menuservice.submenudelete(paramMap);   
              resultMsg = "삭제 되었습니다";
           }
           
           result = "Y";            
           
        } catch(Exception e) {
           result = "N";
            resultMsg = "저장 중 Error 발생";           
        }
               
        resultMap.put("result", result);
        resultMap.put("resultMsg", resultMsg);
     
         logger.info("+ End MenuController.submenusave");

         return resultMap;
   }
   
   @RequestMapping("/selectpermmit")
   @ResponseBody
   public Map<String, Object> selectpermmit(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.selectpermmit");
        logger.info("   - ParamMap : " + paramMap);                
        
        String result = "";
        String resultMsg = "";
        Map<String, Object> resultMap = new HashMap<String, Object>();
               
        List<MenupermitVO> list = menuservice.selectpermmit(paramMap);   
                       
        resultMap.put("list", list);
     
         logger.info("+ End MenuController.selectpermmit");

         return resultMap;
   }   
   
   @RequestMapping("/savepermit")
   @ResponseBody
   public Map<String, Object> savepermit(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
            HttpServletResponse response, HttpSession session) throws Exception {

         logger.info("+ Start MenuController.savepermit");
        logger.info("   - ParamMap : " + paramMap);                
        
        String result = "";
        String resultMsg = "";
        Map<String, Object> resultMap = new HashMap<String, Object>();
               
          //      변경 전      변경 후
        //      A   B      A     B
          // A12   O   O            O     
        // 처리 방법
        //   A12   A,B  Delete
        //  A12     B   insert
        //   A1     A  하위메뉴가 있냐   O : 삭제 불가    X : 삭제     
        //   A1     B   select   권한 있다   insert X   없다  insert
        
        
        menuservice.deletepermmit(paramMap);   
        
        String managepermit = (String) paramMap.get("manage");        
        if("Y".equals(managepermit)) {
           menuservice.insertpermmit("A", paramMap);   
           
           // main menu count 
           // 존재 하지 않으면 메인메뉴 insert
           int mainmenu = menuservice.mainmenupermmitcount("A", paramMap);   
           if(mainmenu == 0) menuservice.mainmenuinsertpermit("A", paramMap);
           
        }

        String userpermit = (String) paramMap.get("user");        
        if("Y".equals(userpermit)) {
           menuservice.insertpermmit("B", paramMap);   
           
           // main menu count 
           // 존재 하지 않으면 메인메뉴 insert
           int mainmenu = menuservice.mainmenupermmitcount("B", paramMap);   
           if(mainmenu == 0) menuservice.mainmenuinsertpermit("B", paramMap);
        }
        
         
        int mangecnt = menuservice.mainmenupermmitselect("A", paramMap);   // 관리자 상위 메뉴의   대한 하위메누 건수
        if(mangecnt == 0) menuservice.mainmenupermmitdelete("A", paramMap);
                       
        int usercnt = menuservice.mainmenupermmitselect("B", paramMap);   // 사용자 상위 메뉴의   대한 하위메누 건수
        if(usercnt == 0) menuservice.mainmenupermmitdelete("B", paramMap);
                   
        
        resultMap.put("result", "Y");
     
         logger.info("+ End MenuController.savepermit");

         return resultMap;
   }      
   
      
      
}