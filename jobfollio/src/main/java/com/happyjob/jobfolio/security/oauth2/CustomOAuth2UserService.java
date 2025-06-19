package com.happyjob.jobfolio.security.oauth2;

import com.happyjob.jobfolio.repository.join.UserMapper;
import com.happyjob.jobfolio.vo.join.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;


/**
 * OAuth2 사용자 정보
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
            System.err.println("CustomOAuth2UserService 에러: " + e.getMessage());
            e.printStackTrace();
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
                .login_id(prefixedEmail)
                .user_name(oauth2User.getAttribute("name"))
                .sex(null)
                .birthday(null)
                .birthyear(null)
                .hp(null)
                .build();
    }

    //    카카오
    @SuppressWarnings("unchecked")
    private SocialUserInfo extractKakaoInfo(OAuth2User oauth2User) {

        Map<String, Object> kakaoAccount = oauth2User.getAttribute("kakao_account");

        String originalEmail = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;
        String prefixedEmail = originalEmail != null ? "KAKAO_" + originalEmail : null;
        Object kakaoIdObj = oauth2User.getAttribute("id");
        String kakaoId = kakaoIdObj != null ? kakaoIdObj.toString() : null;

        String userName = kakaoAccount != null ? (String) kakaoAccount.get("name") : null;

        String phoneNumber = kakaoAccount != null ? (String) kakaoAccount.get("phone_number") : null;


        String birthday = null;
        String birthyear = null;

        if (kakaoAccount != null) {
            birthyear = (String) kakaoAccount.get("birthyear");
            String birthdayRaw = (String) kakaoAccount.get("birthday");

            if (birthdayRaw != null) {
                if (birthdayRaw.matches("\\d{4}")) {
                    String month = birthdayRaw.substring(0, 2);
                    String day = birthdayRaw.substring(2);
                    birthday = String.format("%02d-%02d", Integer.parseInt(month), Integer.parseInt(day));
                } else {
                    birthday = birthdayRaw;
                }
            }
        }

        String gender = kakaoAccount != null ? (String) kakaoAccount.get("gender") : null;

        return SocialUserInfo.builder()
                .social_type("KAKAO")
                .social_id(kakaoId)
                .login_id(prefixedEmail)
                .user_name(userName)
                .sex(gender)
                .birthday(birthday)
                .birthyear(birthyear)
                .hp(phoneNumber)
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

        String mobile = (String) response.get("mobile");

        return SocialUserInfo.builder()
                .social_type("NAVER")
                .social_id((String) response.get("id"))
                .login_id(prefixedEmail)
                .user_name((String) response.get("name"))
                .sex((String) response.get("gender"))
                .birthday((String) response.get("birthday"))
                .birthyear((String) response.get("birthyear"))
                .hp(mobile)
                .build();
    }

    /**
     * 사용자 처리
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

        return createNewSocialUser(socialUserInfo);
    }

    private UserVO createNewSocialUser(SocialUserInfo socialUserInfo) throws Exception {
        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("login_id", socialUserInfo.getLogin_id());
        paramMap.put("user_name", socialUserInfo.getNormalizedUserName());
        paramMap.put("birthday", socialUserInfo.getFullBirthday());
        paramMap.put("sex", socialUserInfo.getConvertedSex());
        paramMap.put("hp", socialUserInfo.getNormalizedHp());
        paramMap.put("social_type", socialUserInfo.getSocial_type());
        paramMap.put("social_id", socialUserInfo.getSocial_id());

        if (isDebugMode()) {
            socialUserInfo.printConvertedInfo();
        }

        int result = userMapper.insertSocialUser(paramMap);

        if (result <= 0) {
            throw new OAuth2AuthenticationException("소셜 사용자 등록에 실패했습니다.");
        }

        return userMapper.selectBySocialTypeAndSocialId(paramMap);
    }

    /**
     * 개발 모드 확인
     */
    private boolean isDebugMode() {
        return "dev".equals(System.getProperty("spring.profiles.active"));
    }

}