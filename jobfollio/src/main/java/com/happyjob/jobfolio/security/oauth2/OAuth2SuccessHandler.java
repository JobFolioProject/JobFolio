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
import java.security.MessageDigest;
import java.util.Date;

/**
 * OAuth2 로그인 성공 후 JWT 토큰 생성 및 리다이렉트 처리
 * 일반 로그인과 동일한 토큰 관리 방식 적용
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

        try {
            CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
            UserVO user = oauth2User.getUserVO();

            logger.info("OAuth2 로그인 성공 - 사용자: " + user.getLogin_id());

            // 🔥 JWT 토큰 생성 (일반 로그인과 동일한 방식)
            String accessToken = jwtTokenProvider.generateAccessToken(
                    user.getLogin_id(),
                    user.getUser_no().longValue(),  // ✅ Long으로 변환
                    user.getUser_name(),
                    user.getUser_type(),
                    user.getExpire_days()
            );

            String refreshToken = jwtTokenProvider.generateRefreshToken(user.getLogin_id());

            // 🔥 RefreshToken을 DB에 저장 (일반 로그인과 동일한 방식)
            try {
                String tokenHash = generateTokenHash(refreshToken);

                RefreshTokenVO refreshTokenVO = new RefreshTokenVO();
                refreshTokenVO.setUser_no(user.getUser_no());
                refreshTokenVO.setToken_hash(tokenHash);
                refreshTokenVO.setExpires_at(new Date(System.currentTimeMillis() + (14L * 24 * 60 * 60 * 1000))); // 14일
                refreshTokenVO.setUser_agent(request.getHeader("User-Agent"));

                int insertResult = refreshTokenMapper.insertRefreshToken(refreshTokenVO);

                if (insertResult > 0) {
                    // 🔥 RefreshToken을 HttpOnly 쿠키로 설정
                    cookieUtil.createRefreshTokenCookie(response, refreshToken);

                    // 🔥 AccessToken을 URL 파라미터로 전달
                    String redirectUrl = "http://localhost:3000/oauth/callback?token=" + accessToken;

                    logger.info("OAuth2 로그인 완료 + DB 토큰 저장 성공 - User: " + user.getLogin_id());
                    logger.info("AccessToken 생성: " + accessToken.substring(0, 20) + "...");
                    logger.info("RefreshToken DB 저장: OK");

                    response.sendRedirect(redirectUrl);
                } else {
                    // DB 저장 실패 시 에러 페이지로 리다이렉트
                    throw new Exception("RefreshToken DB 저장 실패");
                }

            } catch (Exception tokenError) {
                logger.error("OAuth2 토큰 저장 중 오류", tokenError);
                throw tokenError;
            }

        } catch (Exception e) {
            logger.error("OAuth2 로그인 처리 중 오류", e);

            String errorMessage = "로그인 처리 중 오류가 발생했습니다.";
            String errorUrl = "http://localhost:3000/oauth/error?message=" +
                    java.net.URLEncoder.encode(errorMessage, "UTF-8");
            response.sendRedirect(errorUrl);
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