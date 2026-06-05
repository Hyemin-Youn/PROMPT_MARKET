package com.project.backend.prompt.entity;


import com.project.backend.prompt.enums.AiType;
import com.project.backend.prompt.enums.PromptCategory;
import com.project.backend.prompt.enums.PromptStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name= "prompt")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Prompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prompt_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String title;


    @Lob
    @Column(nullable = false)
    private String content;

    @Lob
    @Column(nullable = false)
    private String preview;

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;


    @Column(nullable = false)
    private int price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "ai_type", nullable = false)
    private AiType aiType;

    @Column(nullable = false)
    private float rating;


    @Column(name = "view_count", nullable = false)
    private int viewCount;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PromptStatus status;


    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = PromptStatus.ACTIVE;
        this.rating = 0;
        this.viewCount = 0;
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void increaseViewCount() {
        this.viewCount++;
    }

    public void update(String title, String content, String preview, String thumbnailUrl, int price, PromptCategory category, AiType aiType) {

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
        return this.userId.equals(userId);
    }
}
