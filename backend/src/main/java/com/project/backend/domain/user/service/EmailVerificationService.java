package com.project.backend.domain.user.service;

import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final RedisTemplate<String, String> redisTemplate;
    private final JavaMailSender mailSender;

    @Value("${email.code.expiration}")
    private long expiration;

    private static final String CODE_PREFIX     = "email:code:";
    private static final String VERIFIED_PREFIX = "email:verified:";

    // 코드 생성 및 메일 발송
    public void sendCode(String email) {
        String code = generateCode();

        redisTemplate.opsForValue()
                .set(CODE_PREFIX + email, code, expiration, TimeUnit.SECONDS);

        sendMail(email, code);
    }

    // 코드 검증
    public void verifyCode(String email, String inputCode) {
        String savedCode = redisTemplate.opsForValue().get(CODE_PREFIX + email);

        if (savedCode == null)
            throw new CustomException(ErrorCode.EMAIL_CODE_EXPIRED);
        if (!savedCode.equals(inputCode))
            throw new CustomException(ErrorCode.EMAIL_CODE_INVALID);

        // 인증 완료 표시 (10분 유지 — 이 시간 안에 가입 완료해야 함)
        redisTemplate.delete(CODE_PREFIX + email);
        redisTemplate.opsForValue()
                .set(VERIFIED_PREFIX + email, "true", 600, TimeUnit.SECONDS);
    }

    // 인증 여부 확인
    public boolean isVerified(String email) {
        return Boolean.TRUE.toString()
                .equals(redisTemplate.opsForValue().get(VERIFIED_PREFIX + email));
    }

    // 인증 완료 키 삭제 (가입 확정 후)
    public void deleteVerified(String email) {
        redisTemplate.delete(VERIFIED_PREFIX + email);
    }

    private String generateCode() {
        return String.format("%06d", new SecureRandom().nextInt(1_000_000));
    }

    private void sendMail(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("[PromptMart] 이메일 인증 코드");
        message.setText("인증 코드: " + code + "\n\n5분 안에 입력해 주세요.");

        mailSender.send(message);
    }
}