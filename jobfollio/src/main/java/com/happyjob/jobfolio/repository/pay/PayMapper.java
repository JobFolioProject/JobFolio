package com.happyjob.jobfolio.repository.pay;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.Date;
import java.util.Map;

@Mapper
public interface PayMapper {

	// 결제 정보 생성
	int insertOrder(Map<String, Object> paramMap);

	// 토스 api 결제 승인시
	int cardSuccess(Map<String, Object> params);

	// 아래부터 구독 기간 갱신 기능
	Integer selectProductNoByOrderId(String orderId);

	Integer selectSubPeriodByProductNo(Integer productNo);

	Integer selectUserNoByOrderId(String orderId);

	Timestamp selectExpireDateByUserNo(Integer userNo);

	int updateExpireDate(@Param("userNo") Integer userNo,
						 @Param("newExpireDate") Timestamp newExpireDate);

}