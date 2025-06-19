package com.happyjob.jobfolio.service.pay;

import com.happyjob.jobfolio.repository.pay.PayMapper;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;

import java.sql.Date;
import java.time.LocalDateTime;
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

	//  결제 완료 후 유저 구독 기간 갱신
	public void updateUserSubscription(String orderId) throws Exception {
		// 1. 주문 번호로 상품 번호 조회
		Integer productNo = payMapper.selectProductNoByOrderId(orderId);
		if (productNo == null) {
			throw new Exception("상품 번호를 찾을 수 없습니다.");
		}

		// 2. 상품 번호로 구독 기간 조회
		Integer subPeriod = payMapper.selectSubPeriodByProductNo(productNo);
		if (subPeriod == null) {
			throw new Exception("구독 개월 수(sub_period)를 찾을 수 없습니다.");
		}

		// 3. 주문 번호로 유저 번호 조회
		Integer userNo = payMapper.selectUserNoByOrderId(orderId);
		if (userNo == null) {
			throw new Exception("회원 번호를 찾을 수 없습니다.");
		}

		// 4. 유저의 기존 만료일 조회
		Timestamp expireDateTs = payMapper.selectExpireDateByUserNo(userNo);
		LocalDateTime currentExpireDate = (expireDateTs != null)
				? expireDateTs.toLocalDateTime()
				: null;

		LocalDateTime now = LocalDateTime.now();
		LocalDateTime baseDate = (currentExpireDate == null || now.isAfter(currentExpireDate))
				? now
				: currentExpireDate;

		LocalDateTime updatedExpireDate = baseDate.plusMonths(subPeriod);

		// 상품 구독 기간 만큼 DB 업데이트
		int updated = payMapper.updateExpireDate(userNo, Timestamp.valueOf(updatedExpireDate));
		if (updated == 0) {
			throw new Exception("구독 만료일 갱신 실패");
		}
	}
}