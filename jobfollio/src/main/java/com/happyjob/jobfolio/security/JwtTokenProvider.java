package com.happyjob.jobfolio.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final Logger logger = LogManager.getLogger(this.getClass());

    // application.properties에서 설정값 읽기
    @Value("${jwt.secret:mySecretKeyForJwtTokenGenerationThatShouldBeLongEnoughForSecurityPurposes}")
    private String jwtSecret;

    @Value("${jwt.access-expiration:900000}") // 15분
    private long accessTokenExpiration;

    @Value("${jwt.refresh-expiration:1209600000}") // 14일
    private long refreshTokenExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Access Token 생성
     */
    public String generateAccessToken(String login_id, Long user_no, String user_name, String user_type, Date expire_days) {
        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("user_no", user_no);
        claims.put("user_name", user_name);
        claims.put("user_type", user_type);
        claims.put("expire_days", expire_days);
        claims.put("tokenType", "ACCESS");

        return createToken(claims, login_id, accessTokenExpiration);
    }

    /**
     * Refresh Token 생성
     */
    public String generateRefreshToken(String login_id) {
        Map<String, Object> claims = new HashMap<String, Object>();
        claims.put("tokenType", "REFRESH");

        return createToken(claims, login_id, refreshTokenExpiration);
    }

    /**
     * 토큰 생성 공통 메서드
     */
    private String createToken(Map<String, Object> claims, String subject, long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 토큰에서 추출
     */
    public String getLoginIdFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            logger.error("Error extracting login ID from token", e);
            return null;
        }
    }

    /**
     * 토큰에서 사용자 번호 추출
     */
    public Long getUserNoFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Object userNoObj = claims.get("user_no");
            if (userNoObj instanceof Integer) {
                return ((Integer) userNoObj).longValue();
            } else if (userNoObj instanceof Long) {
                return (Long) userNoObj;
            }
            return null;
        } catch (Exception e) {
            logger.error("Error extracting user number from token", e);
            return null;
        }
    }

    /**
     * 토큰에서 사용자 이름 추출
     */
    public String getUserNameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return (String) claims.get("user_name");
        } catch (Exception e) {
            logger.error("Error extracting user name from token", e);
            return null;
        }
    }

    /**
     * 토큰 타입 확인 (ACCESS/REFRESH)
     */
    public String getTokenTypeFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return (String) claims.get("tokenType");
        } catch (Exception e) {
            logger.error("Error extracting token type from token", e);
            return null;
        }
    }


    /**
     * 토큰 만료 시간 확인
     */
    public Date getExpirationDateFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration();
        } catch (Exception e) {
            logger.error("Error extracting expiration date from token", e);
            return null;
        }
    }

    /**
     * 토큰 만료 여부 확인
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration != null && expiration.before(new Date());
        } catch (Exception e) {
            return true;
        }
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            logger.error("Invalid JWT signature", e);
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token", e);
        } catch (ExpiredJwtException e) {
            logger.error("Expired JWT token", e);
        } catch (UnsupportedJwtException e) {
            logger.error("Unsupported JWT token", e);
        } catch (IllegalArgumentException e) {
            logger.error("JWT token compact of handler are invalid", e);
        }
        return false;
    }

    /**
     * Access Token 전용 검증
     */
    public boolean validateAccessToken(String token) {
        if (!validateToken(token)) {
            return false;
        }

        String tokenType = getTokenTypeFromToken(token);
        return "ACCESS".equals(tokenType);
    }

    /**
     * 토큰에서 사용자 타입 추출
     */
    public String getUserTypeFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return (String) claims.get("user_type");
        } catch (Exception e) {
            logger.error("Error extracting user type from token", e);
            return null;
        }
    }

    /**
     * Refresh Token 전용 검증 (타입 체크 포함)
     */
    public boolean validateRefreshToken(String token) {
        if (!validateToken(token)) {
            return false;
        }

        String tokenType = getTokenTypeFromToken(token);
        return "REFRESH".equals(tokenType);
    }

//    사용자 결제 만료일 추출
    public Date getUserExpireDaysFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            Object expireObj = claims.get("expire_days");
            if (expireObj instanceof Long) {
                return new Date((Long) expireObj);
            } else if (expireObj instanceof Integer) {
                return new Date(((Integer) expireObj).longValue());
            };

            return null;
        } catch (Exception e) {
            logger.error("Error extracting user type from token", e);
            return null;
        }
    }
}