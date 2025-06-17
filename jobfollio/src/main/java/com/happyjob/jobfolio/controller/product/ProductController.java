package com.happyjob.jobfolio.controller.product;

import com.happyjob.jobfolio.service.product.ProductService;
import com.happyjob.jobfolio.vo.product.ProductModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/product")
public class ProductController {

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

	// 관리자 페이지 - 이용권 리스트 조회
	@RequestMapping("/productList")
	@ResponseBody
	public Map<String, Object> productList(@RequestParam Map<String, Object> paramMap) throws Exception {

		int currentPage = Integer.parseInt((String) paramMap.get("currentpage"));
		int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
		int pageIndex = (currentPage - 1) * pageSize;

		paramMap.put("pageIndex", pageIndex);
		paramMap.put("pageSize", pageSize);

		List<ProductModel> productList = productService.productList(paramMap);
		int productCnt = productService.productCnt(paramMap);

		Map<String, Object> resultMap = new HashMap<>();
		resultMap.put("productList", productList);
		resultMap.put("totalcnt", productCnt);

		return resultMap;
	}

	@PostMapping("/insertProduct")
	@ResponseBody
	public Map<String, Object> insertProduct(HttpSession session,@RequestBody Map<String, Object> paramMap, HttpServletRequest request) throws Exception {
		logger.info("insertProduct start");
		logger.info("   - paramMap : " + paramMap);

		Map<String, Object> returnmap = new HashMap<String,Object>();
		try {
			productService.insertProduct(paramMap);

			returnmap.put("resultmsg","등록 되었습니다.");

		} catch (Exception e) {
			throw e;
		}

		return returnmap;
	}

	@PostMapping("/updateProduct")
	@ResponseBody
	public Map<String, Object> updateProduct(HttpSession session,@RequestBody Map<String, Object> paramMap, HttpServletRequest request) throws Exception {
		logger.info("updateProduct start");
		logger.info("   - paramMap : " + paramMap);

		paramMap.put("product_no", paramMap.get("product_no"));
		paramMap.put("price", Integer.parseInt((String)paramMap.get("price")));
		paramMap.put("sub_period", Integer.parseInt((String)paramMap.get("sub_period")));

		Map<String, Object> returnmap = new HashMap<String,Object>();

		try {
			productService.updateProduct(paramMap);

			returnmap.put("resultmsg","수정 되었습니다.");
		} catch (Exception e) {
			throw e;
		}

		return returnmap;
	}

	@PostMapping("/deleteProduct")
	@ResponseBody
	public Map<String, Object> deleteProduct(@RequestBody Map<String, Object> paramMap) throws Exception {
		logger.info("deleteProduct start");
		logger.info("    - paramMap : " + paramMap);

		Map<String, Object> returnmap = new HashMap<>();

		try {
			productService.deleteProduct(paramMap);
			returnmap.put("resultmsg", "삭제 되었습니다.");
		} catch (Exception e) {
			returnmap.put("resultmsg", e.getMessage());
		}

		return returnmap;
	}

}