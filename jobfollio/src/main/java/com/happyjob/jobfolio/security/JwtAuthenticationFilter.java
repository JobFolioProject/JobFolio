package com.happyjob.jobfolio.security;

import com.happyjob.jobfolio.util.CookieUtil;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CookieUtil cookieUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            // Authorization Header에서 Bearer Token 추출 (새로운 방식)
            String accessToken = extractTokenFromRequest(request);

            if (StringUtils.hasText(accessToken) && jwtTokenProvider.validateAccessToken(accessToken)) {
                // 토큰에서 사용자 정보 추출 (DB 컬럼명과 통일)
                String login_id = jwtTokenProvider.getLoginIdFromToken(accessToken);
                Long user_no = jwtTokenProvider.getUserNoFromToken(accessToken);
                String user_name = jwtTokenProvider.getUserNameFromToken(accessToken);
                String user_type = jwtTokenProvider.getUserTypeFromToken(accessToken);

                if (login_id != null && user_type != null) {
                    // UserPrincipal 생성 (user_type 포함)
                    UserPrincipal userPrincipal = new UserPrincipal(user_no, login_id, user_name, user_type);

                    // 동적 권한 생성: DB의 user_type(A,B,C) → ROLE_A, ROLE_B, ROLE_C
                    String authority = "ROLE_" + user_type;  // "ROLE_A", "ROLE_B", "ROLE_C"
                    SimpleGrantedAuthority grantedAuthority = new SimpleGrantedAuthority(authority);

                    // Authentication 객체 생성
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userPrincipal,
                                    null,
                                    Collections.singletonList(grantedAuthority)
                            );

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    logger.debug("JWT authentication successful for user: " + login_id + ", authority: " + authority);
                }
            } else {
                logger.debug("No valid access token found in Authorization header");
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication", e);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Authorization Header에서 Bearer Token 추출 (Bearer Token 방식)
     */
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 제거하고 토큰만 반환
        }

        return null;
    }

    /**
     * 특정 경로는 필터를 건너뛰도록 설정
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();

        // 정적 리소스나 인증이 불필요한 경로는 필터 건너뛰기
        return path.startsWith("/static/") ||
                path.startsWith("/public/") ||
                path.startsWith("/css/") ||
                path.startsWith("/js/") ||
                path.startsWith("/images/") ||
                path.equals("/favicon.ico");
    }
}