package com.happyjob.jobfolio.repository.admin;

import com.happyjob.jobfolio.vo.pay.PayModel;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminSalesMapper {

    // 일별 매출 조회
    public List<PayModel> daySalesList(Map<String, Object> paramMap);

    // 일별 매출 조회
    public int daySalesCnt(Map<String, Object> paramMap);

    // 월별 매출 조회
    public List<PayModel> monthSalesList(Map<String, Object> paramMap);

    // 월별 매출 조회
    public int monthSalesCnt(Map<String, Object> paramMap);

    // 일별 매출 조회 - 차트
    public List<PayModel> daySalesChart(Map<String, Object> paramMap);

    // 월별 매출 조회 - 차트
    public List<PayModel> monthSalesChart(Map<String, Object> paramMap);
}