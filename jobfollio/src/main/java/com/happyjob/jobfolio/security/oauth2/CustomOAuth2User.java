package com.happyjob.jobfolio.security.oauth2;

import com.happyjob.jobfolio.vo.join.UserVO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

/**
 * Spring Security OAuth2User 인터페이스 구현
 * 소셜 로그인 후 생성되는 사용자 객체
 */
public class CustomOAuth2User implements OAuth2User {

    private final UserVO userVO;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(UserVO userVO, Map<String, Object> attributes) {
        this.userVO = userVO;
        this.attributes = attributes;
    }

    /**
     * 소셜 서비스에서 받은 원본 사용자 정보 (JSON)
     */
    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    /**
     * 사용자 권한 정보
     * user_type에 따라 권한 부여: A(최고관리자), B(일반관리자), C(일반사용자)
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role;
        switch (userVO.getUser_type()) {
            case "A":
                role = "ROLE_SUPER_ADMIN";
                break;
            case "B":
                role = "ROLE_ADMIN";
                break;
            case "C":
            default:
                role = "ROLE_USER";
                break;
        }
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    /**
     * 사용자 식별자 (Primary Key)
     * Spring Security에서 사용자를 구분하는 고유값
     */
    @Override
    public String getName() {
        return String.valueOf(userVO.getUser_no());
    }

    /**
     * UserVO 객체 반환
     * JWT 토큰 생성이나 비즈니스 로직에서 사용
     */
    public UserVO getUserVO() {
        return userVO;
    }

    /**
     * 로그인 ID (이메일) 반환
     */
    public String getLoginId() {
        return userVO.getLogin_id();
    }

    /**
     * 사용자 이름 반환
     */
    public String getUserName() {
        return userVO.getUser_name();
    }

    /**
     * 사용자 번호 반환
     */
    public Long getUserNo() {
        return userVO.getUser_no();
    }

    /**
     * 사용자 타입 반환
     */
    public String getUserType() {
        return userVO.getUser_type();
    }

    /**
     * 소셜 로그인 여부 확인
     */
    public boolean isSocialUser() {
        return userVO.isSocialUser();
    }
}