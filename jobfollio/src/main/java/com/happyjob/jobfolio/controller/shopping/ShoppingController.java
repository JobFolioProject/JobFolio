package com.happyjob.jobfolio.controller.shopping;

import org.apache.commons.io.FileUtils;
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
import java.io.File;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.happyjob.jobfolio.vo.Shopping.ShoppingModel;
import com.happyjob.jobfolio.service.Shopping.Shoppingservice;

@Controller
@RequestMapping("/shopping/")
public class ShoppingController {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();

    @Autowired
    private Shoppingservice shoppingservice;

    @RequestMapping("/productlist")
    @ResponseBody
    public Map<String, Object> productlist(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
                                             HttpServletResponse response, HttpSession session) throws Exception {

        logger.info("+ Start " + className);
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<String, Object>();

        List<ShoppingModel> productlist = shoppingservice.productlist(paramMap);

        resultMap.put("productlist",productlist);
        resultMap.put("totalcnt",productlist.size());

        logger.info("+ End " + className);

        return resultMap;
    }

    @RequestMapping("/imageblob")
    @ResponseBody
    public void imageblob(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
                                           HttpServletResponse response, HttpSession session) throws Exception {

        logger.info("+ Start " + className);
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<String, Object>();
        try {
            ShoppingModel shoppingModel = shoppingservice.productdetail(paramMap);

            byte fileByte[] = FileUtils.readFileToByteArray(new File(shoppingModel.getPhygical_path()));

            response.setContentType("application/octet-stream");
            response.setContentLength(fileByte.length);
            response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(shoppingModel.getFile_name(),"UTF-8")+"\";");
            response.setHeader("Content-Transfer-Encoding", "binary");
            response.getOutputStream().write(fileByte);

            response.getOutputStream().flush();
            response.getOutputStream().close();

        } catch (Exception e) {
            throw e;
        }
    }

    @RequestMapping("/imagelist")
    @ResponseBody
    public Map<String, Object> imagelist(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
                          HttpServletResponse response, HttpSession session) throws Exception {

        logger.info("+ Start " + className);
        logger.info("   - ParamMap : " + paramMap);

        Map<String, Object> resultMap = new HashMap<String, Object>();

        List<ShoppingModel> imagelist = shoppingservice.imagelist(paramMap);

        resultMap.put("imagelist",imagelist);

        logger.info("+ End " + className);

        return resultMap;
    }


}
