package com.happyjob.jobfolio.service.product;

import com.happyjob.jobfolio.repository.product.ProductMapper;
import com.happyjob.jobfolio.vo.product.ProductModel;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private ProductMapper productMapper;

	// 메인 페이지 - 이용권 리스트 조회
	public List<ProductModel> mainProductList(Map<String, Object> paramMap) throws Exception {
		return productMapper.mainProductList(paramMap);
	}

	// 관리자 페이지 - 이용권 리스트 조회
	public List<ProductModel> productList(Map<String, Object> paramMap) throws Exception {
		return productMapper.productList(paramMap);
	}

	public int productCnt(Map<String, Object> paramMap) throws Exception {
		return productMapper.productCnt(paramMap);
	}


	public void insertProduct(Map<String, Object> paramMap) throws Exception {
		productMapper.insertProduct(paramMap);
	}

	public void updateProduct(Map<String, Object> paramMap) throws Exception {
		productMapper.updateProduct(paramMap);
	}

	public void deleteProduct(Map<String, Object> paramMap) throws Exception {
		List<Integer> productNos = (List<Integer>) paramMap.get("product_no");
		productMapper.deleteProduct(productNos);
	}
}