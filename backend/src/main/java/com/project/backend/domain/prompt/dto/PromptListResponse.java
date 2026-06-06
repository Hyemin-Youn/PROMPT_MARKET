package com.project.backend.domain.prompt.dto;

import com.project.backend.domain.prompt.entity.AiType;
import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.prompt.entity.PromptCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PromptListResponse {

    private Long id;
    private String title;
    private String preview;
    private String thumbnailUrl;
    private int price;
    private PromptCategory category;
    private AiType aiType;
    private float rating;
    private int viewCount;
    private Long userId;
    private LocalDateTime createdAt;

    public static PromptListResponse from(Prompt prompt) {
        return PromptListResponse.builder()
                .id(prompt.getPromptId())
                .title(prompt.getTitle())
                .preview(prompt.getPreview())
                .thumbnailUrl(prompt.getThumbnailUrl())
                .price(prompt.getPrice())
                .category(prompt.getCategory())
                .aiType(prompt.getAiType())
                .rating(prompt.getRating())
                .viewCount(prompt.getViewCount())
                .userId(prompt.getUser().getId())
                .createdAt(prompt.getCreatedAt())
                .build();
    }
}