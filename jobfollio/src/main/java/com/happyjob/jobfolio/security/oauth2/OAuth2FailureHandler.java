package com.happyjob.jobfolio.security.oauth2;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
public class OAuth2FailureHandler implements AuthenticationFailureHandler {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        String errorMessage = "로그인에 실패했습니다.";
        String errorCode = "LOGIN_ERROR";

        if (exception instanceof OAuth2AuthenticationException) {
            OAuth2AuthenticationException oauth2Exception = (OAuth2AuthenticationException) exception;

            String message = oauth2Exception.getMessage();
            String oauthErrorCode = oauth2Exception.getError() != null ?
                    oauth2Exception.getError().getErrorCode() : null;

            if ("DEACTIVATED_USER".equals(oauthErrorCode) ||
                    (message != null && message.contains("탈퇴한 계정"))) {
                errorMessage = "탈퇴한 계정입니다. 관리자에게 문의하세요.";
                errorCode = "DEACTIVATED_USER";
                logger.warn("OAuth2 실패 - 탈퇴 계정 감지: " + message);
            } else if (message != null && message.contains("이미 가입된 계정")) {
                errorMessage = message;
                errorCode = "DUPLICATE_ACCOUNT";
            }
        }

        logger.error("OAuth2 인증 실패: " + exception.getMessage());

        // 🚨 커스텀 에러 모달을 사용하도록 리다이렉트
        String redirectUrl = String.format(
                "http://localhost:3000/oauth/callback?error=true&message=%s&code=%s",
                java.net.URLEncoder.encode(errorMessage, "UTF-8"),
                errorCode
        );

        response.sendRedirect(redirectUrl);
    }
}