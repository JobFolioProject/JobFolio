package com.happyjob.jobfolio.controller.admin;

import com.happyjob.jobfolio.service.admin.AdminSalesService;
import com.happyjob.jobfolio.vo.pay.PayModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/admin/sales")
public class AdminSalesController {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private AdminSalesService adminSalesService;

    // 관리자 페이지 - 일일 이용현황 조회
    @RequestMapping("/daySalesList")
    @ResponseBody
    public Map<String, Object> daySalesList(@RequestParam Map<String, Object> paramMap) throws Exception {

        int currentPage = Integer.parseInt((String) paramMap.get("currentpage"));
        int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
        int pageIndex = (currentPage - 1) * pageSize;

        paramMap.put("pageIndex", pageIndex);
        paramMap.put("pageSize", pageSize);

        List<PayModel> daySalesList = adminSalesService.daySalesList(paramMap);
        int daySalesCnt = adminSalesService.daySalesCnt(paramMap);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("daySalesList", daySalesList);
        resultMap.put("totalcnt", daySalesCnt);

        return resultMap;
    }

    // 관리자 페이지 - 월별 이용현황 조회
    @RequestMapping("/monthSalesList")
    @ResponseBody
    public Map<String, Object> monthSalesList(@RequestParam Map<String, Object> paramMap) throws Exception {

        int currentPage = Integer.parseInt((String) paramMap.get("currentpage"));
        int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
        int pageIndex = (currentPage - 1) * pageSize;

        paramMap.put("pageIndex", pageIndex);
        paramMap.put("pageSize", pageSize);

        List<PayModel> monthSalesList = adminSalesService.monthSalesList(paramMap);
        int monthSalesCnt = adminSalesService.monthSalesCnt(paramMap);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("monthSalesList", monthSalesList);
        resultMap.put("totalcnt", monthSalesCnt);

        return resultMap;
    }

    // 관리자 페이지 - 일일 이용현황 조회 - 차트
    @RequestMapping("/daySalesChart")
    @ResponseBody
    public Map<String, Object> daySalesChart(@RequestParam Map<String, Object> paramMap) throws Exception {

        List<PayModel> daySalesChart = adminSalesService.daySalesChart(paramMap);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("daySalesChart", daySalesChart);

        return resultMap;
    }

    // 관리자 페이지 - 일일 이용현황 조회 - 차트
    @RequestMapping("/monthSalesChart")
    @ResponseBody
    public Map<String, Object> monthSalesChart(@RequestParam Map<String, Object> paramMap) throws Exception {

        List<PayModel> monthSalesChart = adminSalesService.monthSalesChart(paramMap);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("monthSalesChart", monthSalesChart);

        return resultMap;
    }
}
