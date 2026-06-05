package com.project.backend.prompt.dto;

import com.project.backend.prompt.entity.Prompt;
import com.project.backend.prompt.enums.AiType;
import com.project.backend.prompt.enums.PromptCategory;
import com.project.backend.prompt.enums.PromptStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PromptDetailResponse {

    private Long id;
    private Long userId;
    private String title;
    private String content;
    private String preview;
    private String thumbnailUrl;
    private int price;
    private PromptCategory category;
    private AiType aiType;
    private float rating;
    private int viewCount;
    private PromptStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PromptDetailResponse from(Prompt prompt) {
        return PromptDetailResponse.builder()
                .id(prompt.getId())
                .userId(prompt.getUserId())
                .title(prompt.getTitle())
                .content(prompt.getContent())
                .preview(prompt.getPreview())
                .thumbnailUrl(prompt.getThumbnailUrl())
                .price(prompt.getPrice())
                .category(prompt.getCategory())
                .aiType(prompt.getAiType())
                .rating(prompt.getRating())
                .viewCount(prompt.getViewCount())
                .status(prompt.getStatus())
                .createdAt(prompt.getCreatedAt())
                .updatedAt(prompt.getUpdatedAt())
                .build();
    }
}