package com.project.backend.domain.user.service;
import com.project.backend.domain.user.dto.TokenResponseDto;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.domain.user.dto.EmailVerifyRequestDto;
import com.project.backend.domain.user.dto.UserRequestDto;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.auth.JwtTokenProvider;
import com.project.backend.global.auth.RefreshTokenService;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    private final UserRepository userRepository;
    private final EmailVerificationService emailVerificationService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

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

    @Transactional
    public void signup(UserRequestDto.SignUpRequestDto dto) {
        // ✅ 이메일 인증 체크 스킵 (발표용)
        // if (!emailVerificationService.isVerified(dto.getEmail()))
        //     throw new CustomException(ErrorCode.EMAIL_NOT_VERIFIED);

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

        // emailVerificationService.deleteVerified(dto.getEmail());
    }

    public TokenResponseDto login(UserRequestDto.LoginRequestDto dto) {
        PromptUser user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword()))
            throw new CustomException(ErrorCode.INVALID_INPUT);
        String accessToken = jwtTokenProvider.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getEmail());
        refreshTokenService.saveRefreshToken(user.getEmail(), refreshToken);
        return new TokenResponseDto(accessToken, refreshToken);
    }
}