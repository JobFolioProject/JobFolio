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

        String alertMessage = "로그인에 실패했습니다.";

        if (exception instanceof OAuth2AuthenticationException) {
            OAuth2AuthenticationException oauth2Exception = (OAuth2AuthenticationException) exception;

            String message = oauth2Exception.getMessage();
            String errorCode = oauth2Exception.getError() != null ?
                    oauth2Exception.getError().getErrorCode() : null;

            if ("DEACTIVATED_USER".equals(errorCode) ||
                    (message != null && message.contains("탈퇴한 계정"))) {
                alertMessage = "탈퇴한 계정입니다. 관리자에게 문의하세요.";
                logger.warn("OAuth2 실패 - 탈퇴 계정 감지: " + message);
            }
        }

        logger.error("OAuth2 인증 실패: " + exception.getMessage());

        response.setContentType("text/html; charset=UTF-8");
        PrintWriter out = response.getWriter();

        String html = "<html><body><script>" +
                "alert('" + alertMessage + "');" +
                "window.location.href = 'http://localhost:3000/';" +
                "</script></body></html>";

        out.print(html);
        out.flush();
    }
}