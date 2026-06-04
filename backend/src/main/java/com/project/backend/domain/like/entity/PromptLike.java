package com.project.backend.domain.like.entity;

import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(
        name = "likes",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "prompt_id"})
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PromptLike extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "likes_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private PromptUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prompt_id", nullable = false)
    private Prompt prompt;

    @Builder
    public PromptLike(PromptUser user, Prompt prompt) {
        this.user = user;
        this.prompt = prompt;
    }
}
