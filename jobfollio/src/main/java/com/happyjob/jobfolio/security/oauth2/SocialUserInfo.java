package com.happyjob.jobfolio.security.oauth2;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 소셜 로그인 사용자 정보 DTO
 * DB 컬럼명과 동일하게 사용 (snake_case)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialUserInfo {
    private String social_type;     // GOOGLE, KAKAO, NAVER
    private String social_id;       // 소셜 고유 ID
    private String login_id;        // 이메일
    private String user_name;       // 이름
    private String sex;            // 성별
    private String birthday;       // 생년월일
    private String birthyear;      // 출생연도
    private String hp;             // 전화번호

    /**
     * 생년월일 조합 메서드 (카카오용)
     */
    public String getFullBirthday() {
        if (birthyear != null && birthday != null) {
            return birthyear + "-" + birthday;
        }
        return birthday;
    }

    public String getConvertedSex() {
        if (sex == null) return null;

        switch (sex.toLowerCase()) {
            case "male":
            case "m":
                return "M";
            case "female":
            case "f":
                return "W";
            default:
                return sex.toUpperCase();
        }
    }
}