package com.happyjob.jobfolio.security.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException, ServletException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        errorResponse.put("status", 403);
        errorResponse.put("error", "Access Denied");
        errorResponse.put("message", "접근 권한이 없습니다. 관리자에게 문의하세요.");
        errorResponse.put("path", request.getRequestURI());

        // 현업에서는 보통 상세 정보도 포함
        if (auth != null) {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("currentUser", auth.getName());
            userInfo.put("userAuthorities", auth.getAuthorities());
            userInfo.put("requiredAuthority", getRequiredAuthority(request.getRequestURI()));
            errorResponse.put("userInfo", userInfo);
        }

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    private String getRequiredAuthority(String path) {
        if (path.startsWith("/api/admin/super/")) {
            return "최고관리자(A) 권한 필요";
        } else if (path.startsWith("/api/admin/")) {
            return "관리자(A, B) 권한 필요";
        }
        return "로그인 필요";
    }
}