package com.project.backend.domain.prompt.entity;

import com.project.backend.domain.user.entity.PromptUser;
import com.project.backend.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "prompt")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Prompt extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long promptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private PromptUser user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String preview;

    @Column(length = 500)
    private String thumbnailUrl;

    @Column(nullable = false)
    private int price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AiType aiType;

    @Column(nullable = false)
    private float rating;

    @Column(nullable = false)
    private int viewCount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptStatus status;

    @Builder
    public Prompt(PromptUser user, String title, String content, String preview,
                  String thumbnailUrl, int price, PromptCategory category, AiType aiType) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.preview = preview;
        this.thumbnailUrl = thumbnailUrl;
        this.price = price;
        this.category = category;
        this.aiType = aiType;
    }

    @PrePersist
    public void onCreate() {
        this.status = PromptStatus.ACTIVE;
        this.rating = 0;
        this.viewCount = 0;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    public void update(String title, String content, String preview, String thumbnailUrl,
                       int price, PromptCategory category, AiType aiType) {
        this.title = title;
        this.content = content;
        this.preview = preview;
        this.thumbnailUrl = thumbnailUrl;
        this.price = price;
        this.category = category;
        this.aiType = aiType;
    }

    public void hide() {
        this.status = PromptStatus.HIDDEN;
    }

    public void delete() {
        this.status = PromptStatus.DELETED;
    }

    public boolean isOwner(Long userId) {
        return this.user.getId().equals(userId);
    }
}
