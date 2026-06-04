package com.project.backend.domain.like.controller;


import com.project.backend.domain.like.service.PromptLikeService;
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
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
public class PromptLikeController {

    private final PromptLikeService promptLikeService;

    @PostMapping("/{promptId}/likes")
    public ResponseEntity<ApiResponse<String>> toggleLike(
            @PathVariable Long promptId,
            @AuthenticationPrincipal UserDetails userDetails) {

        String email = userDetails.getUsername();

        boolean isLiked = promptLikeService.toggleLike(promptId, email);

        String message = isLiked ? "좋아요 등록 완료" : "좋아요 취소 완료";

        return ResponseEntity.ok(ApiResponse.success(message));
    }

}
