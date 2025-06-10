package com.happyjob.jobfolio.service.chatgpt;

import java.io.File;
import java.util.*;

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
import java.io.IOException;
import com.fasterxml.jackson.core.JsonProcessingException;

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

        String requestBody = "{\"model\":\"gpt-3.5-turbo\",\"messages\":[{\"role\":\"system\",\"content\":\"" + userInput + "\"}]}";
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


    /* ---------------------------------------------------------------
     *  OpenAI Chat+Vision 통합 호출
     * ------------------------------------------------------------- */
    public String getChatResponse4file(String userInput,
                                       HttpServletRequest request,
                                       String apiKey,          // ⬅️ 텍스트 Chat Key
                                       String visionKey)       // ⬅️ Vision  Key
            throws Exception {

        /* ① 업로드 파일 체크 */
        MultipartHttpServletRequest multiReq = (MultipartHttpServletRequest) request;
        Map<String, Object> fileInfo = new FileUtilCho(
                multiReq, rootPath, virtualRootPath, tempPath + File.separator)
                .uploadFiles();                                          // {file_size, file_loc, …}

        /* ② 텍스트-Chat 헤더 */
        HttpHeaders chatHeaders = new HttpHeaders();
        chatHeaders.setBearerAuth(apiKey);
        chatHeaders.setContentType(MediaType.APPLICATION_JSON);

        /* ③ Vision 헤더 */
        HttpHeaders visionHeaders = new HttpHeaders();
        visionHeaders.setBearerAuth(visionKey);
        visionHeaders.setContentType(MediaType.APPLICATION_JSON);

        /* ④ 파일 여부 분기 */
        long size = 0L;
        if (fileInfo.get("file_size") != null) {
            size = Long.parseLong(String.valueOf(fileInfo.get("file_size")));
        }

        if (size > 0) {                                  // ✔ 이미지가 있을 때
            String filePath = (String) fileInfo.get("file_loc");
            return callVision(userInput, new File(filePath), visionHeaders);
        }

        /* ⑤ 이미지가 없으면 일반 Chat */
        return callChat(userInput, chatHeaders);
    }

    /* ---------------------------------------------------------------
     *  일반 Chat 호출 (텍스트만)
     * ------------------------------------------------------------- */
    // Java 8 호환 방식: callChat()
    private String callChat(String userInput, HttpHeaders headers) throws JsonProcessingException {
        ObjectMapper om = new ObjectMapper();

        // 1) body 맵 생성
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("temperature", 0.7);

        // 2) messages 리스트 생성
        List<Map<String, Object>> messages = new ArrayList<>();

        Map<String, Object> systemMsg = new HashMap<>();
        systemMsg.put("role", "system");
        systemMsg.put("content", "You are a helpful assistant.");
        messages.add(systemMsg);

        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", userInput);
        messages.add(userMsg);

        body.put("messages", messages);

        // 3) 요청 전송
        String json = om.writeValueAsString(body);
        HttpEntity<String> req = new HttpEntity<>(json, headers);
        try {
            ResponseEntity<String> res = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions", req, String.class);
            return res.getBody();
        } catch (HttpClientErrorException e) {
            return "[Chat API 오류] " + e.getStatusCode() + " : " + e.getResponseBodyAsString();
        }
    }

    // Java 8 호환 방식: callVision()
    private String callVision(String userInput, File imageFile, HttpHeaders headers) throws IOException {
        ObjectMapper om = new ObjectMapper();

        // 1) 이미지 → Base64
        String base64 = Base64.getEncoder()
                .encodeToString(Files.readAllBytes(imageFile.toPath()));

        // 2) body 맵 생성
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");

        // 3) messages 리스트 및 content 리스트 생성
        List<Map<String, Object>> messages = new ArrayList<>();
        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("role", "user");

        // content 항목 (text + image_url)
        List<Object> contentList = new ArrayList<>();
        Map<String, Object> textItem = new HashMap<>();
        textItem.put("type", "text");
        textItem.put("text", userInput);
        contentList.add(textItem);

        Map<String, Object> imgItem = new HashMap<>();
        imgItem.put("type", "image_url");
        Map<String, Object> urlMap = new HashMap<>();
        urlMap.put("url", "data:image/jpeg;base64," + base64);
        imgItem.put("image_url", urlMap);
        contentList.add(imgItem);

        userMsg.put("content", contentList);
        messages.add(userMsg);

        body.put("messages", messages);

        // 4) 요청 전송
        String json = om.writeValueAsString(body);
        HttpEntity<String> req = new HttpEntity<>(json, headers);
        try {
            ResponseEntity<String> res = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions", req, String.class);
            return res.getBody();
        } catch (HttpClientErrorException e) {
            return "[Vision API 오류] " + e.getStatusCode() + " : " + e.getResponseBodyAsString();
        }
    }




}