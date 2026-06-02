package com.project.backend.global.auth;

import com.project.backend.domain.user.Entity.PromptUser;
import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 이메일 추출 (카카오/구글 공통)
        String email = extractEmail(oAuth2User);

        PromptUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        String token = jwtTokenProvider.generateToken(email, user.getRole().name());

        // 쿠키 설정
        Cookie cookie = new Cookie("accessToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);       // 로컬 테스트는 false, 운영 시 true (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24);

        response.addCookie(cookie);
        response.sendRedirect("/oauth2/callback");  // 토큰 쿼리 파라미터 제거

    }

    private String extractEmail(OAuth2User user) {
        // 구글
        if (user.getAttribute("email") != null) {
            return user.getAttribute("email");
        }

        // 카카오
        Map<String, Object> kakaoAccount = user.getAttribute("kakao_account");
        return (String) kakaoAccount.get("email");
    }
}