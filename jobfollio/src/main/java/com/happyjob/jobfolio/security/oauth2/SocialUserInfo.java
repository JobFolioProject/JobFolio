package com.happyjob.jobfolio.security.oauth2;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    public String getFullBirthday() {
        if (birthday == null) return null;

        if (birthday.matches("\\d{4}-\\d{2}-\\d{2}")) {
            return birthday;
        }

        if (birthday.matches("\\d{4}-\\d{4}")) {
            String year = birthday.substring(0, 4);
            String monthDay = birthday.substring(5);

            if (monthDay.length() == 4) {
                String month = monthDay.substring(0, 2);
                String day = monthDay.substring(2);
                return String.format("%s-%02d-%02d", year, Integer.parseInt(month), Integer.parseInt(day));
            }
        }

        if (birthyear != null && birthday.matches("\\d{2}-\\d{2}")) {
            return birthyear + "-" + birthday;
        }

        if (birthday.matches("\\d{2}-\\d{2}")) {
            return "1990-" + birthday;
        }

        if (birthday.matches("\\d{4}") && birthyear != null) {
            String month = birthday.substring(0, 2);
            String day = birthday.substring(2);
            return String.format("%s-%02d-%02d", birthyear, Integer.parseInt(month), Integer.parseInt(day));
        }

        return birthday;
    }

    /**
     * 성별 변환
     */
    public String getConvertedSex() {
        if (sex == null) return null;

        switch (sex.toLowerCase()) {
            case "male":
            case "m":
                return "M";
            case "female":
            case "f":
            case "woman":
                return "W";
            default:
                return null;
        }
    }

    /**
     * 전화번호 정규화
     */
    public String getNormalizedHp() {
        if (hp == null) return null;

        String normalized = hp.replaceAll("[^0-9]", "");

        if (normalized.startsWith("8210") && normalized.length() == 12) {
            normalized = "0" + normalized.substring(2);
        }
        else if (normalized.startsWith("82") && normalized.length() == 11) {
            normalized = "0" + normalized.substring(2);
        }
        else if (normalized.startsWith("010") || normalized.startsWith("011") ||
                normalized.startsWith("016") || normalized.startsWith("017") ||
                normalized.startsWith("018") || normalized.startsWith("019")) {
        }
        else {
            return null;
        }

        if (normalized.length() == 11 && normalized.startsWith("01")) {
            return normalized;
        } else if (normalized.length() >= 9 && normalized.length() <= 10) {
            return normalized;
        }

        return null;
    }

    /**
     * 사용자 이름 정규화
     */
    public String getNormalizedUserName() {
        if (user_name == null) return null;

        String normalized = user_name.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    /**
     * 디버깅용 메서드 - 변환된 모든 정보 출력
     */
    public void printConvertedInfo() {
        System.out.println("=== 소셜 사용자 정보 변환 결과 ===");
        System.out.println("소셜 타입: " + social_type);
        System.out.println("원본 생년월일: " + birthday);
        System.out.println("변환 생년월일: " + getFullBirthday());
        System.out.println("원본 성별: " + sex);
        System.out.println("변환 성별: " + getConvertedSex());
        System.out.println("원본 전화번호: " + hp);
        System.out.println("변환 전화번호: " + getNormalizedHp());
        System.out.println("변환 이름: " + getNormalizedUserName());

        // 카카오 전화번호 변환 과정 상세 출력
        if ("KAKAO".equals(social_type) && hp != null) {
            System.out.println("--- 카카오 전화번호 변환 과정 ---");
            System.out.println("입력: " + hp + " (국제형식)");
            if (hp.startsWith("8210")) {
                System.out.println("→ 82 제거: " + hp.substring(2));
                System.out.println("→ 0 추가: " + "0" + hp.substring(2));
                System.out.println("→ 최종: " + getNormalizedHp());
            }
            System.out.println("-----------------------------");
        }
        System.out.println("===============================");
    }
}