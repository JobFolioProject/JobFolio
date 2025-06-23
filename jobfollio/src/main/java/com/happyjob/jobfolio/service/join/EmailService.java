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
import java.text.SimpleDateFormat;
import java.util.Date;

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

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

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
     * 범용 이메일 발송 (제목과 내용 자유 설정)
     */
    public boolean sendEmail(String to, String subject, String content) throws Exception {
        logger.info("+ Start EmailService.sendEmail");
        logger.info("   - To: " + to);
        logger.info("   - Subject: " + subject);

        return sendSimpleEmail(to, subject, content);
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

        String subject = "✅ " + appName + " 이메일 인증을 완료해주세요";
        String htmlContent = buildSignupEmailTemplate(verificationToken);

        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * 아이디 찾기 결과 이메일 발송
     */
    public boolean sendFoundIdEmail(String to, String foundId, String regDate) {
        logger.info("+ Start EmailService.sendFoundIdEmail");

        String subject = "🔍 " + appName + " 아이디 찾기 결과입니다";
        String htmlContent = buildFoundIdEmailTemplate(foundId, regDate);

        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * 비밀번호 재설정 이메일 발송
     */
    public boolean sendPasswordResetEmail(String to, String resetToken) {
        logger.info("+ Start EmailService.sendPasswordResetEmail");

        String subject = "🔐 " + appName + " 비밀번호 재설정 인증번호";
        String htmlContent = buildPasswordResetEmailTemplate(resetToken);

        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * 비밀번호 변경 완료 알림 이메일 발송
     */
    public boolean sendPasswordChangeNotification(String to) {
        logger.info("+ Start EmailService.sendPasswordChangeNotification");

        String subject = "🎉 " + appName + " 비밀번호 변경이 완료되었습니다";
        String htmlContent = buildPasswordChangeNotificationTemplate();

        return sendHtmlEmail(to, subject, htmlContent);
    }

    /**
     * 새 비밀번호 발송 이메일
     */
    public boolean sendNewPasswordEmail(String to, String newPassword) {
        logger.info("+ Start EmailService.sendNewPasswordEmail");

        String subject = "🔑 " + appName + " 새로운 비밀번호 안내";
        String htmlContent = buildNewPasswordEmailTemplate(newPassword);

        return sendHtmlEmail(to, subject, htmlContent);
    }

    // ================= 공통 스타일 및 기본 템플릿 =================

    /**
     * 공통 CSS 스타일
     */
    private String getCommonStyles() {
        return "<style>" +
                "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');" +

                "* {" +
                "margin: 0;" +
                "padding: 0;" +
                "box-sizing: border-box;" +
                "}" +

                "body {" +
                "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" +
                "line-height: 1.6;" +
                "color: #1a1a1a;" +
                "background-color: #f8fafc;" +
                "}" +

                ".email-container {" +
                "max-width: 600px;" +
                "margin: 0 auto;" +
                "background: #ffffff;" +
                "border-radius: 16px;" +
                "overflow: hidden;" +
                "box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);" +
                "}" +

                ".email-header {" +
                "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);" +
                "padding: 40px 30px;" +
                "text-align: center;" +
                "position: relative;" +
                "}" +

                ".email-header::before {" +
                "content: '';" +
                "position: absolute;" +
                "top: 0;" +
                "left: 0;" +
                "right: 0;" +
                "bottom: 0;" +
                "background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"10\" cy=\"10\" r=\"1\" fill=\"white\" opacity=\"0.1\"/><circle cx=\"30\" cy=\"30\" r=\"1\" fill=\"white\" opacity=\"0.05\"/><circle cx=\"60\" cy=\"20\" r=\"1\" fill=\"white\" opacity=\"0.08\"/><circle cx=\"80\" cy=\"60\" r=\"1\" fill=\"white\" opacity=\"0.06\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');" +
                "pointer-events: none;" +
                "}" +

                ".logo {" +
                "font-size: 28px;" +
                "font-weight: 700;" +
                "color: #ffffff;" +
                "margin-bottom: 8px;" +
                "position: relative;" +
                "z-index: 1;" +
                "letter-spacing: -0.5px;" +
                "}" +

                ".header-subtitle {" +
                "color: rgba(255, 255, 255, 0.85);" +
                "font-size: 14px;" +
                "font-weight: 400;" +
                "position: relative;" +
                "z-index: 1;" +
                "}" +

                ".email-body {" +
                "padding: 40px 30px;" +
                "}" +

                ".welcome-text {" +
                "font-size: 24px;" +
                "font-weight: 600;" +
                "color: #1a1a1a;" +
                "margin-bottom: 16px;" +
                "text-align: center;" +
                "}" +

                ".description {" +
                "font-size: 16px;" +
                "color: #64748b;" +
                "text-align: center;" +
                "margin-bottom: 32px;" +
                "line-height: 1.5;" +
                "}" +

                ".verification-card {" +
                "background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);" +
                "border: 2px solid #e2e8f0;" +
                "border-radius: 12px;" +
                "padding: 32px;" +
                "text-align: center;" +
                "margin: 32px 0;" +
                "position: relative;" +
                "overflow: hidden;" +
                "}" +

                ".verification-card::before {" +
                "content: '';" +
                "position: absolute;" +
                "top: 0;" +
                "left: 0;" +
                "right: 0;" +
                "height: 4px;" +
                "background: linear-gradient(90deg, #667eea, #764ba2);" +
                "}" +

                ".verification-label {" +
                "font-size: 14px;" +
                "color: #64748b;" +
                "margin-bottom: 12px;" +
                "font-weight: 500;" +
                "text-transform: uppercase;" +
                "letter-spacing: 0.5px;" +
                "}" +

                ".verification-code {" +
                "font-size: 32px;" +
                "font-weight: 700;" +
                "color: #1a1a1a;" +
                "letter-spacing: 4px;" +
                "font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;" +
                "background: #ffffff;" +
                "padding: 16px 24px;" +
                "border-radius: 8px;" +
                "border: 2px dashed #cbd5e1;" +
                "display: inline-block;" +
                "margin: 8px 0;" +
                "}" +

                ".info-box {" +
                "background: #f1f5f9;" +
                "border-left: 4px solid #3b82f6;" +
                "border-radius: 8px;" +
                "padding: 20px 24px;" +
                "margin: 24px 0;" +
                "}" +

                ".info-box.warning {" +
                "background: #fef3c7;" +
                "border-left-color: #f59e0b;" +
                "}" +

                ".info-box.success {" +
                "background: #dcfce7;" +
                "border-left-color: #22c55e;" +
                "}" +

                ".info-box.danger {" +
                "background: #fee2e2;" +
                "border-left-color: #ef4444;" +
                "}" +

                ".info-title {" +
                "font-weight: 600;" +
                "color: #1a1a1a;" +
                "margin-bottom: 8px;" +
                "font-size: 16px;" +
                "}" +

                ".info-list {" +
                "margin: 0;" +
                "padding-left: 20px;" +
                "color: #475569;" +
                "}" +

                ".info-list li {" +
                "margin-bottom: 6px;" +
                "font-size: 14px;" +
                "}" +

                ".cta-button {" +
                "display: inline-block;" +
                "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);" +
                "color: #ffffff;" +
                "text-decoration: none;" +
                "padding: 14px 32px;" +
                "border-radius: 8px;" +
                "font-weight: 600;" +
                "font-size: 16px;" +
                "text-align: center;" +
                "transition: all 0.3s ease;" +
                "box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);" +
                "margin: 20px 0;" +
                "}" +

                ".found-id-display {" +
                "background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);" +
                "border: 2px solid #86efac;" +
                "border-radius: 12px;" +
                "padding: 24px;" +
                "text-align: center;" +
                "margin: 24px 0;" +
                "}" +

                ".found-id-label {" +
                "font-size: 14px;" +
                "color: #16a34a;" +
                "margin-bottom: 8px;" +
                "font-weight: 500;" +
                "}" +

                ".found-id-value {" +
                "font-size: 24px;" +
                "font-weight: 700;" +
                "color: #15803d;" +
                "font-family: 'SF Mono', Monaco, monospace;" +
                "background: #ffffff;" +
                "padding: 12px 20px;" +
                "border-radius: 6px;" +
                "border: 1px solid #86efac;" +
                "display: inline-block;" +
                "}" +

                ".reg-date {" +
                "font-size: 14px;" +
                "color: #64748b;" +
                "margin-top: 12px;" +
                "font-style: italic;" +
                "}" +

                ".email-footer {" +
                "background: #1e293b;" +
                "padding: 30px;" +
                "text-align: center;" +
                "color: #94a3b8;" +
                "}" +

                ".footer-divider {" +
                "height: 1px;" +
                "background: linear-gradient(90deg, transparent, #475569, transparent);" +
                "margin: 20px 0;" +
                "}" +

                ".footer-text {" +
                "font-size: 13px;" +
                "line-height: 1.5;" +
                "}" +

                ".footer-link {" +
                "color: #94a3b8;" +
                "text-decoration: none;" +
                "}" +

                ".social-links {" +
                "margin-top: 16px;" +
                "}" +

                ".social-links a {" +
                "display: inline-block;" +
                "margin: 0 8px;" +
                "color: #94a3b8;" +
                "text-decoration: none;" +
                "font-size: 12px;" +
                "}" +

                "@media (max-width: 600px) {" +
                ".email-container {" +
                "margin: 0;" +
                "border-radius: 0;" +
                "}" +

                ".email-body {" +
                "padding: 30px 20px;" +
                "}" +

                ".email-header {" +
                "padding: 30px 20px;" +
                "}" +

                ".verification-code {" +
                "font-size: 28px;" +
                "letter-spacing: 3px;" +
                "}" +
                "}" +
                "</style>";
    }

    /**
     * 기본 템플릿 구조
     */
    private String buildBaseTemplate(String title, String content) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy년 M월 d일");
        String currentDate = sdf.format(new Date());

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html lang=\"ko\">");
        html.append("<head>");
        html.append("<meta charset=\"UTF-8\">");
        html.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
        html.append("<title>").append(title).append("</title>");
        html.append(getCommonStyles());
        html.append("</head>");
        html.append("<body>");
        html.append("<div class=\"email-container\">");
        html.append("<div class=\"email-header\">");
        html.append("<div class=\"logo\">").append(appName).append("</div>");
        html.append("<div class=\"header-subtitle\">프리미엄 채용 플랫폼</div>");
        html.append("</div>");
        html.append("<div class=\"email-body\">");
        html.append(content);
        html.append("</div>");
        html.append("<div class=\"email-footer\">");
        html.append("<div class=\"footer-text\">");
        html.append("본 메일은 발신 전용입니다. 문의사항이 있으시면 고객센터를 이용해주세요.");
        html.append("</div>");
        html.append("<div class=\"footer-divider\"></div>");
        html.append("<div class=\"footer-text\">");
        html.append("© ").append(currentDate).append(" ").append(appName).append(". All rights reserved.<br>");
        html.append("<a href=\"").append(appUrl).append("\" class=\"footer-link\">").append(appName).append(" 바로가기</a>");
        html.append("</div>");
        html.append("<div class=\"social-links\">");
        html.append("<a href=\"#\">개인정보처리방침</a> |");
        html.append("<a href=\"#\">이용약관</a> |");
        html.append("<a href=\"#\">고객센터</a>");
        html.append("</div>");
        html.append("</div>");
        html.append("</div>");
        html.append("</body>");
        html.append("</html>");

        return html.toString();
    }

    // ================= 이메일 템플릿 메서드 =================

    /**
     * 회원가입 인증 이메일 템플릿
     */
    private String buildSignupEmailTemplate(String verificationToken) {
        StringBuilder content = new StringBuilder();
        content.append("<div class=\"welcome-text\">이메일 인증을 완료해주세요! 🎉</div>");
        content.append("<div class=\"description\">");
        content.append(appName).append("에 가입해 주셔서 감사합니다.<br>");
        content.append("아래 인증번호를 입력하여 계정 활성화를 완료해주세요.");
        content.append("</div>");

        content.append("<div class=\"verification-card\">");
        content.append("<div class=\"verification-label\">인증번호</div>");
        content.append("<div class=\"verification-code\">").append(verificationToken).append("</div>");
        content.append("</div>");

        content.append("<div class=\"info-box\">");
        content.append("<div class=\"info-title\">📌 안내사항</div>");
        content.append("<ul class=\"info-list\">");
        content.append("<li><strong>유효시간:</strong> 5분 (인증번호 재발급 가능)</li>");
        content.append("<li><strong>보안:</strong> 타인과 공유하지 마세요</li>");
        content.append("<li><strong>문제 발생시:</strong> 고객센터로 문의해주세요</li>");
        content.append("</ul>");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 32px 0;\">");
        content.append("<p style=\"color: #64748b; font-size: 14px;\">");
        content.append("본인이 요청하지 않은 경우, 이 이메일을 무시하셔도 됩니다.");
        content.append("</p>");
        content.append("</div>");

        return buildBaseTemplate("이메일 인증", content.toString());
    }

    /**
     * 아이디 찾기 결과 이메일 템플릿
     */
    private String buildFoundIdEmailTemplate(String foundId, String regDate) {
        String regDateDisplay = "";
        if (regDate != null) {
            regDateDisplay = "<div class=\"reg-date\">가입일: " + regDate + "</div>";
        }

        StringBuilder content = new StringBuilder();
        content.append("<div class=\"welcome-text\">아이디를 찾았습니다! 🔍</div>");
        content.append("<div class=\"description\">");
        content.append("요청하신 아이디 찾기가 완료되었습니다.<br>");
        content.append("아래 정보를 확인하고 로그인해주세요.");
        content.append("</div>");

        content.append("<div class=\"found-id-display\">");
        content.append("<div class=\"found-id-label\">찾은 아이디</div>");
        content.append("<div class=\"found-id-value\">").append(foundId).append("</div>");
        content.append(regDateDisplay);
        content.append("</div>");

        content.append("<div class=\"info-box success\">");
        content.append("<div class=\"info-title\">✅ 다음 단계</div>");
        content.append("<ul class=\"info-list\">");
        content.append("<li>위 아이디로 로그인하실 수 있습니다</li>");
        content.append("<li>비밀번호를 잊으셨다면 '비밀번호 찾기'를 이용해주세요</li>");
        content.append("<li>보안을 위해 정기적으로 비밀번호를 변경해주세요</li>");
        content.append("</ul>");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 32px 0;\">");
        content.append("<a href=\"").append(appUrl).append("/login\" class=\"cta-button\">로그인하러 가기</a>");
        content.append("</div>");

        return buildBaseTemplate("아이디 찾기 결과", content.toString());
    }

    /**
     * 비밀번호 재설정 이메일 템플릿
     */
    private String buildPasswordResetEmailTemplate(String resetToken) {
        StringBuilder content = new StringBuilder();
        content.append("<div class=\"welcome-text\">비밀번호를 재설정해주세요 🔐</div>");
        content.append("<div class=\"description\">");
        content.append("아래 인증번호로 새로운 비밀번호를 설정해주세요.");
        content.append("</div>");

        content.append("<div class=\"verification-card\">");
        content.append("<div class=\"verification-label\">재설정 인증번호</div>");
        content.append("<div class=\"verification-code\">").append(resetToken).append("</div>");
        content.append("</div>");

        content.append("<div class=\"info-box danger\">");
        content.append("<div class=\"info-title\">🚨 보안 주의사항</div>");
        content.append("<ul class=\"info-list\">");
        content.append("<li><strong>유효시간:</strong> 5분 (시간 초과 시 재요청)</li>");
        content.append("<li><strong>본인 확인:</strong> 요청하지 않았다면 즉시 고객센터 연락</li>");
        content.append("<li><strong>개인정보 보호:</strong> 인증번호를 타인과 절대 공유 금지</li>");
        content.append("</ul>");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 32px 0;\">");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 24px 0;\">");
        content.append("<p style=\"color: #64748b; font-size: 14px;\">");
        content.append("본인이 요청하지 않은 경우, 계정 보안을 위해 고객센터로 연락해주세요.");
        content.append("</p>");
        content.append("</div>");

        return buildBaseTemplate("비밀번호 재설정", content.toString());
    }

    /**
     * 비밀번호 변경 완료 알림 이메일 템플릿
     */
    private String buildPasswordChangeNotificationTemplate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String changeTime = sdf.format(new Date());

        StringBuilder content = new StringBuilder();
        content.append("<div class=\"welcome-text\">비밀번호 변경이 완료되었습니다! ✅</div>");
        content.append("<div class=\"description\">");
        content.append("계정 보안이 성공적으로 업데이트되었습니다.<br>");
        content.append("이제 새로운 비밀번호로 로그인하실 수 있습니다.");
        content.append("</div>");

        content.append("<div class=\"info-box success\">");
        content.append("<div class=\"info-title\">🎉 변경 완료</div>");
        content.append("<ul class=\"info-list\">");
        content.append("<li><strong>변경 시간:</strong> ").append(changeTime).append("</li>");
        content.append("<li><strong>상태:</strong> 정상 처리됨</li>");
        content.append("<li><strong>보안 수준:</strong> 강화됨</li>");
        content.append("</ul>");
        content.append("</div>");

        content.append("<div class=\"info-box warning\">");
        content.append("<div class=\"info-title\">🔐 보안 권장사항</div>");
        content.append("<ul class=\"info-list\">");
        content.append("<li>새 비밀번호를 안전한 곳에 보관하세요</li>");
        content.append("<li>정기적으로(3-6개월) 비밀번호를 변경하세요</li>");
        content.append("<li>다른 사이트와 동일한 비밀번호 사용을 피하세요</li>");
        content.append("<li>의심스러운 활동 발견 시 즉시 신고하세요</li>");
        content.append("</ul>");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 32px 0;\">");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 24px 0;\">");
        content.append("<p style=\"color: #ef4444; font-size: 14px; font-weight: 500;\">");
        content.append("⚠️ 본인이 변경하지 않았다면 즉시 고객센터(1588-0000)로 연락해주세요.");
        content.append("</p>");
        content.append("</div>");

        return buildBaseTemplate("비밀번호 변경 완료", content.toString());
    }

    /**
     * 새 비밀번호 이메일 템플릿
     */
    private String buildNewPasswordEmailTemplate(String newPassword) {
        StringBuilder content = new StringBuilder();
        content.append("<div class=\"welcome-text\">새로운 비밀번호가 발급되었습니다! 🔑</div>");
        content.append("<div class=\"description\">");
        content.append("요청하신 비밀번호 재설정이 완료되었습니다.<br>");
        content.append("아래 새 비밀번호로 로그인 후 반드시 비밀번호를 변경해주세요.");
        content.append("</div>");

        content.append("<div class=\"verification-card\">");
        content.append("<div class=\"verification-label\">새 비밀번호</div>");
        content.append("<div class=\"verification-code\">").append(newPassword).append("</div>");
        content.append("</div>");

        content.append("<div class=\"info-box warning\">");
        content.append("<div class=\"info-title\">🔐 보안 주의사항</div>");
        content.append("<ul class=\"info-list\">");
        content.append("<li><strong>즉시 변경:</strong> 로그인 후 마이페이지에서 비밀번호를 변경하세요</li>");
        content.append("<li><strong>안전 보관:</strong> 이 비밀번호를 안전한 곳에 기록해두세요</li>");
        content.append("<li><strong>개인정보 보호:</strong> 타인과 절대 공유하지 마세요</li>");
        content.append("</ul>");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 32px 0;\">");
        content.append("<a href=\"").append(appUrl).append("/login\" class=\"cta-button\">로그인하러 가기</a>");
        content.append("</div>");

        content.append("<div style=\"text-align: center; margin: 24px 0;\">");
        content.append("<p style=\"color: #ef4444; font-size: 14px; font-weight: 500;\">");
        content.append("⚠️ 본인이 요청하지 않았다면 즉시 고객센터(1588-0000)로 연락해주세요.");
        content.append("</p>");
        content.append("</div>");

        return buildBaseTemplate("새 비밀번호 안내", content.toString());
    }
}