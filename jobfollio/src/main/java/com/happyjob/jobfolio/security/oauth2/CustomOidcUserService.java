package com.happyjob.jobfolio.security.oauth2;

import com.happyjob.jobfolio.repository.join.UserMapper;
import com.happyjob.jobfolio.vo.join.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

/**
 * OIDC 전용 사용자 서비스 (Google용) - People API 연동
 */
@Service
public class CustomOidcUserService extends OidcUserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {

        try {
            OidcUser oidcUser = super.loadUser(userRequest);

            String registrationId = userRequest.getClientRegistration().getRegistrationId();

            SocialUserInfo socialUserInfo = extractGoogleInfoWithPeopleAPI(oidcUser, userRequest);

            UserVO user = processOAuth2User(socialUserInfo);

            return new CustomOAuth2User(user, oidcUser.getAttributes());

        } catch (Exception e) {
            System.err.println("CustomOidcUserService 에러: " + e.getMessage());
            e.printStackTrace();
            throw new OAuth2AuthenticationException(
                new OAuth2Error("LOGIN_ERROR", e.getMessage(), null),
                e.getMessage()
            );
        }
    }

    /**
     * 구글 사용자 정보 추출
     */
    private SocialUserInfo extractGoogleInfoWithPeopleAPI(OidcUser oidcUser, OidcUserRequest userRequest) {
        String originalEmail = oidcUser.getAttribute("email");
        String prefixedEmail = originalEmail != null ? "GOOGLE_" + originalEmail : null;

        GooglePeopleInfo peopleInfo = fetchGooglePeopleInfo(userRequest);

        return SocialUserInfo.builder()
                .social_type("GOOGLE")
                .social_id(oidcUser.getAttribute("sub"))
                .login_id(prefixedEmail)
                .user_name(oidcUser.getAttribute("name"))
                .sex(peopleInfo.getGender())
                .birthday(peopleInfo.getBirthday())
                .birthyear(peopleInfo.getBirthyear())
                .hp(peopleInfo.getPhoneNumber())
                .build();
    }

    /**
     * Google People API 호출
     */
    private GooglePeopleInfo fetchGooglePeopleInfo(OidcUserRequest userRequest) {
        try {
            // OAuth2 토큰 가져오기
            String accessToken = userRequest.getAccessToken().getTokenValue();

            // People API 호출
            String peopleApiUrl = "https://people.googleapis.com/v1/people/me?personFields=birthdays,genders,phoneNumbers";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    peopleApiUrl,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            return parseGooglePeopleResponse(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            return new GooglePeopleInfo();
        }
    }

    /**
     * People API 응답 파싱
     */
    private GooglePeopleInfo parseGooglePeopleResponse(String responseBody) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(responseBody);

            GooglePeopleInfo info = new GooglePeopleInfo();

            JsonNode birthdays = root.path("birthdays");
            if (birthdays.isArray() && birthdays.size() > 0) {
                for (JsonNode birthday : birthdays) {
                    JsonNode date = birthday.path("date");
                    if (!date.isMissingNode()) {
                        int year = date.path("year").asInt(0);
                        int month = date.path("month").asInt(0);
                        int day = date.path("day").asInt(0);

                        if (year > 0 && month > 0 && day > 0) {
                            info.setBirthyear(String.valueOf(year));
                            info.setBirthday(String.format("%02d-%02d", month, day));
                            break;
                        }
                    }
                }
            }


            JsonNode genders = root.path("genders");
            if (genders.isArray() && genders.size() > 0) {
                String gender = genders.get(0).path("value").asText();
                if ("male".equalsIgnoreCase(gender)) {
                    info.setGender("M");
                } else if ("female".equalsIgnoreCase(gender)) {
                    info.setGender("F");
                }
            }


            JsonNode phoneNumbers = root.path("phoneNumbers");
            if (phoneNumbers.isArray() && phoneNumbers.size() > 0) {
                String phoneNumber = phoneNumbers.get(0).path("value").asText();
                info.setPhoneNumber(phoneNumber);
            }

            return info;

        } catch (Exception e) {
            System.err.println("People API 응답 파싱 실패: " + e.getMessage());
            return new GooglePeopleInfo();
        }
    }

    /**
     * Google People API
     */
    private static class GooglePeopleInfo {
        private String birthday;
        private String birthyear;
        private String gender;
        private String phoneNumber;

        public GooglePeopleInfo() {}

        public String getBirthday() { return birthday; }
        public void setBirthday(String birthday) { this.birthday = birthday; }

        public String getBirthyear() { return birthyear; }
        public void setBirthyear(String birthyear) { this.birthyear = birthyear; }

        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    }


    private UserVO processOAuth2User(SocialUserInfo socialUserInfo) throws Exception {
        Map<String, Object> socialParamMap = new HashMap<>();
        socialParamMap.put("social_type", socialUserInfo.getSocial_type());
        socialParamMap.put("social_id", socialUserInfo.getSocial_id());

        UserVO existingSocialUser = userMapper.selectBySocialTypeAndSocialId(socialParamMap);

        if (existingSocialUser != null) {
            if ("Y".equals(existingSocialUser.getStatus_yn())) {
                throw new OAuth2AuthenticationException(
                        new OAuth2Error("DEACTIVATED_USER", "탈퇴한 계정입니다. 관리자에게 문의하세요.", null),
                        "탈퇴한 계정입니다. 관리자에게 문의하세요."
                );
            }
            System.err.println("기존 사용자 발견: " + existingSocialUser.getUser_no());
            return existingSocialUser;
        }

        Map<String, Object> emailParamMap = new HashMap<>();
        emailParamMap.put("login_id", socialUserInfo.getLogin_id());

        UserVO existingEmailUser = userMapper.selectByLoginId(emailParamMap);

        if (existingEmailUser != null) {
            if ("Y".equals(existingEmailUser.getStatus_yn())) {
                throw new OAuth2AuthenticationException(
                        new OAuth2Error("DEACTIVATED_USER", "탈퇴한 계정입니다. 관리자에게 문의하세요.", null),
                        "탈퇴한 계정입니다. 관리자에게 문의하세요."
                );
            }

            if (!existingEmailUser.isSocialUser()) {
                throw new OAuth2AuthenticationException(
                        "해당 이메일로 이미 가입된 계정이 있습니다. 일반 로그인을 사용해주세요."
                );
            }
        }

        return createNewSocialUser(socialUserInfo);
    }

    private UserVO createNewSocialUser(SocialUserInfo socialUserInfo) throws Exception {
        System.err.println("새 소셜 사용자 생성 중...");

        Map<String, Object> paramMap = new HashMap<>();
        paramMap.put("login_id", socialUserInfo.getLogin_id());
        paramMap.put("user_name", socialUserInfo.getNormalizedUserName());
        paramMap.put("birthday", socialUserInfo.getFullBirthday());
        paramMap.put("sex", socialUserInfo.getConvertedSex());
        paramMap.put("hp", socialUserInfo.getNormalizedHp());
        paramMap.put("social_type", socialUserInfo.getSocial_type());
        paramMap.put("social_id", socialUserInfo.getSocial_id());

        int result = userMapper.insertSocialUser(paramMap);

        if (result <= 0) {
            throw new OAuth2AuthenticationException("소셜 사용자 등록에 실패했습니다.");
        }

        System.err.println("새 사용자 생성 완료");
        return userMapper.selectBySocialTypeAndSocialId(paramMap);
    }
}