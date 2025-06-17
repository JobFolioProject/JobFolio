package com.happyjob.jobfolio.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.happyjob.jobfolio.security.JwtAuthenticationFilter;
import com.happyjob.jobfolio.security.handler.CustomAccessDeniedHandler;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private CustomAccessDeniedHandler customAccessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (JWT + 쿠키 사용하므로)
                .csrf().disable()

                // CORS 설정
                .cors().configurationSource(corsConfigurationSource())

                .and()


                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                .and()


                .exceptionHandling()
                .accessDeniedHandler(customAccessDeniedHandler)

                .and()

                // 요청별 인증 및 권한 설정================================================================================
                .authorizeRequests()
                // 인증 없이 접근 가능한 경로
                .antMatchers(
                        "/api/join/**",           // 회원가입 관련
                        "/api/login/**",          // 로그인 관련
                        "/api/logout/**",         // 로그아웃 관련
                        "/api/email/**",          // 이메일 인증 관련
                        "/api/auth/refresh",
                        "/api/product/**",
                        "/api/resume/**",             // 결제 관련
                        "/resumes/**",
                        "/api/community/**",
                        "/error"                  // 에러 페이지
                ).permitAll()

                // 최고관리자(A) 전용 경로
                .antMatchers("/api/admin/super/**").hasAuthority("ROLE_A")

                // 모든관리자(A, B) 전용 경로
                .antMatchers("/api/admin/**").hasAnyAuthority("ROLE_A", "ROLE_B")

                // OAuth2 관련 경로 (추후 소셜 로그인용)
                .antMatchers("/oauth2/**", "/login/oauth2/**").permitAll()

                // 그 외 모든 요청은 인증 필요 (기본적으로 모든 권한 허용)
                .anyRequest().authenticated()

                .and()

                // JWT 필터 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // OAuth2 로그인 설정 (추후 활성화)
                .oauth2Login()
                .disable(); // 현재는 비활성화, 추후 소셜 로그인 구현 시 활성화

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "https://yourdomain.com" // 배포 시 실제 도메인으로 변경
        ));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));


        configuration.setAllowedHeaders(Arrays.asList("*"));


        configuration.setAllowCredentials(true);


        configuration.setExposedHeaders(Arrays.asList("Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}