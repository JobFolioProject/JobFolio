package com.happyjob.jobfolio.service.pay;

import com.happyjob.jobfolio.repository.pay.PayMapper;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
		return payMapper.insertOrder(params);
	}

	// 결제 실패시 결제 정보 삭제
    public int deleteOrder(Map<String, Object> params) throws Exception {
		return payMapper.deleteOrder(params);
	}

	// 결제
	public Map<String, Object> payToss(Map<String, Object> params) throws Exception {
		return payMapper.payToss(params);
	}

	public Map<String, Object> cardSuccess(Map<String, Object> params) throws Exception {
		return payMapper.cardSuccess(params);
	}
}