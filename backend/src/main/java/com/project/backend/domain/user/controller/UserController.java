package com.project.backend.domain.user.controller;

import com.project.backend.domain.user.dto.EmailVerifyRequestDto;
import com.project.backend.domain.user.dto.TokenResponseDto;
import com.project.backend.domain.user.dto.UserRequestDto;
import com.project.backend.domain.user.service.UserService;
import com.project.backend.global.auth.RefreshTokenService;
import com.project.backend.global.common.response.ApiResponse;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, String>>> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.fail("로그인이 필요합니다."));
        }
        return ResponseEntity.ok(ApiResponse.success(Map.of("email", userDetails.getUsername())));
    }

    @PostMapping("/send-code")
    public ResponseEntity<ApiResponse<Void>> sendCode(@Valid @RequestBody UserRequestDto.SignUpRequestDto dto) {
        userService.sendVerificationCode(dto);
        return ResponseEntity.ok(ApiResponse.success("인증 코드가 발송되었습니다."));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody EmailVerifyRequestDto dto) {
        userService.verifyEmail(dto);
        return ResponseEntity.ok(ApiResponse.success("이메일 인증이 완료되었습니다."));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody UserRequestDto.SignUpRequestDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok(ApiResponse.success("회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(
            @Valid @RequestBody UserRequestDto.LoginRequestDto dto,
            HttpServletResponse response) {

        TokenResponseDto tokens = userService.login(dto);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", tokens.getAccessToken())
                .httpOnly(true).secure(false).path("/").maxAge(Duration.ofDays(1)).sameSite("Lax").build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", tokens.getRefreshToken())
                .httpOnly(true).secure(false).path("/api/auth/reissue").maxAge(Duration.ofDays(7)).sameSite("Lax").build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok(ApiResponse.success("로그인 성공"));
    }

    @PostMapping("/reissue")
    public ResponseEntity<ApiResponse<Void>> reissue(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractCookie(request, "refreshToken");
        if (refreshToken == null) throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);

        String newAccessToken = refreshTokenService.reissue(refreshToken);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true).secure(false).path("/").maxAge(Duration.ofDays(1)).sameSite("Lax").build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        return ResponseEntity.ok(ApiResponse.success("토큰 재발급 성공"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request, HttpServletResponse response,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.fail("로그인이 필요합니다."));
        }

        refreshTokenService.deleteRefreshToken(userDetails.getUsername());

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", "").maxAge(0).path("/").build();
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "").maxAge(0).path("/api/auth/reissue").build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok(ApiResponse.success("로그아웃 성공"));
    }

    @GetMapping("/my-prompts")
    public ResponseEntity<ApiResponse<List<Object>>> getMyPrompts(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.fail("로그인이 필요합니다."));
        }
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }

    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<List<Object>>> getActivity(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.fail("로그인이 필요합니다."));
        }
        return ResponseEntity.ok(ApiResponse.success(List.of())); // ✅ Map.of() → List.of()
    }

    private String extractCookie(HttpServletRequest request, String name) {
        if (request.getCookies() == null) return null;
        for (Cookie cookie : request.getCookies()) {
            if (name.equals(cookie.getName())) return cookie.getValue();
        }
        return null;
    }
}