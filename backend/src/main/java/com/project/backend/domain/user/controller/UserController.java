package com.project.backend.domain.user.controller;


import com.project.backend.domain.user.dto.EmailVerifyRequestDto;
import com.project.backend.domain.user.dto.UserRequestDto;
import com.project.backend.domain.user.service.UserService;
import com.project.backend.global.common.response.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1단계: 인증코드 발송
    @PostMapping("/send-code")
    public ResponseEntity<ApiResponse<Void>> sendCode(@Valid @RequestBody UserRequestDto.SignUpRequestDto dto) {

        userService.sendVerificationCode(dto);

        return ResponseEntity
                .ok(ApiResponse.success("인증 코드가 발송되었습니다."));
    }

    // 2단계: 코드 검증
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@Valid @RequestBody EmailVerifyRequestDto dto) {
        userService.verifyEmail(dto);

        return ResponseEntity
                .ok(ApiResponse.success("이메일 인증이 완료되었습니다."));
    }

    // 3단계: 가입 확정
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> signup(@Valid @RequestBody UserRequestDto.SignUpRequestDto dto) {
        userService.signup(dto);

        return ResponseEntity
                .ok(ApiResponse.success("회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Void>> login(
            @Valid @RequestBody UserRequestDto.LoginRequestDto dto,
            HttpServletResponse response
    ) {
        String token = userService.login(dto);

        Cookie cookie = new Cookie("accessToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);       // 로컬 테스트는 false, 운영 시 true (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24);

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(ApiResponse.success("로그인 성공"));
    }
}
