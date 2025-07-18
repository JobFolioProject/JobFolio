package com.happyjob.jobfolio.controller.movie;

import com.happyjob.jobfolio.service.movie.Movieservice;
import com.happyjob.jobfolio.vo.movie.MovieModel;
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

@Controller
@RequestMapping("/movie/")
public class MovieController {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();

    @Autowired
    private Movieservice movieservice;

    @RequestMapping("/movielist")
    @ResponseBody
    public Map<String, Object> movielist(Model model, @RequestParam Map<String, Object> paramMap, HttpServletRequest request,
                                             HttpServletResponse response, HttpSession session) throws Exception {

        logger.info("+ Start !!!!" + className);
        logger.info("   - ParamMap !!!! !!!! : " + paramMap);

		int cpage = Integer.parseInt((String) paramMap.get("cpage"));
		int pagesize = Integer.parseInt((String) paramMap.get("pagesize"));
		int startpoint = (cpage - 1) * pagesize;
		  
		paramMap.put("startpoint",startpoint);
		paramMap.put("pagesize",pagesize);
        
        Map<String, Object> resultMap = new HashMap<String, Object>();

        // List<MovieModel> productlist = movieservice.movielist(paramMap);

        resultMap.put("movielist",movieservice.movielist(paramMap));
        resultMap.put("totalcnt",movieservice.movielisttotalcnt(paramMap));

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
            MovieModel movieModel = movieservice.moviedetail(paramMap);

            byte fileByte[] = FileUtils.readFileToByteArray(new File(movieModel.getPhygical_path()));

            response.setContentType("application/octet-stream");
            response.setContentLength(fileByte.length);
            response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(movieModel.getImage_name(),"UTF-8")+"\";");
            response.setHeader("Content-Transfer-Encoding", "binary");
            response.getOutputStream().write(fileByte);

            response.getOutputStream().flush();
            response.getOutputStream().close();

        } catch (Exception e) {
            throw e;
        }
    }


}
