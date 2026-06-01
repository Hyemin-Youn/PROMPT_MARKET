package com.project.backend.domain.comment.dto;

import com.project.backend.domain.comment.entity.Comment;
import com.project.backend.domain.comment.entity.CommentStatus;
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


    public CommentResponseDto(Comment comment) {
        this.commentId = comment.getId();
        this.content = comment.getContent();
        this.status = comment.getStatus();
        this.userId = comment.getUser().getId();
        this.nickname = comment.getUser().getNickname();
        this.promptId = comment.getPrompt().getId();
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }

}
