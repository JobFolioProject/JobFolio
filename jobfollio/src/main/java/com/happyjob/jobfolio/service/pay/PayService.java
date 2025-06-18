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
	public int updateDate(Map<String, Object> params) throws Exception {
		return payMapper.updateDate(params);
	}

}