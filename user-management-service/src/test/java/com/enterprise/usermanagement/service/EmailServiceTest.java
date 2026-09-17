package com.enterprise.usermanagement.service;

import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    private JavaMailSender mailSender;
    private ObjectProvider<JavaMailSender> mailSenderProvider;
    private SmtpEmailService emailService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        mailSenderProvider = mock(ObjectProvider.class);
        when(mailSenderProvider.getIfAvailable()).thenReturn(mailSender);
        emailService = new SmtpEmailService(mailSenderProvider);
    }

    @Test
    void testSendInvitationEmail_NoCredentials_ReturnsFalseGracefully() {
        // Without setting username/password, should return false safely
        boolean result = emailService.sendInvitationEmail("test@enterprise.com", "STANDARD_USER", "http://localhost:3000/register?token=123");
        assertFalse(result);
        verifyNoInteractions(mailSender);
    }

    @Test
    void testSendInvitationEmail_ConfiguredCredentials_SendsSuccessfully() {
        ReflectionTestUtils.setField(emailService, "smtpUsername", "saibhanu301@gmail.com");
        ReflectionTestUtils.setField(emailService, "smtpPassword", "app-password");

        MimeMessage mimeMessage = mock(MimeMessage.class);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        boolean result = emailService.sendInvitationEmail("partner@enterprise.com", "PORTAL_VIEWER", "http://localhost:3000/register?token=456");

        assertTrue(result);
        verify(mailSender, times(1)).send(mimeMessage);
    }

    @Test
    void testSendInvitationEmail_ExceptionDuringSend_ReturnsFalseGracefully() {
        ReflectionTestUtils.setField(emailService, "smtpUsername", "saibhanu301@gmail.com");
        ReflectionTestUtils.setField(emailService, "smtpPassword", "app-password");

        when(mailSender.createMimeMessage()).thenThrow(new RuntimeException("SMTP connection failed"));

        boolean result = emailService.sendInvitationEmail("partner@enterprise.com", "ADMIN", "http://localhost:3000/register?token=789");

        assertFalse(result);
    }
}
