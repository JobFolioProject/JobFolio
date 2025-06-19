package com.happyjob.jobfolio.security.oauth2;

import com.happyjob.jobfolio.repository.join.RefreshTokenMapper;
import com.happyjob.jobfolio.security.JwtTokenProvider;
import com.happyjob.jobfolio.util.CookieUtil;
import com.happyjob.jobfolio.vo.join.RefreshTokenVO;
import com.happyjob.jobfolio.vo.join.UserVO;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.security.MessageDigest;
import java.util.Date;

/**
 * OAuth2 로그인 성공 후 JWT 토큰 생성 및 리다이렉트 처리
 * 탈퇴 계정의 경우 팝업 알림으로 처리
 */
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private CookieUtil cookieUtil;

    @Autowired
    private RefreshTokenMapper refreshTokenMapper;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        logger.info("=== OAuth2SuccessHandler 시작 ===");

        try {
            CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
            UserVO user = oauth2User.getUserVO();

            logger.info("사용자 정보 - ID: " + user.getLogin_id());
            logger.info("사용자 정보 - 상태: " + user.getStatus_yn());

            // 🚨 탈퇴한 계정 체크 - 팝업 알림 방식으로 처리
            if ("Y".equals(user.getStatus_yn())) {
                logger.warn("🚨 탈퇴한 계정으로 소셜 로그인 시도: " + user.getLogin_id());

                response.setContentType("text/html; charset=UTF-8");
                PrintWriter out = response.getWriter();

                String html = "<html><body><script>" +
                        "alert('탈퇴한 계정입니다. 관리자에게 문의하세요.');" +
                        "window.location.href = 'http://localhost:3000/';" +
                        "</script></body></html>";

                out.print(html);
                out.flush();
                logger.warn("탈퇴 계정 팝업 HTML 응답 완료");
                return;
            }

            logger.info("정상 계정 확인 - 토큰 생성 시작");

            // JWT 토큰 생성
            String accessToken = jwtTokenProvider.generateAccessToken(
                    user.getLogin_id(),
                    user.getUser_no().longValue(),
                    user.getUser_name(),
                    user.getUser_type(),
                    user.getExpire_days()
            );

            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getLogin_id());

            // RefreshToken을 DB에 저장
            try {
                String tokenHash = generateTokenHash(refreshToken);

                RefreshTokenVO refreshTokenVO = new RefreshTokenVO();
                refreshTokenVO.setUser_no(user.getUser_no());
                refreshTokenVO.setToken_hash(tokenHash);
                refreshTokenVO.setExpires_at(new Date(System.currentTimeMillis() + (14L * 24 * 60 * 60 * 1000)));
                refreshTokenVO.setUser_agent(request.getHeader("User-Agent"));

                int insertResult = refreshTokenMapper.insertRefreshToken(refreshTokenVO);

                if (insertResult > 0) {
                    cookieUtil.createRefreshTokenCookie(response, refreshToken);
                    String redirectUrl = "http://localhost:3000/oauth/callback?token=" + accessToken;

                    logger.info("OAuth2 로그인 완료 + DB 토큰 저장 성공 - User: " + user.getLogin_id());
                    response.sendRedirect(redirectUrl);
                } else {
                    throw new Exception("RefreshToken DB 저장 실패");
                }

            } catch (Exception tokenError) {
                logger.error("OAuth2 토큰 저장 중 오류", tokenError);
                throw tokenError;
            }

        } catch (Exception e) {
            logger.error("OAuth2 로그인 처리 중 오류", e);

            // 🚨 일반 에러도 팝업 방식으로 처리
            response.setContentType("text/html; charset=UTF-8");
            PrintWriter out = response.getWriter();

            String html = "<html><body><script>" +
                    "alert('로그인 처리 중 오류가 발생했습니다.');" +
                    "window.location.href = 'http://localhost:3000/';" +
                    "</script></body></html>";

            out.print(html);
            out.flush();
        }
    }

    /**
     * 토큰 해시 생성 (UserService와 동일한 방식)
     */
    private String generateTokenHash(String token) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = md.digest(token.getBytes("UTF-8"));
        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}