package com.happyjob.jobfolio.service.pay;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyjob.jobfolio.repository.pay.PayMapper;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.util.Base64;
import java.util.HashMap;

import java.util.Map;


@Service
public class PayService {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private PayMapper payMapper;

	// 결제 정보 생성
	public int insertOrder(Map<String, Object> params) throws Exception {
		return payMapper.insertOrder(params);
	}

	public int cardSuccess(Map<String, Object> params) throws Exception {
		return payMapper.cardSuccess(params);
	}

	// 결제 후 유저 테이블에서 구독 마감 날짜 갱신
	public void updateUserSubscription(String orderId) throws Exception {
		// order_id로 product_no 담아오기
		Integer productNo = payMapper.selectProductNoByOrderId(orderId);
		
		// product_no로 sub_period 담아오기
		Integer subPeriod = payMapper.selectSubPeriodByProductNo(productNo);
		
		// order_id로 user_no 담아오기
		Integer userNo = payMapper.selectUserNoByOrderId(orderId);

		// 3. 현재 expire_days 확인
		LocalDate currentExpireDate = payMapper.selectExpireDateByUserNo(userNo);
		LocalDate today = LocalDate.now();
		LocalDate baseDate = (currentExpireDate == null || today.isAfter(currentExpireDate))
				? today
				: currentExpireDate;

		LocalDate updatedExpireDate = baseDate.plusMonths(subPeriod);

		// 회원 구독 날짜 갱신
		int updated = payMapper.updateExpireDate(userNo, updatedExpireDate);
		if (updated == 0) {
			throw new Exception("구독 만료일 갱신 실패");
		}
	}

}