package com.happyjob.jobfolio.controller.mainProduct;

import com.happyjob.jobfolio.service.product.ProductService;
import com.happyjob.jobfolio.vo.product.ProductModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/product")
public class mainProductController {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	@Autowired
	private ProductService productService;

	// 메인 페이지 - 이용권 리스트 조회
	@RequestMapping("/mainProductList")
	@ResponseBody
	public Map<String, Object> mainProductList(@RequestParam Map<String, Object> paramMap) throws Exception {

		logger.info("   - paramMap : " + paramMap);

		List<ProductModel> mainProductList = productService.mainProductList(paramMap);

		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("mainProductList", mainProductList);

		return resultMap;
	}

}