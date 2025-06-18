package com.happyjob.jobfolio.security.oauth2;

import com.happyjob.jobfolio.repository.join.UserMapper;
import com.happyjob.jobfolio.vo.join.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * OAuth2 사용자 정보를 처리하는 핵심 서비스
 * 소셜 로그인 시 사용자 정보를 가져오고 DB에 저장/조회
 */
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oauth2User = super.loadUser(userRequest);
            String registrationId = userRequest.getClientRegistration().getRegistrationId();

            SocialUserInfo socialUserInfo = extractUserInfo(registrationId, oauth2User);

            UserVO user = processOAuth2User(socialUserInfo);

            return new CustomOAuth2User(user, oauth2User.getAttributes());

        } catch (Exception e) {
            throw new OAuth2AuthenticationException("소셜 로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 소셜별 사용자 정보 추출
     */
    private SocialUserInfo extractUserInfo(String registrationId, OAuth2User oauth2User) {
        switch (registrationId.toLowerCase()) {
            case "google":
                return extractGoogleInfo(oauth2User);
            case "kakao":
                return extractKakaoInfo(oauth2User);
            case "naver":
                return extractNaverInfo(oauth2User);
            default:
                throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인: " + registrationId);
        }
    }

    /**
     * 구글 사용자 정보 추출
     */
    private SocialUserInfo extractGoogleInfo(OAuth2User oauth2User) {
        String originalEmail = oauth2User.getAttribute("email");
        String prefixedEmail = originalEmail != null ? "GOOGLE_" + originalEmail : null;

        return SocialUserInfo.builder()
                .social_type("GOOGLE")
                .social_id(oauth2User.getAttribute("sub"))
                .login_id(prefixedEmail)  // GOOGLE_ 식별키 추가
                .user_name(oauth2User.getAttribute("name"))
                .build();
    }

    /**
     * 카카오 사용자 정보 추출
     */
    @SuppressWarnings("unchecked")
    private SocialUserInfo extractKakaoInfo(OAuth2User oauth2User) {
        Map<String, Object> kakaoAccount = oauth2User.getAttribute("kakao_account");

        String originalEmail = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
        String prefixedEmail = originalEmail != null ? "KAKAO_" + originalEmail : null;
        Object kakaoIdObj = oauth2User.getAttribute("id");
        String kakaoId = kakaoIdObj != null ? kakaoIdObj.toString() : null;

        return SocialUserInfo.builder()
                .social_type("KAKAO")
                .social_id(kakaoId)
                .login_id(prefixedEmail)
                .user_name(kakaoAccount != null ? (String) kakaoAccount.get("name") : null)
                .sex(kakaoAccount != null ? (String) kakaoAccount.get("gender") : null)
                .birthday(kakaoAccount != null ? (String) kakaoAccount.get("birthday") : null)
                .birthyear(kakaoAccount != null ? (String) kakaoAccount.get("birthyear") : null)
                .build();
        }

    /**
     * 네이버 사용자 정보 추출
     */
    @SuppressWarnings("unchecked")
    private SocialUserInfo extractNaverInfo(OAuth2User oauth2User) {
        Map<String, Object> response = oauth2User.getAttribute("response");

        if (response == null) {
            throw new OAuth2AuthenticationException("네이버 사용자 정보를 가져올 수 없습니다.");
        }

        String originalEmail = (String) response.get("email");
        String prefixedEmail = originalEmail != null ? "NAVER_" + originalEmail : null;

        return SocialUserInfo.builder()
                .social_type("NAVER")
                .social_id((String) response.get("id"))
                .login_id(prefixedEmail)
                .user_name((String) response.get("name"))
                .sex((String) response.get("gender"))
                .birthday((String) response.get("birthday"))
                .birthyear((String) response.get("birthyear"))
                .hp((String) response.get("mobile"))
                .build();
    }

    /**
     * 사용자 처리 (기존 사용자 찾기 또는 신규 생성)
     */
    private UserVO processOAuth2User(SocialUserInfo socialUserInfo) throws Exception {
        Map<String, Object> socialParamMap = new HashMap<>();
        socialParamMap.put("social_type", socialUserInfo.getSocial_type());
        socialParamMap.put("social_id", socialUserInfo.getSocial_id());

        UserVO existingSocialUser = userMapper.selectBySocialTypeAndSocialId(socialParamMap);

        if (existingSocialUser != null) {
            return existingSocialUser;
        }

        Map<String, Object> emailParamMap = new HashMap<>();
        emailParamMap.put("login_id", socialUserInfo.getLogin_id());

        UserVO existingEmailUser = userMapper.selectByLoginId(emailParamMap);

        if (existingEmailUser != null && !existingEmailUser.isSocialUser()) {
            throw new OAuth2AuthenticationException(
                    "해당 이메일로 이미 가입된 계정이 있습니다. 일반 로그인을 사용해주세요."
            );
        }

        // 3. 신규 소셜 사용자 생성
        return createNewSocialUser(socialUserInfo);
    }

    /**
     * 신규 소셜 사용자 생성
     */
    private UserVO createNewSocialUser(SocialUserInfo socialUserInfo) throws Exception {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("login_id", socialUserInfo.getLogin_id());
        paramMap.put("user_name", socialUserInfo.getUser_name());
        paramMap.put("birthday", socialUserInfo.getFullBirthday()); // yyyy-MM-dd 형태로 저장
        paramMap.put("sex", socialUserInfo.getConvertedSex()); // M/F 형태로 저장
        paramMap.put("hp", socialUserInfo.getHp());
        paramMap.put("social_type", socialUserInfo.getSocial_type());
        paramMap.put("social_id", socialUserInfo.getSocial_id());

        // DB에 신규 사용자 등록
        int result = userMapper.insertSocialUser(paramMap);

        if (result <= 0) {
            throw new OAuth2AuthenticationException("소셜 사용자 등록에 실패했습니다.");
        }

        // 등록된 사용자 정보 다시 조회하여 반환
        return userMapper.selectBySocialTypeAndSocialId(paramMap);
    }
}