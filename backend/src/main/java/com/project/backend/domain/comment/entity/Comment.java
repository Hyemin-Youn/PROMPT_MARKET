package com.project.backend.domain.comment.entity;

import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    @Column(name = "content", nullable = false, length = 1000)
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CommentStatus status;

    // 댓글 : 회원 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private PromptUser user;

    // 댓글 : 프롬프트 (N:1)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;


    @Builder
    public Comment(String content, CommentStatus status, PromptUser user, Prompt prompt) {
        this.content = content;
        this.status = status != null ? status : CommentStatus.ACTIVE;
        this.user = user;
        this.prompt = prompt;
    }

    // 댓글 수정 로직
    public void updateContent(String content) {
        this.content = content;
    }

    // 댓글 삭제 로직
    public void deleteComment() {
        this.status = CommentStatus.DELETED;
    }

}
