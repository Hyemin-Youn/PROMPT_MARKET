package com.project.backend.domain.like.controller;


import com.project.backend.domain.like.dto.PromptLikeResponseDto;
import com.project.backend.domain.like.service.PromptLikeService;
import com.project.backend.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptLikeController {

    private final PromptLikeService promptLikeService;

    // 프롬프트 '좋아요' 등록 및 취소
    @PostMapping("/{promptId}/likes")
    public ResponseEntity<ApiResponse<String>> toggleLike(
            @PathVariable Long promptId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();

        boolean isLiked = promptLikeService.toggleLike(promptId, email);

        String message = isLiked ? "좋아요 등록 완료" : "좋아요 취소 완료";

        return ResponseEntity.ok(ApiResponse.success(message));
    }

    // 프롬프트 '좋아요'한 목록 가져오기
    @GetMapping("/liked")
    public ResponseEntity<ApiResponse<List<PromptLikeResponseDto>>> getMyLikedPrompts(
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();

        List<PromptLikeResponseDto> likedPrompts = promptLikeService.getMyLikedPrompts(email);

        return ResponseEntity.ok(ApiResponse.success(likedPrompts));
    }


    // '찜하기' 해놓은 게시글인지 아닌지 확인
    @GetMapping("/{promptId}/is-liked")
    public ResponseEntity<ApiResponse<Boolean>> checkIsLiked(
            @PathVariable Long promptId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();
        boolean isLiked = promptLikeService.isLiked(promptId, email);

        return ResponseEntity.ok(ApiResponse.success(isLiked));
    }
}
