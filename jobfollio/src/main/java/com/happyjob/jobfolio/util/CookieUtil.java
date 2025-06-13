package com.happyjob.jobfolio.util;

import org.springframework.stereotype.Component;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class CookieUtil {

    // Access Token 쿠키 이름
    public static final String ACCESS_TOKEN_COOKIE_NAME = "accessToken";

    // Refresh Token 쿠키 이름
    public static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

    /**
     * Access Token 쿠키 생성
     */
    public void createAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(ACCESS_TOKEN_COOKIE_NAME, token);
        cookie.setHttpOnly(true);        // XSS 방지
        cookie.setSecure(false);         // 개발환경에서는 false, 운영환경에서는 true
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60);       // 15분 (초 단위)

        response.addCookie(cookie);
    }

    /**
     * Refresh Token 쿠키 생성
     */
    public void createRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, token);
        cookie.setHttpOnly(true);        // XSS 방지
        cookie.setSecure(false);         // 개발환경에서는 false, 운영환경에서는 true
        cookie.setPath("/");
        cookie.setMaxAge(14 * 24 * 60 * 60); // 14일 (초 단위)

        response.addCookie(cookie);
    }

    /**
     * 쿠키에서 토큰 값 추출
     */
    public String getTokenFromCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /**
     * SameSite 속성이 포함된 Access Token 쿠키 생성
     */
    public void createAccessTokenCookieWithSameSite(HttpServletResponse response, String token) {
        // 기본 쿠키 생성
        createAccessTokenCookie(response, token);

        // SameSite 속성을 수동으로 추가
        String cookieHeader = String.format("%s=%s; Path=/; HttpOnly; Max-Age=%d; SameSite=Lax",
                ACCESS_TOKEN_COOKIE_NAME, token, 15 * 60);
        response.setHeader("Set-Cookie", cookieHeader);
    }


    /**
     * Access Token 쿠키에서 토큰 추출
     */
    public String getAccessTokenFromCookie(HttpServletRequest request) {
        return getTokenFromCookie(request, ACCESS_TOKEN_COOKIE_NAME);
    }

    /**
     * Refresh Token 쿠키에서 토큰 추출
     */
    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        return getTokenFromCookie(request, REFRESH_TOKEN_COOKIE_NAME);
    }

    /**
     * 쿠키 삭제 (로그아웃 시 사용)
     */
    public void deleteCookie(HttpServletResponse response, String cookieName) {
        Cookie cookie = new Cookie(cookieName, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료

        response.addCookie(cookie);
    }

    /**
     * 모든 인증 쿠키 삭제
     */
    public void deleteAllAuthCookies(HttpServletResponse response) {
        deleteCookie(response, ACCESS_TOKEN_COOKIE_NAME);
        deleteCookie(response, REFRESH_TOKEN_COOKIE_NAME);
    }

    /**
     * 쿠키 존재 여부 확인
     */
    public boolean hasCookie(HttpServletRequest request, String cookieName) {
        return getTokenFromCookie(request, cookieName) != null;
    }

    /**
     * 운영환경용 Secure 쿠키 설정
     */
    public void createSecureAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(ACCESS_TOKEN_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(15 * 60);

        response.addCookie(cookie);
    }

    /**
     * 운영환경용 Secure Refresh Token 쿠키 설정
     */
    public void createSecureRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(14 * 24 * 60 * 60);

        response.addCookie(cookie);
    }
}