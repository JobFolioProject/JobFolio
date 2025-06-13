package com.happyjob.jobfolio.security;

import java.io.Serializable;
import java.util.Objects;

/**
 * 사용자 주체 정보를 담는 클래스
 */
public class UserPrincipal implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long user_no;
    private String login_id;
    private String user_name;
    private String user_type;

    // 기본 생성자
    public UserPrincipal() {}

    // 전체 생성자 (user_type 포함)
    public UserPrincipal(Long user_no, String login_id, String user_name, String user_type) {
        this.user_no = user_no;
        this.login_id = login_id;
        this.user_name = user_name;
        this.user_type = user_type;
    }

    // Getters (DB 컬럼명과 통일)
    public Long getUser_no() {
        return user_no;
    }

    public String getLogin_id() {
        return login_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public String getUser_type() {
        return user_type;
    }

    // Setters (DB 컬럼명과 통일)
    public void setUser_no(Long user_no) {
        this.user_no = user_no;
    }

    public void setLogin_id(String login_id) {
        this.login_id = login_id;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public void setUser_type(String user_type) {
        this.user_type = user_type;
    }

    @Override
    public String toString() {
        return "UserPrincipal{" +
                "user_no=" + user_no +
                ", login_id='" + login_id + '\'' +
                ", user_name='" + user_name + '\'' +
                ", user_type='" + user_type + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserPrincipal that = (UserPrincipal) o;

        return Objects.equals(user_no, that.user_no) &&
                Objects.equals(login_id, that.login_id) &&
                Objects.equals(user_name, that.user_name) &&
                Objects.equals(user_type, that.user_type);
    }

    @Override
    public int hashCode() {
        int result = user_no != null ? user_no.hashCode() : 0;
        result = 31 * result + (login_id != null ? login_id.hashCode() : 0);
        result = 31 * result + (user_name != null ? user_name.hashCode() : 0);
        result = 31 * result + (user_type != null ? user_type.hashCode() : 0);
        return result;
    }
}