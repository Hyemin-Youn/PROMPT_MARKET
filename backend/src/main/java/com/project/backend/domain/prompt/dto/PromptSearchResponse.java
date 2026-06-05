package com.project.backend.domain.prompt.dto;

import com.project.backend.domain.prompt.entity.AiType;
import com.project.backend.domain.prompt.entity.Prompt;
import com.project.backend.domain.prompt.entity.PromptCategory;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PromptSearchResponse {

    private final Long promptId;
    private final String title;
    private final String preview;
    private final String thumbnailUrl;
    private final int price;
    private final PromptCategory category;
    private final AiType aiType;
    private final float rating;
    private final int viewCount;
    private final String sellerNickname;
    private final LocalDateTime createdAt;

    private PromptSearchResponse(Prompt prompt) {
        this.promptId = prompt.getPromptId();
        this.title = prompt.getTitle();
        this.preview = prompt.getPreview();
        this.thumbnailUrl = prompt.getThumbnailUrl();
        this.price = prompt.getPrice();
        this.category = prompt.getCategory();
        this.aiType = prompt.getAiType();
        this.rating = prompt.getRating();
        this.viewCount = prompt.getViewCount();
        this.sellerNickname = prompt.getUser().getNickname();
        this.createdAt = prompt.getCreatedAt();
    }

    public static PromptSearchResponse from(Prompt prompt) {
        return new PromptSearchResponse(prompt);
    }
}
