package com.happyjob.jobfolio.common.comnUtils;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // “/resumes/**” 요청을 물리 디렉터리 X:/resume_output/ 으로 매핑
        registry
                .addResourceHandler("/resumes/**")
                .addResourceLocations("file:///X:/resume_output/");
    }
}

