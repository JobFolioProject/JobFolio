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

	public Map<String, Object> insertpayCard(Map<String, Object> params) throws Exception {
		return payMapper.insertpayCard(params);
	}

	public Map<String, Object> cardSuccess(Map<String, Object> params) throws Exception {
		return payMapper.cardSuccess(params);
	}
}