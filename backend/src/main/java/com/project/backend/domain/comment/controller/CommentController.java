package com.project.backend.domain.comment.controller;

import com.project.backend.domain.comment.dto.CommentRequestDto;
import com.project.backend.domain.comment.dto.CommentResponseDto;
import com.project.backend.domain.comment.service.CommentService;
import com.project.backend.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/prompts/{promptId}/comments")
    public ResponseEntity<ApiResponse<CommentResponseDto>> createComment(
            @PathVariable Long promptId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CommentRequestDto requestDto) {

        CommentResponseDto responseDto = commentService.createComment(promptId, userDetails.getUserId(), requestDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(responseDto));
    }


    @PutMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponseDto>> updateComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CommentRequestDto requestDto) {

        CommentResponseDto responseDto = commentService.updateComment(commentId, userDetails.getUserId(), requestDto);

        return ResponseEntity.ok(ApiResponse.success(responseDto));
    }


    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetails userDetails) {

        commentService.deleteComment(commentId, userDetails.getUserId());

        return ResponseEntity.ok(ApiResponse.success("댓글 삭제 완료"));
    }
}