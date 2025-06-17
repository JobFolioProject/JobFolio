package com.happyjob.jobfolio.repository.pay;

import com.happyjob.jobfolio.vo.pay.PayModel;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface PayMapper {

	// 결제 정보 생성
	int insertOrder(Map<String, Object> paramMap);

	// 결제 실패시 미리 생성한 결제 정보 삭제
	int deleteOrder(Map<String, Object> params);

	// 카드 결제 성공시
	public Map<String, Object> cardSuccess(Map<String, Object> paramMap);
	

}