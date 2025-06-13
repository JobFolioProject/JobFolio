package com.happyjob.jobfolio.repository.product;

import com.happyjob.jobfolio.vo.product.ProductModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ProductMapper {

	// 메인 페이지 - 이용권 리스트 조회
	public List<ProductModel> mainProductList(Map<String, Object> paramMap);

	// 관리자 페이지 - 이용권 리스트 조회
	public List<ProductModel> productList(Map<String, Object> paramMap);

	// 이용권 목록 카운트 조회
	public int productCnt(Map<String, Object> paramMap);

	// 이용권 생성
	public void insertProduct(Map<String, Object> paramMap) throws Exception;

	// 이용권 수정
	public void updateProduct(Map<String, Object> paramMap) throws Exception;

	// 이용권 삭제
	public void deleteProduct(Map<String, Object> paramMap) throws Exception;

}