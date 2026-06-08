package com.project.backend.domain.user.controller;

import com.project.backend.domain.user.service.UserService;
import com.project.backend.global.auth.RefreshTokenService;
import com.project.backend.global.common.response.ApiResponse;
import com.project.backend.global.exception.CustomException;
import com.project.backend.global.exception.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final RefreshTokenService refreshTokenService;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMe(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        String nickname = userService.getNickname(email);
        Long userId = userService.getUserId(email);

        Map<String, Object> data = new HashMap<>();
        data.put("email", email);
        data.put("nickname", nickname);
        data.put("userId", userId);

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletResponse response,
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
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }

    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<List<Object>>> getActivity(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(List.of()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<String>> updateProfile(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        String nickname = request.get("nickname");

        userService.updateProfile(email, nickname);

        return ResponseEntity.ok(ApiResponse.success("프로필 수정 완료"));
    }
}
