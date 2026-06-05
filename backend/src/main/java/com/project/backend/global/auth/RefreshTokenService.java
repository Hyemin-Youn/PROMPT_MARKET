package com.project.backend.global.auth;

import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RedisTemplate<String, String> redisTemplate;
    private final JwtTokenProvider jwtTokenProvider;

    private static final String REFRESH_PREFIX = "refresh:";

    // Refresh Token 저장
    public void saveRefreshToken(String email, String refreshToken) {

        redisTemplate.opsForValue()
                .set(
                    REFRESH_PREFIX + email,
                    refreshToken,
                    jwtTokenProvider.getRefreshExpiration(),
                    TimeUnit.MILLISECONDS
                );
    }

    // Refresh Token으로 Access Token 재발급
    public String reissue(String refreshToken) {

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        String email = jwtTokenProvider.getEmail(refreshToken);
        String savedToken = redisTemplate.opsForValue().get(REFRESH_PREFIX + email);

        if (savedToken == null || !savedToken.equals(refreshToken)) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        return jwtTokenProvider.generateToken(email, "USER");
    }

    // 로그아웃 시 삭제
    public void deleteRefreshToken(String email) {
        redisTemplate.delete(REFRESH_PREFIX + email);
    }
}