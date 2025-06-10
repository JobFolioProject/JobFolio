package com.happyjob.jobfolio.service.join;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Set logger
    private final Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    private JavaMailSender javaMailSender;

    // application.properties에서 설정값 가져오기
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name:JobFolio}")
    private String appName;

    /**
     * 단순 텍스트 이메일 발송
     */
    public boolean sendSimpleEmail(String to, String subject, String content) {
        logger.info("+ Start EmailService.sendSimpleEmail");
        logger.info("   - To: " + to);
        logger.info("   - Subject: " + subject);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);

            javaMailSender.send(message);

            logger.info("+ Email sent successfully to: " + to);
            return true;

        } catch (Exception e) {
            logger.error("Error sending email to: " + to, e);
            return false;
        }
    }

    /**
     * HTML 이메일 발송
     */
    public boolean sendHtmlEmail(String to, String subject, String htmlContent) {
        logger.info("+ Start EmailService.sendHtmlEmail");
        logger.info("   - To: " + to);
        logger.info("   - Subject: " + subject);

        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML 형식

            javaMailSender.send(mimeMessage);

            logger.info("+ HTML Email sent successfully to: " + to);
            return true;

        } catch (MessagingException e) {
            logger.error("Error sending HTML email to: " + to, e);
            return false;
        }
    }

    /**
     * 회원가입 인증 이메일 발송
     */
    public boolean sendSignupVerificationEmail(String to, String verificationToken) {
        logger.info("+ Start EmailService.sendSignupVerificationEmail");

        String subject = "[" + appName + "] 이메일 인증번호";

        String htmlContent = buildSignupEmailTemplate(verificationToken);

        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * 아이디 찾기 결과 이메일 발송
     */
    public boolean sendFoundIdEmail(String to, String foundId, String regDate) {
        logger.info("+ Start EmailService.sendFoundIdEmail");

        String subject = "[" + appName + "] 아이디 찾기 결과";

        String htmlContent = buildFoundIdEmailTemplate(foundId, regDate);

        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * 비밀번호 재설정 이메일 발송
     */
    public boolean sendPasswordResetEmail(String to, String resetToken) {
        logger.info("+ Start EmailService.sendPasswordResetEmail");

        String subject = "[" + appName + "] 비밀번호 재설정 인증번호";

        String htmlContent = buildPasswordResetEmailTemplate(resetToken);

        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * 비밀번호 변경 완료 알림 이메일 발송
     */
    public boolean sendPasswordChangeNotification(String to) {
        logger.info("+ Start EmailService.sendPasswordChangeNotification");

        String subject = "[" + appName + "] 비밀번호 변경 완료";

        String htmlContent = buildPasswordChangeNotificationTemplate();

        return sendHtmlEmail(to, subject, htmlContent);
    }

    // ================= 이메일 템플릿 메서드 =================

    /**
     * 회원가입 인증 이메일 템플릿
     */
    private String buildSignupEmailTemplate(String verificationToken) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background: #007bff; color: white; padding: 20px; text-align: center; }");
        html.append(".content { padding: 30px 20px; background: #f9f9f9; }");
        html.append(".token-box { background: #e9ecef; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }");
        html.append(".token { font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px; }");
        html.append(".footer { background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<div class='container'>");
        html.append("<div class='header'>");
        html.append("<h1>").append(appName).append(" 이메일 인증</h1>");
        html.append("</div>");
        html.append("<div class='content'>");
        html.append("<h2>안녕하세요!</h2>");
        html.append("<p>").append(appName).append(" 회원가입을 위한 이메일 인증번호를 안내드립니다.</p>");
        html.append("<p>아래 인증번호를 입력하여 이메일 인증을 완료해주세요.</p>");
        html.append("<div class='token-box'>");
        html.append("<div class='token'>").append(verificationToken).append("</div>");
        html.append("</div>");
        html.append("<p><strong>⚠️ 주의사항:</strong></p>");
        html.append("<ul>");
        html.append("<li>인증번호는 <strong>5분간</strong> 유효합니다.</li>");
        html.append("<li>인증번호를 타인에게 공유하지 마세요.</li>");
        html.append("<li>본인이 요청하지 않았다면 이 이메일을 무시해주세요.</li>");
        html.append("</ul>");
        html.append("</div>");
        html.append("<div class='footer'>");
        html.append("<p>본 메일은 발신전용입니다. | © 2025 ").append(appName).append(". All rights reserved.</p>");
        html.append("</div>");
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    /**
     * 아이디 찾기 결과 이메일 템플릿
     */
    private String buildFoundIdEmailTemplate(String foundId, String regDate) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background: #28a745; color: white; padding: 20px; text-align: center; }");
        html.append(".content { padding: 30px 20px; background: #f9f9f9; }");
        html.append(".id-box { background: #d4edda; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; border: 1px solid #c3e6cb; }");
        html.append(".found-id { font-size: 20px; font-weight: bold; color: #155724; }");
        html.append(".footer { background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<div class='container'>");
        html.append("<div class='header'>");
        html.append("<h1>").append(appName).append(" 아이디 찾기 결과</h1>");
        html.append("</div>");
        html.append("<div class='content'>");
        html.append("<h2>아이디 찾기가 완료되었습니다!</h2>");
        html.append("<p>요청하신 아이디 찾기 결과를 안내드립니다.</p>");
        html.append("<div class='id-box'>");
        html.append("<p>찾으신 아이디</p>");
        html.append("<div class='found-id'>").append(foundId).append("</div>");
        if (regDate != null) {
            html.append("<p style='margin-top: 15px; color: #6c757d;'>가입일: ").append(regDate).append("</p>");
        }
        html.append("</div>");
        html.append("<p>위 아이디로 로그인하실 수 있습니다.</p>");
        html.append("<p>비밀번호를 잊으셨다면 '비밀번호 찾기'를 이용해주세요.</p>");
        html.append("</div>");
        html.append("<div class='footer'>");
        html.append("<p>본 메일은 발신전용입니다. | © 2025 ").append(appName).append(". All rights reserved.</p>");
        html.append("</div>");
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    /**
     * 비밀번호 재설정 이메일 템플릿
     */
    private String buildPasswordResetEmailTemplate(String resetToken) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background: #dc3545; color: white; padding: 20px; text-align: center; }");
        html.append(".content { padding: 30px 20px; background: #f9f9f9; }");
        html.append(".token-box { background: #f8d7da; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; border: 1px solid #f5c6cb; }");
        html.append(".token { font-size: 24px; font-weight: bold; color: #721c24; letter-spacing: 2px; }");
        html.append(".warning { background: #fff3cd; padding: 15px; border-radius: 5px; border: 1px solid #ffeaa7; margin: 20px 0; }");
        html.append(".footer { background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<div class='container'>");
        html.append("<div class='header'>");
        html.append("<h1>").append(appName).append(" 비밀번호 재설정</h1>");
        html.append("</div>");
        html.append("<div class='content'>");
        html.append("<h2>비밀번호 재설정 요청</h2>");
        html.append("<p>비밀번호 재설정을 위한 인증번호를 안내드립니다.</p>");
        html.append("<p>아래 인증번호를 입력하여 새로운 비밀번호를 설정해주세요.</p>");
        html.append("<div class='token-box'>");
        html.append("<div class='token'>").append(resetToken).append("</div>");
        html.append("</div>");
        html.append("<div class='warning'>");
        html.append("<p><strong>🔒 보안 안내:</strong></p>");
        html.append("<ul>");
        html.append("<li>인증번호는 <strong>5분간</strong> 유효합니다.</li>");
        html.append("<li>본인이 요청하지 않았다면 즉시 고객센터로 연락해주세요.</li>");
        html.append("<li>인증번호를 타인과 공유하지 마세요.</li>");
        html.append("</ul>");
        html.append("</div>");
        html.append("</div>");
        html.append("<div class='footer'>");
        html.append("<p>본 메일은 발신전용입니다. | © 2025 ").append(appName).append(". All rights reserved.</p>");
        html.append("</div>");
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    /**
     * 비밀번호 변경 완료 알림 이메일 템플릿
     */
    private String buildPasswordChangeNotificationTemplate() {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background: #17a2b8; color: white; padding: 20px; text-align: center; }");
        html.append(".content { padding: 30px 20px; background: #f9f9f9; }");
        html.append(".success-box { background: #d1ecf1; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; border: 1px solid #bee5eb; }");
        html.append(".footer { background: #6c757d; color: white; padding: 15px; text-align: center; font-size: 12px; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        html.append("<div class='container'>");
        html.append("<div class='header'>");
        html.append("<h1>").append(appName).append(" 비밀번호 변경 완료</h1>");
        html.append("</div>");
        html.append("<div class='content'>");
        html.append("<h2>비밀번호가 성공적으로 변경되었습니다!</h2>");
        html.append("<div class='success-box'>");
        html.append("<p><strong>✅ 비밀번호 변경 완료</strong></p>");
        html.append("<p>변경 시간: ").append(new java.util.Date().toString()).append("</p>");
        html.append("</div>");
        html.append("<p>이제 새로운 비밀번호로 로그인하실 수 있습니다.</p>");
        html.append("<p><strong>⚠️ 보안을 위해:</strong></p>");
        html.append("<ul>");
        html.append("<li>만약 본인이 변경하지 않았다면 즉시 고객센터로 연락해주세요.</li>");
        html.append("<li>정기적으로 비밀번호를 변경해주세요.</li>");
        html.append("<li>타인과 비밀번호를 공유하지 마세요.</li>");
        html.append("</ul>");
        html.append("</div>");
        html.append("<div class='footer'>");
        html.append("<p>본 메일은 발신전용입니다. | © 2025 ").append(appName).append(". All rights reserved.</p>");
        html.append("</div>");
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }
}