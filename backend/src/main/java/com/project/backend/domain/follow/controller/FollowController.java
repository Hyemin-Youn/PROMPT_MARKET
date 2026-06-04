package com.project.backend.domain.follow.controller;

import com.project.backend.domain.follow.service.FollowService;
import com.project.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{userId}/follow")
    public ResponseEntity<ApiResponse<String>> toggleFollow(
            @PathVariable("userId") Long followingId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();

        boolean isFollowed = followService.toggleFollow(followingId, email);

        String message = isFollowed ? "팔로우 완료" : "팔로우 취소";

        return ResponseEntity.ok(ApiResponse.success(message));
    }
}
