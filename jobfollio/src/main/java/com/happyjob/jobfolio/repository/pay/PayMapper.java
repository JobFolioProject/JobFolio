package com.happyjob.jobfolio.repository.pay;

import com.happyjob.jobfolio.vo.pay.PayModel;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PayMapper {

	// 카드 결제
	public Map<String, Object> insertpayCard(Map<String, Object> paramMap);

	// 카드 결제
	public Map<String, Object> cardSuccess(Map<String, Object> paramMap);
	

}