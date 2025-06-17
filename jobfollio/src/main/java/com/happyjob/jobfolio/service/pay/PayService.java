package com.happyjob.jobfolio.service.pay;

import com.happyjob.jobfolio.repository.pay.PayMapper;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
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
	public Map<String, Object> insertOrder(Map<String, Object> params) throws Exception {
		System.out.println("=== insertOrder 시작 ===");
		System.out.println("params: " + params);

		Map<String, Object> returnmap = new HashMap<>();

		int randomNumber = (int) (Math.random() * 900000) + 100000;
		String orderId = "order_" + randomNumber;

		params.put("orderId", orderId);

		payMapper.insertOrder(params);

		returnmap.put("orderId", orderId);
		returnmap.put("user_no", params.get("user_no"));
		returnmap.put("order_name", params.get("order_name"));
		returnmap.put("amount", params.get("amount"));

		return returnmap;
	}

	// 결제창 열기 실패시 생성한 결제 정보 삭제
    public int deleteOrder(Map<String, Object> params) throws Exception {
		return payMapper.deleteOrder(params);
	}

	// 결제 성공
	public Map<String, Object> cardSuccess(Map<String, Object> params) throws Exception {
		return payMapper.cardSuccess(params);
	}
}