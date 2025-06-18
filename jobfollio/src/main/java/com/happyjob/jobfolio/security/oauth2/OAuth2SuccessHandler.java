package com.happyjob.jobfolio.security.oauth2;

import com.happyjob.jobfolio.security.JwtTokenProvider;
import com.happyjob.jobfolio.util.CookieUtil;
import com.happyjob.jobfolio.vo.join.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * OAuth2 로그인 성공 후 JWT 토큰 생성 및 리다이렉트 처리
 */
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CookieUtil cookieUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        try {
            // 1. OAuth2 사용자 정보 추출
            CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
            UserVO user = oauth2User.getUserVO();

            // 2. 기존 JWT 토큰 생성 방식 사용 (DB 컬럼명 그대로 사용)
            String accessToken = jwtTokenProvider.generateAccessToken(
                    user.getLogin_id(),    // login_id (DB 컬럼명)
                    user.getUser_no(),     // user_no (DB 컬럼명)
                    user.getUser_name(),   // user_name (DB 컬럼명)
                    user.getUser_type()    // user_type (DB 컬럼명)
            );

            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getLogin_id());

            // 3. Refresh Token을 HttpOnly 쿠키로 설정 (기존 방식 사용)
            cookieUtil.createRefreshTokenCookie(response, refreshToken);

            // 4. 프론트엔드로 리다이렉트 (Access Token을 쿼리 파라미터로 전달)
            String redirectUrl = "http://localhost:3000/oauth/callback?token=" + accessToken;
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            // 5. 오류 발생 시 에러 페이지로 리다이렉트
            String errorUrl = "http://localhost:3000/oauth/error?message=" +
                    java.net.URLEncoder.encode("로그인 처리 중 오류가 발생했습니다.", "UTF-8");
            response.sendRedirect(errorUrl);
        }
    }
}