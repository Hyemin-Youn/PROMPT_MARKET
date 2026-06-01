package com.project.backend.domain.user.service;

import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.dto.EmailVerifyRequestDto;
import com.project.backend.domain.user.dto.UserRequestDto;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final EmailVerificationService emailVerificationService;

    private final PasswordEncoder passwordEncoder;

    // 1단계: 코드 발송
    public void sendVerificationCode(UserRequestDto.SignUpRequestDto dto) {

        if (userRepository.existsByEmail(dto.getEmail()))
            throw new CustomException(ErrorCode.EMAIL_DUPLICATED);

        if (userRepository.existsByNickname(dto.getNickname()))
            throw new CustomException(ErrorCode.NICKNAME_DUPLICATED);

        emailVerificationService.sendCode(dto.getEmail());
    }

    // 2단계: 코드 검증
    public void verifyEmail(EmailVerifyRequestDto dto) {
        emailVerificationService.verifyCode(dto.getEmail(), dto.getCode());
    }

    public void signup(UserRequestDto.SignUpRequestDto dto) {

        if (!emailVerificationService.isVerified(dto.getEmail()))
            throw new CustomException(ErrorCode.EMAIL_NOT_VERIFIED);

        if (userRepository.existsByEmail(dto.getEmail()))
            throw new CustomException(ErrorCode.EMAIL_DUPLICATED);

        if (userRepository.existsByNickname(dto.getNickname()))
            throw new CustomException(ErrorCode.NICKNAME_DUPLICATED);

        userRepository.save(
                PromptUser.builder()
                    .email(dto.getEmail())
                    .password(passwordEncoder.encode(dto.getPassword()))
                    .nickname(dto.getNickname())
                    .build()
        );

        emailVerificationService.deleteVerified(dto.getEmail());
    }
}