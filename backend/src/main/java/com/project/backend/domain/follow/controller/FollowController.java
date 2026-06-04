package com.project.backend.domain.follow.controller;

import com.project.backend.domain.follow.dto.FollowResponseDto;
import com.project.backend.domain.follow.service.FollowService;
import com.project.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    // 팔로우 등록 및 취소
    @PostMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<String>> toggleFollow(
            @PathVariable("userId") Long followingId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();

        boolean isFollowed = followService.toggleFollow(followingId, email);

        String message = isFollowed ? "팔로우 완료" : "팔로우 취소";

        return ResponseEntity.ok(ApiResponse.success(message));
    }

    // 팔로윙 목록 가져오기
    @GetMapping("/followings")
    public ResponseEntity<ApiResponse<List<FollowResponseDto>>> getMyFollowings(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        List<FollowResponseDto> followings = followService.getFollowings(email);

        return ResponseEntity.ok(ApiResponse.success(followings));
    }

    // 팔로워 목록 가져오기
    @GetMapping("/followers")
    public ResponseEntity<ApiResponse<List<FollowResponseDto>>> getMyFollowers(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        List<FollowResponseDto> followers = followService.getFollowers(email);

        return ResponseEntity.ok(ApiResponse.success(followers));
    }

}
