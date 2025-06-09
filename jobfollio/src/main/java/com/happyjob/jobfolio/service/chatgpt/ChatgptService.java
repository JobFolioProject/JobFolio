package com.happyjob.jobfolio.service.chatgpt;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.util.MultiValueMap;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.File;
import java.nio.file.Files;
import java.util.Base64;

import com.happyjob.jobfolio.common.comnUtils.FileUtilCho;

import org.springframework.http.HttpHeaders;

@Service
public class ChatgptService {

	// Set logger
	private final Logger logger = LogManager.getLogger(this.getClass());

	@Value("${fileUpload.rootPath}")
	private String rootPath;
	
	@Value("${fileUpload.temp}")
	private String tempPath;
	
	@Value("${fileUpload.virtualRootPath}")
	private String virtualRootPath;
	
	// Get class name for logger
	private final String className = this.getClass().toString();

	private  RestTemplate restTemplate;
    private final String chatGptApiUrl = "https://api.openai.com/v1/chat/completions";

    public ChatgptService() {
        this.restTemplate = new RestTemplate();
    }

    public String getChatResponse(String userInput,String apiKey ) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String requestBody = "{\"model\":\"gpt-3.5-turbo\",\"messages\":[{\"role\":\"system\",\"content\":\"" +
        		"You are to respond **only** with an HTML resume (이력서) template."
        		+ "The response **must include all CSS inline** within a single HTML file."
        		+ "Do not link external CSS files."
        		+ "Use modern, clean, and responsive HTML/CSS structure."
        		+ "The content should be a generic resume template, not tied to a specific person."
        		+ "Never include any explanation or markdown formatting — only return pure HTML." 
        		+ "\"},{\"role\":\"system\",\"content\":\"" + userInput + "\"}]}";
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        // ChatGPT API 호출
        ResponseEntity<String> responseEntity=null;
        try{
           responseEntity = restTemplate.exchange(chatGptApiUrl, HttpMethod.POST, requestEntity, String.class);
        }catch (Exception e){
            e.printStackTrace();
        }

        // ChatGPT API 응답 처리
        String chatResponse = responseEntity.getBody();

        return chatResponse;
    }
    
    public String getChatResponse4(String userInput,String apiKey) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        String requestBody = "{\"model\":\"gpt-4\",\"messages\":[{\"role\":\"system\",\"content\":\"" + userInput + "\"}]}";
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        // ChatGPT API 호출
        ResponseEntity<String> responseEntity=null;
        try{
           responseEntity = restTemplate.exchange(chatGptApiUrl, HttpMethod.POST, requestEntity, String.class);
        }catch (Exception e){
            e.printStackTrace();
        }

        // ChatGPT API 응답 처리
        String chatResponse = responseEntity.getBody();

        return chatResponse;
    }    
    
    
    public String getChatResponse4file(String userInput, HttpServletRequest request, String apiKey, String turboapiKey) throws Exception {

        MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
        FileUtilCho fileutil = new FileUtilCho(multipartHttpServletRequest, rootPath, virtualRootPath, tempPath + File.separator);
        Map<String, Object> fileinfo = fileutil.returnuploadFiles();

        String returnval = "";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);

        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> requestBodyMap = new HashMap<>();

        if ("Y".equals(fileinfo.get("exist"))) {
            // 파일이 있는 경우 OpenAI Vision API를 사용하여 이미지 처리
            String filePath = (String) fileinfo.get("file_loc");
            File tempFile = new File(filePath);
            returnval = processVisionRequest(userInput, tempFile, turboapiKey);
        } else {
            // 파일이 없는 경우 일반 텍스트 처리 (gpt-4 사용)
            requestBodyMap.put("model", "gpt-4");  // 파일이 없을 때는 일반 gpt-4 사용
            requestBodyMap.put("messages", new Object[]{
                    new HashMap<String, String>() {{
                        put("role", "system");
                        put("content", userInput);
                    }}
            });

            String jsonPayload = objectMapper.writeValueAsString(requestBodyMap);
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> requestEntity = new HttpEntity<>(jsonPayload, headers);

            // OpenAI API 호출
            try {
                ResponseEntity<String> responseEntity = restTemplate.exchange(chatGptApiUrl, HttpMethod.POST, requestEntity, String.class);
                returnval = responseEntity.getBody();
            } catch (HttpClientErrorException e) {
                e.printStackTrace();
                if (e.getStatusCode() == HttpStatus.NOT_FOUND && e.getResponseBodyAsString().contains("model_not_found")) {
                    returnval = "OpenAI API에서 요청한 모델을 사용할 수 없습니다.";
                } else {
                    returnval = "API 요청 중 오류 발생!";
                }
            } catch (Exception e) {
                e.printStackTrace();
                returnval = "API 요청 중 오류 발생!";
            }
        }

        return returnval;
    }

    /**
     * OpenAI Vision API로 이미지 처리 요청 (파일이 있을 때만 사용)
     */
    public static String processVisionRequest(String userInput, File file, String apiKey) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // 1️⃣ 파일을 Base64로 변환
        String base64Image = Base64.getEncoder().encodeToString(Files.readAllBytes(file.toPath()));

        // 2️⃣ JSON 요청 본문 생성
        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody = objectMapper.writeValueAsString(Map.of(
                "model", "gpt-4-turbo",
                "messages", List.of(Map.of(
                    "role", "user",
                    "content", List.of(
                        Map.of("type", "text", "text", userInput),
                        Map.of("type", "image_url", "image_url", Map.of("url", "data:image/jpeg;base64," + base64Image))
                    )
                ))
            ));
 
        HttpEntity<String> requestEntity = new HttpEntity<>(requestBody, headers);

        // 3️⃣ API 요청 실행
        ResponseEntity<String> responseEntity;
        try {
            responseEntity = restTemplate.exchange("https://api.openai.com/v1/chat/completions", HttpMethod.POST, requestEntity, String.class);
            return responseEntity.getBody();
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
            return "Vision API 요청 중 오류 발생: " + e.getResponseBodyAsString();
        }
    }

    
    
}