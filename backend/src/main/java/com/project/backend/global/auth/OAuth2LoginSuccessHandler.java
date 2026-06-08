package com.project.backend.global.auth;

import com.project.backend.domain.user.repository.UserRepository;
import com.project.backend.domain.user.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;


@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = extractEmail(oAuth2User);

        String role = authentication.getAuthorities().stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("USER");

        String accessToken = jwtTokenProvider.generateToken(email, role);
        String refreshToken = jwtTokenProvider.generateRefreshToken(email, role);

        // Redis에 저장
        refreshTokenService.saveRefreshToken(email, refreshToken);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/api/auth/reissue")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        boolean isNew = customOAuth2UserService.consumeNewUserFlag(email);
        String redirect = isNew
                ? frontendUrl + "/oauth2/callback?setup=true"
                : frontendUrl + "/oauth2/callback";
        response.sendRedirect(redirect);
    }

    private String extractEmail(OAuth2User user) {
        // 구글
        if (user.getAttribute("email") != null) {
            return user.getAttribute("email");
        }

        // 깃허브
        String login = user.getAttribute("login");
        return "github_" + login + "@promptmart.com";
    }
}