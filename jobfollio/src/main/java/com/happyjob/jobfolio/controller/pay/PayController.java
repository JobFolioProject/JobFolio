package com.happyjob.jobfolio.controller.pay;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyjob.jobfolio.service.pay.PayService;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
@PropertySource("classpath:application-secret.properties")
public class PayController {

	private final Logger logger = LogManager.getLogger(this.getClass());

	@Value("${secretKey}")
	private String secretKey;

	@Autowired
	private PayService payService;

	private String generateOrderId() {
		int randomNum = (int)(Math.random() * 1_000_000);
		return "order_" + String.format("%06d", randomNum);
	}

	@PostMapping(value = "/insertOrder", produces = "application/json")
	public Map<String, Object> insertOrder(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestBody Map<String, Object> params) {

		Map<String, Object> returnmap = new HashMap<>();
		try {
			String orderId = generateOrderId();
			params.put("orderId", orderId);

			returnmap.put("orderId", orderId);
			returnmap.put("product_no", params.get("product_no"));
			returnmap.put("user_no", params.get("user_no"));
			returnmap.put("order_name", params.get("order_name"));
			returnmap.put("amount", params.get("amount"));
		} catch (Exception e) {
			returnmap.put("resultmsg", e.getMessage());
		}

		return returnmap;
	}

	@PostMapping("/cardSuccess")
	@ResponseBody
	public Map<String, Object> cardSuccess(@RequestBody Map<String, Object> params) throws Exception {
		String paymentKey = (String) params.get("paymentKey");
		String orderId = (String) params.get("orderId");
		int amount = Integer.parseInt(params.get("amount").toString());

		Map<String, Object> result = new HashMap<>();

		try {
			String encodedAuth = Base64.getEncoder().encodeToString((secretKey + ":").getBytes("UTF-8"));

			URL url = new URL("https://api.tosspayments.com/v1/payments/confirm");
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();

			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", "Basic " + encodedAuth);
			conn.setRequestProperty("Content-Type", "application/json");
			conn.setDoOutput(true);

			String jsonBody = String.format(
					"{\"paymentKey\":\"%s\", \"orderId\":\"%s\", \"amount\":%d}",
					paymentKey, orderId, amount
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

			int inserted = payService.cardSuccess(paramMap);
			if (inserted > 0) {
				result.put("success", true);
				result.put("message", "DB 저장 성공");

				postUpdateProcess(orderId);
			} else {
				result.put("success", false);
				result.put("message", "DB 저장 실패");
			}

		} catch (Exception e) {
			result.put("success", false);
			result.put("message", "서버 에러: " + e.getMessage());
		}
		return result;
	}


	private void postUpdateProcess(String orderId) throws Exception {
		payService.updateUserSubscription(orderId);
	}
}
