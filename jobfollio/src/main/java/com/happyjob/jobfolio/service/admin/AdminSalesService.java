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
    public int refundSuccess(Map<String, Object> params) throws Exception {
        return adminSalesMapper.refundSuccess(params);
    }

    // 환불 후 구독 기간 빼기
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


        int updated = payMapper.updateExpireDate(userNo, Timestamp.valueOf(updatedExpireDate));
        if (updated == 0) {
            throw new Exception("구독 만료일 갱신 실패");
        }
    }

}
