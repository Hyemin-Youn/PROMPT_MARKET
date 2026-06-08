package com.project.backend.domain.follow.controller;

import com.project.backend.domain.follow.dto.FollowCountResponseDto;
import com.project.backend.domain.follow.dto.FollowResponseDto;
import com.project.backend.domain.follow.service.FollowService;
import com.project.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
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
public class FollowController {

    private final FollowService followService;

    @PostMapping("/{followingId}/follow")
    public ResponseEntity<ApiResponse<String>> toggleFollow(
            @PathVariable Long followingId,
            @AuthenticationPrincipal UserDetails userDetails) {


        String email = userDetails.getUsername();
        boolean isFollowed = followService.toggleFollow(followingId, email);
        String message = isFollowed ? "팔로우 완료" : "팔로우 취소";

        return ResponseEntity.ok(ApiResponse.success(message));
    }

    @GetMapping("/followings")
    public ResponseEntity<ApiResponse<List<FollowResponseDto>>> getMyFollowings(
            @AuthenticationPrincipal UserDetails userDetails) {


        String email = userDetails.getUsername();
        List<FollowResponseDto> followings = followService.getFollowings(email);

        return ResponseEntity.ok(ApiResponse.success(followings));
    }

    @GetMapping("/followers")
    public ResponseEntity<ApiResponse<List<FollowResponseDto>>> getMyFollowers(
            @AuthenticationPrincipal UserDetails userDetails) {


        String email = userDetails.getUsername();
        List<FollowResponseDto> followers = followService.getFollowers(email);

        return ResponseEntity.ok(ApiResponse.success(followers));
    }

    @GetMapping("/follow/counts")
    public ResponseEntity<ApiResponse<FollowCountResponseDto>> getMyFollowCounts(
            @AuthenticationPrincipal UserDetails userDetails) {


        String email = userDetails.getUsername();
        FollowCountResponseDto followCounts = followService.getFollowCounts(email);

        return ResponseEntity.ok(ApiResponse.success(followCounts));
    }

    @GetMapping("/follow-info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyFollowInfo(
            @AuthenticationPrincipal UserDetails userDetails) {


        String email = userDetails.getUsername();

        Map<String, Object> response = new HashMap<>();
        response.put("followers", followService.getFollowers(email));
        response.put("followings", followService.getFollowings(email));
        response.put("counts", followService.getFollowCounts(email));

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}