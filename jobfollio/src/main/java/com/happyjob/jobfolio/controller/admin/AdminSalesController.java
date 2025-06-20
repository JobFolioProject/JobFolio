package com.happyjob.jobfolio.controller.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyjob.jobfolio.service.admin.AdminSalesService;
import com.happyjob.jobfolio.vo.pay.PayModel;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/admin/sales")
@PropertySource("classpath:application-secret.properties")
public class AdminSalesController {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    @Value("${secretKey}")
    private String secretKey;

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

    // 관리자 페이지 - 결제 내역 조회
    @RequestMapping("/salesHistory")
    @ResponseBody
    public Map<String, Object> salesHistory(@RequestParam Map<String, Object> paramMap) throws Exception {

        int currentPage = Integer.parseInt((String) paramMap.get("currentpage"));
        int pageSize = Integer.parseInt((String) paramMap.get("pagesize"));
        int pageIndex = (currentPage - 1) * pageSize;

        paramMap.put("pageIndex", pageIndex);
        paramMap.put("pageSize", pageSize);

        List<PayModel> salesHistory = adminSalesService.salesHistory(paramMap);
        int salesHistoryCnt = adminSalesService.salesHistoryCnt(paramMap);

        Map<String, Object> resultMap = new HashMap<>();
        resultMap.put("salesHistory", salesHistory);
        resultMap.put("totalcnt", salesHistoryCnt);

        return resultMap;
    }

    @PostMapping("/refundSuccess")
    @ResponseBody
    public Map<String, Object> refundSuccess(@RequestBody Map<String, Object> params) throws Exception {
        String paymentKey = (String) params.get("paymentKey");
        String orderId = (String) params.get("orderId");
        int amount = Integer.parseInt(params.get("amount").toString());

        Map<String, Object> result = new HashMap<>();

        try {
            String encodedAuth = Base64.getEncoder().encodeToString((secretKey + ":").getBytes("UTF-8"));

            URL url = new URL("https://api.tosspayments.com/v1/payments/{paymentKey}/cancel");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Authorization", "Basic " + encodedAuth);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            String jsonBody = String.format(
                    "{\\\"cancelReason\\\":\\\"구매자가 취소를 원함\\\"}"
            );

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonBody.getBytes("UTF-8"));
            }

            int responseCode = conn.getResponseCode();
            InputStream is = (responseCode == 200) ? conn.getInputStream() : conn.getErrorStream();

            BufferedReader in = new BufferedReader(new InputStreamReader(is, "UTF-8"));
            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                responseBody.append(line);
            }
            in.close();

            if (responseCode != 200) {
                result.put("success", false);
                result.put("message", "결제 승인 실패: " + responseBody.toString());
                return result;
            }

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> responseData = mapper.readValue(responseBody.toString(), Map.class);
            Map<String, Object> metadata = (Map<String, Object>) responseData.get("metadata");

            String productNo = metadata.get("product_no").toString();
            String userNo = metadata.get("user_no").toString();
            String orderName = metadata.get("order_name").toString();

            Map<String, Object> paramMap = new HashMap<>();
            paramMap.put("paymentKey", paymentKey);
            paramMap.put("orderId", orderId);
            paramMap.put("amount", amount);
            paramMap.put("product_no", productNo);
            paramMap.put("user_no", userNo);
            paramMap.put("order_name", orderName);

            int inserted = adminSalesService.refundSuccess(paramMap);
            if (inserted > 0) {
                result.put("success", true);
                result.put("message", "환불 성공");

                 updateUserSubscription(orderId);
            } else {
                result.put("success", false);
                result.put("message", "환불 성공");
            }

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "서버 에러: " + e.getMessage());
        }
        return result;
    }

    // 환불 후 구독 기간 빼기
    private void updateUserSubscription(String orderId) throws Exception {
        adminSalesService.updateUserSubscription(orderId);
    }
}
