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

}
