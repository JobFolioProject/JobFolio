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
            CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
            UserVO user = oauth2User.getUserVO();

            String accessToken = jwtTokenProvider.generateAccessToken(
                    user.getLogin_id(),
                    user.getUser_no(),
                    user.getUser_name(),
                    user.getUser_type(),
                    user.getExpire_days()
            );

            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getLogin_id());

            cookieUtil.createRefreshTokenCookie(response, refreshToken);

            String redirectUrl = "http://localhost:3000/oauth/callback?token=" + accessToken;
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            String errorUrl = "http://localhost:3000/oauth/error?message=" +
                    java.net.URLEncoder.encode("로그인 처리 중 오류가 발생했습니다.", "UTF-8");
            response.sendRedirect(errorUrl);
        }
    }
}