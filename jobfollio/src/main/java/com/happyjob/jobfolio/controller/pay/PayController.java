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

@Controller
@RequestMapping("/pay")
public class PayController {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	// Get class name for logger
	private final String className = this.getClass().toString();

	@Autowired
	private PayService payService;

	// ORDER_ID용 랜덤 숫자 6자리 생성
	private String generateOrderId() {
		int randomNum = (int)(Math.random() * 1_000_000);
		String padded = String.format("%06d", randomNum);
		return "order_" + padded;
	}

	// 결제 정보 생성 후 데이터 초기 저장
	@PostMapping("/insertOrder")
	public Map<String, Object> insertOrder(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestBody Map<String, Object> params) throws Exception {

		Map<String, Object> returnmap = new HashMap<>();
		try {
			String orderId = generateOrderId();
			params.put("orderId", orderId);

			returnmap = payService.insertOrder(params);
			returnmap.put("resultmsg", "등록 되었습니다.");

		} catch (Exception e) {
			int deleted = payService.deleteOrder(params);
			returnmap.put("resultmsg", e.getMessage());
			returnmap.put("deleteCount", deleted);
		}

			return returnmap;
	}

	// 결제
	@PostMapping("/payToss")
	public Map<String, Object> payToss(
			HttpServletRequest request,
			HttpServletResponse response,
			@RequestBody Map<String, Object> params) throws Exception {

		Map<String, Object> returnmap = new HashMap<>();

		HttpRequest request = HttpRequest.newBuilder()
				.uri(URI.create("https://api.tosspayments.com/v1/payments/confirm"))
				.header("Authorization", "Basic dGVzdF9za196WExrS0V5cE5BcldtbzUwblgzbG1lYXhZRzVSOg==")
				.header("Content-Type", "application/json")
				.method("POST", HttpRequest.BodyPublishers.ofString("{\"paymentKey\":\"{PAYMENT_KEY}\",\"amount\"{AMOUNT}\",\"orderId\":\"{ORDER_ID}\"}"))
				.build();
		HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
		System.out.println(response.body());

		try {
			returnmap = payService.payToss(params);
			returnmap.put("resultmsg", "결제 되었습니다.");

		} catch (Exception e) {
			returnmap.put("resultmsg", e.getMessage());
		}

		return returnmap;
	}

	// 결제 성공
//	@GetMapping("/cardSuccess")
//	public Map<String, Object> cardSuccess(
//			HttpServletRequest request,
//			HttpServletResponse response,
//			@RequestParam(value = "paymentKey", required = true) String paymentKey,
//			@RequestParam(value = "orderId", required = true) String orderId,
//			@RequestParam(value = "amount", required = true) int amount
//	) {
//		Map<String, Object> returnmap = new HashMap<String,Object>();
//		String message = "";
//        try {
//            Map<String, Object> params = new HashMap<>();
//            params.put("paymentKey", paymentKey);
//            params.put("orderId", orderId);
//            params.put("amount", amount);
//
//            returnmap = payService.cardSuccess(params);
//
//
//        } finally {
//
//        }
//
//		if (!message.equals("")) {
//			return new RedirectView("/cashMain" + "?pgMessage=" + message);
//		}
//
//		return new RedirectView("/cashMain");
//	}

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