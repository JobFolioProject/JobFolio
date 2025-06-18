package com.happyjob.jobfolio.repository.pay;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface PayMapper {

	// 결제 정보 생성
	int insertOrder(Map<String, Object> paramMap);

	// 토스 api 결제 승인시
	int cardSuccess(Map<String, Object> params);

}