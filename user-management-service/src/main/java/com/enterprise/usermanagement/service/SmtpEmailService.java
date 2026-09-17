package com.enterprise.usermanagement.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * Enterprise SMTP Email Service supporting real Gmail dispatch and local testing.
 */
@Service
public class SmtpEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(SmtpEmailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Value("${spring.mail.password:}")
    private String smtpPassword;

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String smtpHost;

    public SmtpEmailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    @Override
    public boolean sendInvitationEmail(String recipientEmail, String role, String invitationUrl) {
        if (smtpUsername == null || smtpUsername.isBlank() || smtpPassword == null || smtpPassword.isBlank()) {
            log.warn("[SmtpEmailService] SMTP credentials are not configured. " +
                     "Outbound email to '{}' was skipped. To enable real Gmail delivery, set SMTP_USERNAME and SMTP_PASSWORD.",
                     recipientEmail);
            return false;
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            log.warn("[SmtpEmailService] JavaMailSender is not available in application context.");
            return false;
        }

        try {
            log.info("[SmtpEmailService] Connecting to {} to deliver invitation to {}...", smtpHost, recipientEmail);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(smtpUsername, "Apex Identity Enterprise Suite");
            helper.setTo(recipientEmail);
            helper.setSubject("You're invited to join Apex Identity Enterprise Portal");

            String htmlBody = buildInvitationHtml(recipientEmail, role, invitationUrl);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("[SmtpEmailService] Email successfully delivered to {} via {}", recipientEmail, smtpHost);
            return true;
        } catch (Exception ex) {
            log.error("[SmtpEmailService] Failed to deliver email to {}: {}", recipientEmail, ex.getMessage(), ex);
            return false;
        }
    }

    private String buildInvitationHtml(String recipientEmail, String role, String invitationUrl) {
        String template = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Apex Identity Invitation</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f8fafc; margin: 0; padding: 32px 16px; }
                .wrapper { max-width: 580px; margin: 0 auto; background: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.5); }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%); padding: 32px; text-align: left; }
                .header h1 { margin: 0; font-size: 24px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px; }
                .header p { margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.9); }
                .content { padding: 32px; color: #cbd5e1; font-size: 15px; line-height: 1.6; }
                .role-badge { display: inline-block; background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 6px; padding: 6px 12px; font-weight: 600; font-size: 13px; margin: 10px 0; }
                .btn-container { text-align: center; margin: 32px 0; }
                .btn { display: inline-block; background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%); color: #ffffff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; }
                .info-box { background: #1e293b; border-radius: 8px; padding: 16px; margin: 24px 0 0; border: 1px solid #334155; font-size: 13px; color: #94a3b8; }
                .footer { padding: 20px 32px; background: #0f172a; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <div class="header">
                  <h1>Apex Identity Enterprise</h1>
                  <p>Corporate Access &amp; Directory Portal</p>
                </div>
                <div class="content">
                  <p style="margin-top: 0;">Hello,</p>
                  <p>You have received an official invitation to join the <strong>Apex Identity</strong> enterprise directory with the following assigned role scope:</p>
                  <div><span class="role-badge">{{ROLE}}</span></div>
                  <p>To accept this invitation and complete your single-use profile onboarding, please click the button below:</p>
                  <div class="btn-container">
                    <a href="{{URL}}" target="_blank" rel="noopener noreferrer" class="btn">Accept Invitation &amp; Register &rarr;</a>
                  </div>
                  <div class="info-box">
                    <strong style="color: #f1f5f9;">Single-Use Security Notice:</strong><br>
                    This invitation link will expire in 48 hours and can only be redeemed once.<br><br>
                    If the button does not open, paste this URL into your browser:<br>
                    <a href="{{URL}}" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; word-break: break-all; font-size: 12px;">{{URL}}</a>
                  </div>
                </div>
                <div class="footer">
                  &copy; Apex Identity Corporation &bull; Automated Security System &bull; Please do not reply
                </div>
              </div>
            </body>
            </html>
            """;
        return template
            .replace("{{ROLE}}", role)
            .replace("{{URL}}", invitationUrl);
    }
}
