package com.happyjob.jobfolio.controller.pay;

import com.happyjob.jobfolio.service.pay.PayService;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pay")
public class PayController {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private PayService payService;

	// 결제 정보 생성 후 데이터 초기 저장
	@PostMapping(value = "/insertOrder", produces = "application/json")
	public Map<String, Object> insertOrder(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestBody Map<String, Object> params) throws Exception {

		Map<String, Object> returnmap = new HashMap<>();
		try {
			returnmap = payService.insertOrder(params);
			returnmap.put("resultmsg", "등록 되었습니다.");

			System.out.println("📦 returnmap: " + returnmap);
		} catch (Exception e) {
			int deleted = payService.deleteOrder(params);
			returnmap.put("resultmsg", e.getMessage());
		}
			return returnmap;
	}

	// 결제 성공
	@PostMapping("/cardSuccess")
	public Map<String, Object> payToss(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestBody Map<String, Object> params) throws Exception {

		Map<String, Object> returnmap = new HashMap<>();

//		HttpRequest request = HttpRequest.newBuilder()
//				.uri(URI.create("https://api.tosspayments.com/v1/payments/confirm"))
//				.header("Authorization", "Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==")
//				.header("Content-Type", "application/json")
//				.method("POST", HttpRequest.BodyPublishers.ofString("{\"paymentKey\":\"{PAYMENT_KEY}\",\"amount\"{AMOUNT}\",\"orderId\":\"{ORDER_ID}\"}"))
//				.build();
//		HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
//		System.out.println(response.body());

		try {
			returnmap = payService.cardSuccess(params);
			returnmap.put("resultmsg", "결제 되었습니다.");

		} catch (Exception e) {
			returnmap.put("resultmsg", e.getMessage());
		}

		return returnmap;
	}


	// 결제 실패 (종류에 상관없이 동일하게 처리)
	@GetMapping("/cardFail")
	public RedirectView cardFail(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestParam(value = "code", required = true) String code,
			@RequestParam(value = "message", required = true) String message
	) {

		return new RedirectView("/cashMain" + "?pgMessage=" + message);
	}





}