package com.happyjob.jobfolio.service.admin;

import com.happyjob.jobfolio.repository.admin.AdminMapper;
import com.happyjob.jobfolio.repository.admin.AdminSalesMapper;
import com.happyjob.jobfolio.repository.pay.PayMapper;
import com.happyjob.jobfolio.vo.pay.PayModel;
import com.happyjob.jobfolio.vo.product.ProductModel;
import com.happyjob.jobfolio.vo.usermgr.UserModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminSalesService {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    // Get class name for logger
    private final String className = this.getClass().toString();

    @Autowired
    private AdminSalesMapper adminSalesMapper;

    @Autowired
    private PayMapper payMapper;

    // 관리자 페이지 - 일별 매출 현황
    public List<PayModel> daySalesList(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.daySalesList(paramMap);
    }

    // 관리자 페이지 - 일별 매출 현황
    public int daySalesCnt(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.daySalesCnt(paramMap);
    }

    // 관리자 페이지 - 일별 매출 현황
    public List<PayModel> monthSalesList(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.monthSalesList(paramMap);
    }

    // 관리자 페이지 - 일별 매출 현황
    public int monthSalesCnt(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.monthSalesCnt(paramMap);
    }

    // 관리자 페이지 - 일별 매출 현황 - 차트
    public List<PayModel> daySalesChart(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.daySalesChart(paramMap);
    }

    // 관리자 페이지 - 월별 매출 현황 - 차트
    public List<PayModel> monthSalesChart(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.monthSalesChart(paramMap);
    }

    // 관리자 페이지 - 결제 내역 조회
    public List<PayModel> salesHistory(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.salesHistory(paramMap);
    }

    // 관리자 페이지 - 결제 내역 조회
    public int salesHistoryCnt(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.salesHistoryCnt(paramMap);
    }

    // 관리자 페이지 - 환불 처리 후 상태 값 변경
    public int refundSuccess(Map<String, Object> paramMap) throws Exception {
        return adminSalesMapper.refundSuccess(paramMap);
    }

    // 환불 후 구독 기간 빼기
    public void updateUserSubscription(Map<String, Object> paramMap) throws Exception {
        adminSalesMapper.updateUserSubscription(paramMap);
    }

}
