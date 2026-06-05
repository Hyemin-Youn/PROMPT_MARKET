package com.project.backend.domain.comment.dto;

import com.project.backend.domain.comment.entity.Comment;
import com.project.backend.domain.comment.entity.CommentStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponseDto {

    private Long commentId;
    private String content;
    private CommentStatus status;
    private Long userId;
    private String nickname;
    private Long promptId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    @Builder
    public CommentResponseDto(Long commentId, String content, CommentStatus status,
                              Long userId, String nickname, Long promptId,
                              LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.commentId = commentId;
        this.content = content;
        this.status = status;
        this.userId = userId;
        this.nickname = nickname;
        this.promptId = promptId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static CommentResponseDto from(Comment comment) {
        return CommentResponseDto.builder()
                .commentId(comment.getId())
                .content(comment.getContent())
                .status(comment.getStatus())
                .userId(comment.getUser().getId())
                .nickname(comment.getUser().getNickname())
                .promptId(comment.getPrompt().getPromptId())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
