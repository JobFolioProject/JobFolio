package com.happyjob.jobfolio.repository.admin;

import com.happyjob.jobfolio.vo.pay.PayModel;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminSalesMapper {

    // 일별 매출 조회
    public List<PayModel> daySalesList(Map<String, Object> paramMap);

    // 일별 매출 조회 (페이지네이션)
    public int daySalesCnt(Map<String, Object> paramMap);

    // 월별 매출 조회
    public List<PayModel> monthSalesList(Map<String, Object> paramMap);

    // 월별 매출 조회 (페이지네이션)
    public int monthSalesCnt(Map<String, Object> paramMap);

    // 일별 매출 조회 - 차트
    public List<PayModel> daySalesChart(Map<String, Object> paramMap);

    // 월별 매출 조회 - 차트
    public List<PayModel> monthSalesChart(Map<String, Object> paramMap);

    // 관리자 페이지 - 결제 내역 조회
    public List<PayModel> salesHistory(Map<String, Object> paramMap);

    // 관리자 페이지 - 결제 내역 조회 (페이지네이션)
    public int salesHistoryCnt(Map<String, Object> paramMap);

    // 관리자 페이지 - 결제 상태값 환불로 변경
    int refundSuccess(Map<String, Object> paramMap) throws Exception;

    // 관리자 페이지 - 환불 후 구독 기간 차감
    void updateUserSubscription(Map<String, Object> paramMap);
}