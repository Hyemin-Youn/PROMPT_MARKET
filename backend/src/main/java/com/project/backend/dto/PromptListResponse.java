package com.project.backend.dto;

import com.project.backend.entity.Prompt;
import com.project.backend.enums.AiType;
import com.project.backend.enums.PromptCategory;
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
                .id(prompt.getId())
                .title(prompt.getTitle())
                .preview(prompt.getPreview())
                .thumbnailUrl(prompt.getThumbnailUrl())
                .price(prompt.getPrice())
                .category(prompt.getCategory())
                .aiType(prompt.getAiType())
                .rating(prompt.getRating())
                .viewCount(prompt.getViewCount())
                .userId(prompt.getUserId())
                .createdAt(prompt.getCreatedAt())
                .build();
    }
}
